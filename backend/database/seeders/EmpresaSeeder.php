<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Empresa;

class EmpresaSeeder extends Seeder
{
    public function run(): void
    {
        Empresa::create([
            'mision' => 'Proveer soluciones de movilidad eficientes y accesibles mediante la venta de motocicletas de calidad, repuestos y servicios post-venta excepcionales, contribuyendo al desarrollo de nuestra comunidad.',
            'vision' => 'Ser la tienda de motos líder en la región, reconocida por nuestra calidad, servicio al cliente y compromiso con la seguridad vial, innovando constantemente para superar las expectativas de nuestros clientes.',
            'nombre' => 'MotoShop Bolivia',
            'logo' => 'logo_motoshop.png',
            'telefono' => '+591-777-123456',
        ]);
    }
}