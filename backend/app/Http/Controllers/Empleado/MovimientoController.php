<?php

namespace App\Http\Controllers\Empleado;

use App\Http\Controllers\Controller;
use App\Models\MovimientoInventario;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class MovimientoController extends Controller
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

            $movimientos = MovimientoInventario::with('producto')
                ->where('idEmpleado', $user->idEmpleado)
                ->orderBy('fechaMovimiento', 'desc')
                ->paginate(10);

            return response()->json([
                'success' => true,
                'data' => $movimientos
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener los movimientos',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'tipo' => 'required|in:entrada,salida',
            'cantidad' => 'required|integer|min:1',
            'observacion' => 'required|string|max:500',
            'idProducto' => 'required|exists:producto,idProducto'
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

            $producto = Producto::find($request->idProducto);

            if ($request->tipo === 'salida' && $producto->stock < $request->cantidad) {
                return response()->json([
                    'success' => false,
                    'error' => 'Stock insuficiente para realizar la salida'
                ], 422);
            }

            $movimiento = MovimientoInventario::create([
                'tipo' => $request->tipo,
                'cantidad' => $request->cantidad,
                'observacion' => $request->observacion,
                'fechaMovimiento' => now(),
                'idProducto' => $request->idProducto,
                'idEmpleado' => $user->idEmpleado
            ]);

            if ($request->tipo === 'entrada') {
                $producto->stock += $request->cantidad;
            } else {
                $producto->stock -= $request->cantidad;
            }
            $producto->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Movimiento registrado correctamente',
                'data' => $movimiento->load('producto')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'error' => 'Error al registrar movimiento',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}