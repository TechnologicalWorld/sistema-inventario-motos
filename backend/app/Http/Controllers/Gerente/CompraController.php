<?php

namespace App\Http\Controllers\Gerente;

use App\Http\Controllers\Controller;
use App\Models\Compra;
use App\Models\DetalleCompra;
use App\Models\EmpresaProveedora;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CompraController extends Controller
{
    public function index(Request $request)
    {
        $query = Compra::with(['empresaProveedora', 'gerente.persona', 'detalleCompras.producto']);

        if ($request->has('proveedor')) {
            $query->porProveedor($request->proveedor);
        }

        if ($request->has('fecha_inicio') && $request->has('fecha_fin')) {
            $query->porFecha($request->fecha_inicio, $request->fecha_fin);
        }

        $compras = $query->orderBy('fecha', 'desc')->paginate(15);

        return response()->json($compras);
    }

    public function store(Request $request)
    {
        $request->validate([
            'idEmpresaP' => 'required|exists:empresa_proveedora,idEmpresaP',
            'observacion' => 'nullable|string',
            'detalles' => 'required|array|min:1',
            'detalles.*.idProducto' => 'required|exists:producto,idProducto',
            'detalles.*.cantidad' => 'required|integer|min:1',
            'detalles.*.precioUnitario' => 'required|numeric|min:0'
        ]);

        DB::beginTransaction();

        try {
            $compra = Compra::create([
                'fecha' => now(),
                'totalPago' => 0, // Se calculará después
                'observacion' => $request->observacion,
                'idEmpresaP' => $request->idEmpresaP,
                'idGerente' => auth()->id()
            ]);

            $totalCompra = 0;

            foreach ($request->detalles as $detalle) {
                $subTotal = $detalle['cantidad'] * $detalle['precioUnitario'];
                
                DetalleCompra::create([
                    'precioUnitario' => $detalle['precioUnitario'],
                    'subTotal' => $subTotal,
                    'cantidad' => $detalle['cantidad'],
                    'idCompra' => $compra->idCompra,
                    'idProducto' => $detalle['idProducto']
                ]);

                // Actualizar stock del producto
                $producto = Producto::find($detalle['idProducto']);
                $producto->stock += $detalle['cantidad'];
                $producto->save();

                $totalCompra += $subTotal;
            }

            // Actualizar total de la compra
            $compra->totalPago = $totalCompra;
            $compra->save();

            DB::commit();

            return response()->json([
                'message' => 'Compra registrada correctamente',
                'compra' => $compra->load(['empresaProveedora', 'detalleCompras.producto'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Error al registrar compra: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $compra = Compra::with(['empresaProveedora', 'gerente.persona', 'detalleCompras.producto'])
            ->findOrFail($id);

        return response()->json($compra);
    }
}