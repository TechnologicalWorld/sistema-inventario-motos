<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EmpresaProveedora;

class EmpresaProveedoraSeeder extends Seeder
{
    public function run(): void
    {
        $proveedores = [
            [
                'nombre' => 'MotoParts S.A.',
                'telefono' => '777-111111',
                'contacto' => 'Ing. Roberto Silva',
                'direccion' => 'Av. Industrial #123, Zona Franca, Santa Cruz',
            ],
            [
                'nombre' => 'Repuestos Nacionales Ltda.',
                'telefono' => '777-222222',
                'contacto' => 'Lic. Carla Mendoza',
                'direccion' => 'Calle Comercio #456, Mercado de Repuestos, La Paz',
            ],
            [
                'nombre' => 'Importadora de Motos Bolivia',
                'telefono' => '777-333333',
                'contacto' => 'Sr. Javier Rios',
                'direccion' => 'Zona Franca #789, El Alto, La Paz',
            ],
            [
                'nombre' => 'Distribuidora Yamaha Official',
                'telefono' => '777-444444',
                'contacto' => 'Sr. Miguel Angel',
                'direccion' => 'Av. Petrolera #321, Santa Cruz',
            ],
            [
                'nombre' => 'Honda Parts Center',
                'telefono' => '777-555555',
                'contacto' => 'Sra. Patricia Cruz',
                'direccion' => 'Calle Automotor #654, Cochabamba',
            ],
            [
                'nombre' => 'Lubricantes Mobil Bolivia',
                'telefono' => '777-666666',
                'contacto' => 'Ing. Fernando Vargas',
                'direccion' => 'Av. Refineria #987, Santa Cruz',
            ],
            [
                'nombre' => 'Neumáticos Dunlop',
                'telefono' => '777-777777',
                'contacto' => 'Sr. Carlos Montaño',
                'direccion' => 'Zona Industrial #147, Santa Cruz',
            ],
            [
                'nombre' => 'Cascos Safety First',
                'telefono' => '777-888888',
                'contacto' => 'Lic. Veronica Ribera',
                'direccion' => 'Av. Seguridad #258, La Paz',
            ]
        ];

        foreach ($proveedores as $proveedor) {
            EmpresaProveedora::create($proveedor);
        }

        // Proveedores adicionales con factory
        EmpresaProveedora::factory()->count(7)->create();

    }
}