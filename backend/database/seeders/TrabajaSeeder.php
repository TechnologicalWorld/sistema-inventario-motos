<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Empleado;
use App\Models\Departamento;
use App\Models\Trabaja;

class TrabajaSeeder extends Seeder
{
    public function run(): void
    {
        $empleados = Empleado::all();
        $departamentos = Departamento::all();

        $asignaciones = [
            // Asignaciones fijas para empleados principales
            [
                'idEmpleado' => $empleados[0]->idEmpleado, 
                'idDepartamento' => $departamentos->where('nombre', 'Ventas')->first()->idDepartamento,
                'fecha' => '2023-02-01',
                'observacion' => 'Asignación inicial como vendedor'
            ],
            [
                'idEmpleado' => $empleados[1]->idEmpleado,
                'idDepartamento' => $departamentos->where('nombre', 'Almacén')->first()->idDepartamento,
                'fecha' => '2023-03-15',
                'observacion' => 'Responsable de control de inventario'
            ],
            [
                'idEmpleado' => $empleados[2]->idEmpleado, 
                'idDepartamento' => $departamentos->where('nombre', 'Taller')->first()->idDepartamento,
                'fecha' => '2023-01-20',
                'observacion' => 'Mecánico especializado'
            ]
        ];

        foreach ($asignaciones as $asignacion) {
            Trabaja::create($asignacion);
        }

        // Asignaciones aleatorias para otros empleados
        $otrosEmpleados = $empleados->slice(3); 

        foreach ($otrosEmpleados as $empleado) {
            $departamento = $departamentos->random();
            
            Trabaja::create([
                'idEmpleado' => $empleado->idEmpleado,
                'idDepartamento' => $departamento->idDepartamento,
                'fecha' => $empleado->fecha_contratacion,
                'observacion' => 'Asignación automática al departamento de ' . $departamento->nombre
            ]);
        }

        // Algunos empleados en múltiples departamentos
        if ($empleados->count() > 3) {
            $empleadoMulti = $empleados[0]; 
            Trabaja::create([
                'idEmpleado' => $empleadoMulti->idEmpleado,
                'idDepartamento' => $departamentos->where('nombre', 'Marketing')->first()->idDepartamento,
                'fecha' => '2023-06-01',
                'observacion' => 'Apoyo en actividades de marketing'
            ]);
        }

    }
}