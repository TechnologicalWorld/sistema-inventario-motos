<?php

namespace App\Http\Controllers\Empleado;

use App\Http\Controllers\Controller;
use App\Models\Venta;
use App\Models\DetalleVenta;
use App\Models\Cliente;
use App\Models\Producto;
use App\Models\Persona;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VentaController extends Controller
{
    public function index()
    {
        $ventas = Venta::with(['cliente.persona', 'detalleVentas.producto'])
            ->where('idEmpleado', auth()->id())
            ->orderBy('fecha', 'desc')
            ->paginate(10);

        return response()->json($ventas);
    }

    public function store(Request $request)
    {
        $request->validate([
            'idCliente' => 'required|exists:cliente,idCliente',
            'metodoPago' => 'required|in:efectivo,tarjeta,transferencia',
            'descripcion' => 'nullable|string',
            'detalles' => 'required|array|min:1',
            'detalles.*.idProducto' => 'required|exists:producto,idProducto',
            'detalles.*.cantidad' => 'required|integer|min:1'
        ]);

        DB::beginTransaction();

        try {
            // Verificar stock disponible
            foreach ($request->detalles as $detalle) {
                $producto = Producto::find($detalle['idProducto']);
                if ($producto->stock < $detalle['cantidad']) {
                    throw new \Exception("Stock insuficiente para el producto: {$producto->nombre}");
                }
            }

            $venta = Venta::create([
                'fecha' => now(),
                'montoTotal' => 0, // Se calculará después
                'metodoPago' => $request->metodoPago,
                'descripcion' => $request->descripcion,
                'idCliente' => $request->idCliente,
                'idEmpleado' => auth()->id()
            ]);

            $totalVenta = 0;

            foreach ($request->detalles as $detalle) {
                $producto = Producto::find($detalle['idProducto']);
                $precioUnitario = $producto->precioVenta;
                $subTotal = $precioUnitario * $detalle['cantidad'];
                
                DetalleVenta::create([
                    'cantidad' => $detalle['cantidad'],
                    'precioUnitario' => $precioUnitario,
                    'subTotal' => $subTotal,
                    'descripcion' => $producto->nombre,
                    'idVenta' => $venta->idVenta,
                    'idProducto' => $detalle['idProducto']
                ]);

                // Actualizar stock
                $producto->stock -= $detalle['cantidad'];
                $producto->save();

                $totalVenta += $subTotal;
            }

            // Actualizar total de la venta
            $venta->montoTotal = $totalVenta;
            $venta->save();

            DB::commit();

            return response()->json([
                'message' => 'Venta registrada correctamente',
                'venta' => $venta->load(['cliente.persona', 'detalleVentas.producto'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Error al registrar venta: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $venta = Venta::with(['cliente.persona', 'detalleVentas.producto'])
            ->where('idEmpleado', auth()->id())
            ->findOrFail($id);

        return response()->json($venta);
    }
}