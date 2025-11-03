<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Persona;
use App\Models\Gerente;
use App\Models\Empleado;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Crear usuario para el gerente
        $gerente = Gerente::first();
        if ($gerente) {
            User::create([
                'idUsuario' => $gerente->idGerente,
                'email' => $gerente->email,
                'direccion' => $gerente->direccion,
                'fecha_contratacion' => $gerente->fecha_contratacion,
                'tipo' => 'gerente',
                'password' => $gerente->password,
            ]);
        }

        // Crear usuarios para empleados
        $empleados = Empleado::all();
        foreach ($empleados as $empleado) {
            User::create([
                'idUsuario' => $empleado->idEmpleado,
                'email' => $empleado->email,
                'direccion' => $empleado->direccion,
                'fecha_contratacion' => $empleado->fecha_contratacion,
                'tipo' => 'empleado',
                'password' => $empleado->password,
            ]);
        }

        echo "UserSeeder completado. \n";
        echo "- " . User::count() . " usuarios creados\n";
    }
}