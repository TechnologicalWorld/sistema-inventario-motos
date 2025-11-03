<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Departamento;

class DepartamentoSeeder extends Seeder
{
    public function run(): void
    {
        $departamentos = [
            [
                'nombre' => 'Ventas', 
                'descripcion' => 'Departamento de ventas al público y atención al cliente'
            ],
            [
                'nombre' => 'Almacén', 
                'descripcion' => 'Control de inventario, almacén y logística'
            ],
            [
                'nombre' => 'Compras', 
                'descripcion' => 'Departamento de compras y relaciones con proveedores'
            ],
            [
                'nombre' => 'Administración', 
                'descripcion' => 'Administración, finanzas y recursos humanos'
            ],
            [
                'nombre' => 'Taller', 
                'descripcion' => 'Taller de mantenimiento, reparación y servicio técnico'
            ],
            [
                'nombre' => 'Marketing', 
                'descripcion' => 'Marketing, publicidad y promociones'
            ],
            [
                'nombre' => 'Sistemas', 
                'descripcion' => 'Sistemas informáticos y tecnología'
            ]
        ];

        foreach ($departamentos as $departamento) {
            Departamento::create($departamento);
        }
    }
}