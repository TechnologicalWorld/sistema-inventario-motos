<?php

namespace App\Http\Controllers\Empleado;

use App\Http\Controllers\Controller;
use App\Models\Venta;
use App\Models\DetalleVenta;
use App\Models\Cliente;
use App\Models\Producto;
use App\Models\Persona;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class VentaController extends Controller
{
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'error' => 'Usuario no autenticado'
                ], 401);
            }

            $ventas = Venta::with(['cliente.persona', 'detalleVentas.producto'])
                ->where('idEmpleado', $user->idEmpleado)
                ->orderBy('fecha', 'desc')
                ->paginate(10);

            return response()->json([
                'success' => true,
                'data' => $ventas
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener las ventas',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'idCliente' => 'required|exists:cliente,idCliente',
            'metodoPago' => 'required|in:efectivo,tarjeta,transferencia',
            'descripcion' => 'nullable|string',
            'detalles' => 'required|array|min:1',
            'detalles.*.idProducto' => 'required|exists:producto,idProducto',
            'detalles.*.cantidad' => 'required|integer|min:1'
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
            foreach ($request->detalles as $detalle) {
                $producto = Producto::find($detalle['idProducto']);
                if (!$producto) {
                    throw new \Exception("Producto no encontrado");
                }
                if ($producto->stock < $detalle['cantidad']) {
                    throw new \Exception("Stock insuficiente para el producto: {$producto->nombre}. Stock disponible: {$producto->stock}");
                }
            }

            $venta = Venta::create([
                'fecha' => now(),
                'montoTotal' => 0,
                'metodoPago' => $request->metodoPago,
                'descripcion' => $request->descripcion,
                'idCliente' => $request->idCliente,
                'idEmpleado' => $user->idEmpleado // CORREGIDO: idUsuario -> idEmpleado
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

                $producto->stock -= $detalle['cantidad'];
                $producto->save();

                $totalVenta += $subTotal;
            }

            $venta->montoTotal = $totalVenta;
            $venta->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Venta registrada correctamente',
                'data' => $venta->load(['cliente.persona', 'detalleVentas.producto'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'error' => 'Error al registrar venta',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Request $request, $id)
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'error' => 'Usuario no autenticado'
                ], 401);
            }

            $venta = Venta::with(['cliente.persona', 'detalleVentas.producto'])
                ->where('idEmpleado', $user->idEmpleado) 
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $venta
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Venta no encontrada'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener la venta',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}