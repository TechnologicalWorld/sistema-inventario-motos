<?php

namespace App\Http\Controllers\Gerente;

use App\Http\Controllers\Controller;
use App\Models\Compra;
use App\Models\DetalleCompra;
use App\Models\EmpresaProveedora;
use App\Models\Producto;
use App\Models\Gerente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CompraController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Compra::with(['empresaProveedora', 'gerente.persona', 'detalleCompras.producto']);

            if ($request->has('proveedor')) {
                $query->porProveedor($request->proveedor);
            }

            if ($request->has('fecha_inicio') && $request->has('fecha_fin')) {
                $query->porFecha($request->fecha_inicio, $request->fecha_fin);
            }

            $compras = $query->orderBy('fecha', 'desc')->paginate(15);

            return response()->json([
                'success' => true,
                'data' => $compras
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener las compras',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'idEmpresaP' => 'required|exists:empresa_proveedora,idEmpresaP',
            'observacion' => 'nullable|string',
            'detalles' => 'required|array|min:1',
            'detalles.*.idProducto' => 'required|exists:producto,idProducto',
            'detalles.*.cantidad' => 'required|integer|min:1',
            'detalles.*.precioUnitario' => 'required|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();

        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'error' => 'Usuario no autenticado'
                ], 401);
            }

            // Obtener el gerente autenticado - DIFERENTES OPCIONES
            $gerente = Gerente::where('email', $user->email)->first();
            
            // Si no funciona por email, intentar por idUsuario
            if (!$gerente) {
                $gerente = Gerente::find($user->idUsuario);
            }
            
            // Si aún no encontramos el gerente, buscar por relación con persona
            if (!$gerente) {
                $gerente = Gerente::whereHas('persona', function($query) use ($user) {
                    $query->where('idPersona', $user->idUsuario);
                })->first();
            }

            if (!$gerente) {
                return response()->json([
                    'success' => false,
                    'error' => 'Usuario no es un gerente válido. ID Usuario: ' . $user->idUsuario
                ], 403);
            }

            $compra = Compra::create([
                'fecha' => now(),
                'totalPago' => 0,
                'observacion' => $request->observacion,
                'idEmpresaP' => $request->idEmpresaP,
                'idGerente' => $gerente->idGerente
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
                if ($producto) {
                    $producto->stock += $detalle['cantidad'];
                    $producto->save();
                }

                $totalCompra += $subTotal;
            }

            $compra->totalPago = $totalCompra;
            $compra->save();

            DB::commit();

            // Cargar relaciones
            $compra->load([
                'empresaProveedora', 
                'gerente.persona',
                'detalleCompras.producto'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Compra registrada correctamente',
                'data' => $compra
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'error' => 'Error al registrar compra',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $compra = Compra::with(['empresaProveedora', 'gerente.persona', 'detalleCompras.producto'])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $compra
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Compra no encontrada'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener la compra',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}