<?php

namespace App\Http\Controllers\Empleado;

use App\Http\Controllers\Controller;
use App\Models\Departamento;
use App\Models\Trabaja;
use Illuminate\Http\Request;

class DepartamentoController extends Controller
{
    public function miDepartamento()
    {
        $empleadoId = auth()->id();
        
        $departamento = Departamento::whereHas('empleados', function($query) use ($empleadoId) {
            $query->where('idEmpleado', $empleadoId);
        })->first();

        $historialAsignaciones = Trabaja::with('departamento')
            ->where('idEmpleado', $empleadoId)
            ->orderBy('fecha', 'desc')
            ->get();

        return response()->json([
            'departamento_actual' => $departamento,
            'historial_asignaciones' => $historialAsignaciones
        ]);
    }
}