<?php

namespace App\Http\Controllers\Gerente;

use App\Http\Controllers\Controller;
use App\Models\Venta;
use App\Models\Empleado;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class VentaController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Venta::with(['cliente.persona', 'empleado.persona', 'detalleVentas']);

            if ($request->has('empleado')) {
                $query->porEmpleado($request->empleado);
            }

            if ($request->has('fecha_inicio') && $request->has('fecha_fin')) {
                $query->porFecha($request->fecha_inicio, $request->fecha_fin);
            }

            $ventas = $query->orderBy('fecha', 'desc')->paginate(15);

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

    public function show($id)
    {
        try {
            $venta = Venta::with([
                'cliente.persona', 
                'empleado.persona', 
                'detalleVentas.producto'
            ])->findOrFail($id);

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

    public function ventasPorEmpleado()
    {
        try {
            $empleados = Empleado::with(['persona', 'ventas' => function($query) {
                $query->whereDate('fecha', today());
            }])->get()->map(function($empleado) {
                return [
                    'id' => $empleado->idEmpleado,
                    'nombre' => $empleado->nombre_completo,
                    'ventas_hoy' => $empleado->ventas->count(),
                    'monto_hoy' => $empleado->ventas->sum('montoTotal')
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $empleados
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener ventas por empleado',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}