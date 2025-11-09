<?php

namespace App\Http\Controllers\Empleado;

use App\Http\Controllers\Controller;
use App\Models\Departamento;
use App\Models\Trabaja;
use Illuminate\Http\Request;

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

            $empleadoId = $user->idUsuario;
            
            $departamento = Departamento::whereHas('empleados', function($query) use ($empleadoId) {
                $query->where('idEmpleado', $empleadoId);
            })->first();

            $historialAsignaciones = Trabaja::with('departamento')
                ->where('idEmpleado', $empleadoId)
                ->orderBy('fecha', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'departamento_actual' => $departamento,
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