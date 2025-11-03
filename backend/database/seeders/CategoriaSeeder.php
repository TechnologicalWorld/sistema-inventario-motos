<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Categoria;

class CategoriaSeeder extends Seeder
{
    public function run(): void
    {
        $categorias = [
            [
                'nombre' => 'Motocicletas', 
                'descripcion' => 'Motocicletas de diferentes cilindradas y marcas'
            ],
            [
                'nombre' => 'Repuestos Motor', 
                'descripcion' => 'Repuestos para motor y transmisión'
            ],
            [
                'nombre' => 'Lubricantes', 
                'descripcion' => 'Aceites y lubricantes para motor y transmisión'
            ],
            [
                'nombre' => 'Cascos', 
                'descripcion' => 'Cascos de seguridad integrales y abatibles'
            ],
            [
                'nombre' => 'Neumáticos', 
                'descripcion' => 'Llantas y neumáticos para diferentes tipos de moto'
            ],
            [
                'nombre' => 'Frenos', 
                'descripcion' => 'Sistema de frenos: pastillas, discos, líquidos'
            ],
            [
                'nombre' => 'Suspensión', 
                'descripcion' => 'Amortiguadores y componentes de suspensión'
            ],
            [
                'nombre' => 'Eléctricos', 
                'descripcion' => 'Componentes del sistema eléctrico y electrónico'
            ],
            [
                'nombre' => 'Accesorios', 
                'descripcion' => 'Accesorios y complementos para motocicletas'
            ],
            [
                'nombre' => 'Herramientas', 
                'descripcion' => 'Herramientas especializadas para mantenimiento'
            ],
            [
                'nombre' => 'Indumentaria', 
                'descripcion' => 'Ropa de protección y equipamiento para motociclista'
            ],
            [
                'nombre' => 'Baterías', 
                'descripcion' => 'Baterías para motocicletas de diferentes tipos'
            ]
        ];

        foreach ($categorias as $categoria) {
            Categoria::create($categoria);
        }
    }
}