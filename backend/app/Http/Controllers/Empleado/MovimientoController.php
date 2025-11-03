<?php

namespace App\Http\Controllers\Empleado;

use App\Http\Controllers\Controller;
use App\Models\MovimientoInventario;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MovimientoController extends Controller
{
    public function index()
    {
        $movimientos = MovimientoInventario::with('producto')
            ->where('idEmpleado', auth()->id())
            ->orderBy('fechaMovimiento', 'desc')
            ->paginate(10);

        return response()->json($movimientos);
    }

    public function store(Request $request)
    {
        $request->validate([
            'tipo' => 'required|in:entrada,salida',
            'cantidad' => 'required|integer|min:1',
            'observacion' => 'required|string|max:500',
            'idProducto' => 'required|exists:producto,idProducto'
        ]);

        DB::beginTransaction();

        try {
            $producto = Producto::find($request->idProducto);

            // Validar stock para salidas
            if ($request->tipo === 'salida' && $producto->stock < $request->cantidad) {
                throw new \Exception('Stock insuficiente para realizar la salida');
            }

            $movimiento = MovimientoInventario::create([
                'tipo' => $request->tipo,
                'cantidad' => $request->cantidad,
                'observacion' => $request->observacion,
                'fechaMovimiento' => now(),
                'idProducto' => $request->idProducto,
                'idEmpleado' => auth()->id()
            ]);

            // Actualizar stock
            if ($request->tipo === 'entrada') {
                $producto->stock += $request->cantidad;
            } else {
                $producto->stock -= $request->cantidad;
            }
            $producto->save();

            DB::commit();

            return response()->json([
                'message' => 'Movimiento registrado correctamente',
                'movimiento' => $movimiento->load('producto')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Error al registrar movimiento: ' . $e->getMessage()
            ], 500);
        }
    }
}