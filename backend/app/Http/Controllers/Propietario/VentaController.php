<?php

namespace App\Http\Controllers\Propietario;

use App\Http\Controllers\Controller;
use App\Models\Venta;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class VentaController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Venta::with(['cliente.persona', 'empleado.persona']);

            // Filtros
            if ($request->has('fecha_inicio') && $request->has('fecha_fin')) {
                $query->porFecha($request->fecha_inicio, $request->fecha_fin);
            }

            if ($request->has('empleado')) {
                $query->porEmpleado($request->empleado);
            }

            if ($request->has('search')) {
                $query->whereHas('cliente.persona', function($q) use ($request) {
                    $q->where('nombres', 'like', "%{$request->search}%")
                      ->orWhere('paterno', 'like', "%{$request->search}%");
                });
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
            $venta = Venta::with(['cliente.persona', 'empleado.persona', 'detalleVentas.producto'])
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

    public function generarReporte(Request $request)
    {
        try {
            $query = Venta::with(['cliente.persona', 'empleado.persona', 'detalleVentas']);

            if ($request->has('fecha_inicio') && $request->has('fecha_fin')) {
                $query->porFecha($request->fecha_inicio, $request->fecha_fin);
            }

            $ventas = $query->orderBy('fecha', 'desc')->get();

            return response()->json([
                'success' => true,
                'message' => 'Reporte de ventas generado correctamente',
                'data' => [
                    'ventas' => $ventas,
                    'total_ventas' => $ventas->count(),
                    'monto_total' => $ventas->sum('montoTotal')
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al generar el reporte',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}