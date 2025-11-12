<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Persona;
use App\Models\Propietario;
use App\Models\Gerente;
use App\Models\Empleado;
use App\Models\Cliente;

class PersonaSeeder extends Seeder
{
    public function run(): void
    {
        // ========== PROPIETARIO ==========
        $personaPropietario = Persona::create([
            'ci' => '12345678',
            'paterno' => 'Gonzales',
            'materno' => 'Lopez',
            'nombres' => 'Carlos',
            'fecha_naci' => '1980-05-15',
            'genero' => 'M',
            'telefono' => '77712345',
        ]);

        Propietario::create([
            'idPropietario' => $personaPropietario->idPersona,
            'email' => 'propietario@motoshop.com',
            'password' => Hash::make('password123'),
        ]);

        // ========== GERENTE ==========
        $personaGerente = Persona::create([
            'ci' => '87654321',
            'paterno' => 'Martinez',
            'materno' => 'Rodriguez',
            'nombres' => 'Ana',
            'fecha_naci' => '1985-08-20',
            'genero' => 'F',
            'telefono' => '77754321',
        ]);

        Gerente::create([
            'idGerente' => $personaGerente->idPersona,
            'fecha_contratacion' => '2022-01-15',
            'email' => 'gerente@motoshop.com',
            'direccion' => 'Av. Principal #123, Santa Cruz',
            'password' => Hash::make('password123'),
        ]);

        // ========== EMPLEADOS ==========
        $empleados = [
            [
                'ci' => '11223344',
                'paterno' => 'Perez',
                'materno' => 'Garcia',
                'nombres' => 'Juan',
                'fecha_naci' => '1990-03-10',
                'genero' => 'M',
                'telefono' => '77711223',
                'email' => 'empleado@motoshop.com',
                'direccion' => 'Calle Secundaria #456',
            ],
            [
                'ci' => '44332211',
                'paterno' => 'Lopez',
                'materno' => 'Sanchez',
                'nombres' => 'Maria',
                'fecha_naci' => '1992-11-25',
                'genero' => 'F',
                'telefono' => '77744332',
                'email' => 'maria.lopez@motoshop.com',
                'direccion' => 'Av. Central #789',
            ],
            [
                'ci' => '55664477',
                'paterno' => 'Rodriguez',
                'materno' => 'Vargas',
                'nombres' => 'Luis',
                'fecha_naci' => '1988-07-12',
                'genero' => 'M',
                'telefono' => '77755664',
                'email' => 'luis.rodriguez@motoshop.com',
                'direccion' => 'Calle Junin #321',
            ]
        ];

        foreach ($empleados as $index => $empleado) {
            $personaEmpleado = Persona::create([
                'ci' => $empleado['ci'],
                'paterno' => $empleado['paterno'],
                'materno' => $empleado['materno'],
                'nombres' => $empleado['nombres'],
                'fecha_naci' => $empleado['fecha_naci'],
                'genero' => $empleado['genero'],
                'telefono' => $empleado['telefono'],
            ]);

            Empleado::create([
                'idEmpleado' => $personaEmpleado->idPersona,
                'fecha_contratacion' => now()->subMonths(rand(6, 24))->format('Y-m-d'),
                'email' => $empleado['email'],
                'direccion' => $empleado['direccion'],
                'password' => Hash::make('password123'),
            ]);
        }

        // ========== CLIENTES ==========
        $clientes = [
            [
                'ci' => '99887766',
                'paterno' => 'Torres',
                'materno' => 'Mendez',
                'nombres' => 'Laura',
                'fecha_naci' => '1995-12-05',
                'genero' => 'F',
                'telefono' => '77799887',
                'nit' => '987654321',
            ],
            [
                'ci' => '66778899',
                'paterno' => 'Silva',
                'materno' => 'Rojas',
                'nombres' => 'Roberto',
                'fecha_naci' => '1987-04-18',
                'genero' => 'M',
                'telefono' => '77766778',
                'nit' => '123456789',
            ],
            [
                'ci' => '33445566',
                'paterno' => 'Fernandez',
                'materno' => 'Castro',
                'nombres' => 'Carmen',
                'fecha_naci' => '1993-09-22',
                'genero' => 'F',
                'telefono' => '77733445',
                'nit' => '456789123',
            ],
            [
                'ci' => '77889900',
                'paterno' => 'Gutierrez',
                'materno' => 'Paredes',
                'nombres' => 'David',
                'fecha_naci' => '1982-06-30',
                'genero' => 'M',
                'telefono' => '77777889',
                'nit' => '789123456',
            ]
        ];

        foreach ($clientes as $cliente) {
            $personaCliente = Persona::create([
                'ci' => $cliente['ci'],
                'paterno' => $cliente['paterno'],
                'materno' => $cliente['materno'],
                'nombres' => $cliente['nombres'],
                'fecha_naci' => $cliente['fecha_naci'],
                'genero' => $cliente['genero'],
                'telefono' => $cliente['telefono'],
            ]);

            Cliente::create([
                'idCliente' => $personaCliente->idPersona,
                'nit' => $cliente['nit'],
            ]);
        }

        // ========== PERSONAS ADICIONALES ==========
        for ($i = 0; $i < 15; $i++) {
            $persona = Persona::factory()->create();
            
            $role = rand(1, 3);
            
            switch ($role) {
                case 1:
                    Cliente::factory()->create([
                        'idCliente' => $persona->idPersona,
                        'nit' => $this->generarNit()
                    ]);
                    break;
                case 2:
                    Empleado::factory()->create([
                        'idEmpleado' => $persona->idPersona,
                        'fecha_contratacion' => now()->subMonths(rand(1, 36))->format('Y-m-d')
                    ]);
                    break;
                case 3:
                    if (!Gerente::where('idGerente', '!=', $personaGerente->idPersona)->exists()) {
                        Gerente::factory()->create([
                            'idGerente' => $persona->idPersona,
                            'fecha_contratacion' => now()->subMonths(rand(12, 48))->format('Y-m-d')
                        ]);
                    }
                    break;
            }
        }
    }

    private function generarNit(): string
    {
        return str_pad(rand(1, 999999999), 9, '0', STR_PAD_LEFT);
    }
}