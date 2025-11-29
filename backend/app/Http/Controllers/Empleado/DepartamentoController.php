<?php

namespace App\Http\Controllers\Empleado;

use App\Http\Controllers\Controller;
use App\Models\Departamento;
use App\Models\Trabaja;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;



class DepartamentoController extends Controller
{
    public function miDepartamento(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'error' => 'Usuario no autenticado'
                ], 401);
            }

            $empleadoId = $user->idEmpleado;
            
            $departamentosActuales = Trabaja::with('departamento')
                ->where('idEmpleado', $empleadoId)
                ->get()
                ->map(function($trabajo) {
                    return [
                        'departamento' => $trabajo->departamento,
                        'fecha_asignacion' => $trabajo->fecha,
                        'observacion' => $trabajo->observacion
                    ];
                });

            $historialAsignaciones = Trabaja::with('departamento')
                ->where('idEmpleado', $empleadoId)
                ->orderBy('fecha', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'departamentos_actuales' => $departamentosActuales,
                    'historial_asignaciones' => $historialAsignaciones
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener información del departamento',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}