<?php

namespace App\Http\Controllers\Gerente;

use App\Http\Controllers\Controller;
use App\Models\Venta;
use App\Models\Empleado;
use Illuminate\Http\Request;

class VentaController extends Controller
{
    public function index(Request $request)
    {
        $query = Venta::with(['cliente.persona', 'empleado.persona', 'detalleVentas']);

        if ($request->has('empleado')) {
            $query->porEmpleado($request->empleado);
        }

        if ($request->has('fecha_inicio') && $request->has('fecha_fin')) {
            $query->porFecha($request->fecha_inicio, $request->fecha_fin);
        }

        $ventas = $query->orderBy('fecha', 'desc')->paginate(15);

        return response()->json($ventas);
    }

    public function show($id)
    {
        $venta = Venta::with([
            'cliente.persona', 
            'empleado.persona', 
            'detalleVentas.producto'
        ])->findOrFail($id);

        return response()->json($venta);
    }

    public function ventasPorEmpleado()
    {
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

        return response()->json($empleados);
    }
}