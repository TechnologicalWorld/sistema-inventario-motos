<?php

namespace App\Http\Controllers\Propietario;

use App\Http\Controllers\Controller;
use App\Models\Empleado;
use Illuminate\Http\Request;

class EmpleadoController extends Controller
{
    public function index()
    {
        $empleados = Empleado::with(['persona', 'departamentos'])
            ->get()
            ->map(function($empleado) {
                return [
                    'id' => $empleado->idEmpleado,
                    'nombre_completo' => $empleado->nombre_completo,
                    'ci' => $empleado->ci,
                    'telefono' => $empleado->telefono,
                    'fecha_contratacion' => $empleado->fecha_contratacion,
                    'departamentos' => $empleado->departamentos->pluck('nombre'),
                    'total_ventas' => $empleado->total_ventas,
                    'monto_total_ventas' => $empleado->monto_total_ventas
                ];
            });

        return response()->json($empleados);
    }

    public function desempenio($id)
    {
        $empleado = Empleado::with(['persona', 'ventas' => function($query) {
            $query->with('detalleVentas')->latest()->take(10);
        }, 'movimientos' => function($query) {
            $query->with('producto')->latest()->take(10);
        }])->findOrFail($id);

        return response()->json([
            'empleado' => $empleado,
            'estadisticas' => [
                'total_ventas' => $empleado->total_ventas,
                'monto_total_ventas' => $empleado->monto_total_ventas,
                'total_movimientos' => $empleado->total_movimientos
            ]
        ]);
    }
}