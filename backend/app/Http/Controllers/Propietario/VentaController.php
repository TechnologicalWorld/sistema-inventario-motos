<?php

namespace App\Http\Controllers\Propietario;

use App\Http\Controllers\Controller;
use App\Models\Venta;
use Illuminate\Http\Request;

class VentaController extends Controller
{
    public function index(Request $request)
    {
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

        return response()->json($ventas);
    }

    public function show($id)
    {
        $venta = Venta::with(['cliente.persona', 'empleado.persona', 'detalleVentas.producto'])
            ->findOrFail($id);

        return response()->json($venta);
    }

    public function generarReporte(Request $request)
    {
        $query = Venta::with(['cliente.persona', 'empleado.persona', 'detalleVentas']);

        if ($request->has('fecha_inicio') && $request->has('fecha_fin')) {
            $query->porFecha($request->fecha_inicio, $request->fecha_fin);
        }

        $ventas = $query->orderBy('fecha', 'desc')->get();

        //  para generar PDF/Excel
        return response()->json([
            'message' => 'Reporte de ventas generado',
            'ventas' => $ventas,
            'total_ventas' => $ventas->count(),
            'monto_total' => $ventas->sum('montoTotal')
        ]);
    }
}