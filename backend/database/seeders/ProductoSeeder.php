<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Producto;
use App\Models\Categoria;

class ProductoSeeder extends Seeder
{
    public function run(): void
    {
        $categorias = Categoria::all();

        if ($categorias->isEmpty()) {
            echo "No hay categorías disponibles. Creando categorías primero...\n";
            $this->call(CategoriaSeeder::class);
            $categorias = Categoria::all();
        }

        $productos = [
            // Motocicletas
            [
                'nombre' => 'Yamaha YBR 125',
                'codigoProducto' => 'MOTO-YBR125-001',
                'descripcion' => 'Motocicleta urbana 125cc, económica y confiable',
                'precioVenta' => 8500.00,
                'precioCompra' => 6500.00,
                'stock' => 5,
                'stockMinimo' => 2,
                'estado' => 'activo',   
                'idCategoria' => $categorias->where('nombre', 'Motocicletas')->first()->idCategoria,
            ],
            [
                'nombre' => 'Honda CG 160',
                'codigoProducto' => 'MOTO-CG160-001',
                'descripcion' => 'Motocicleta 160cc, ideal para trabajo y ciudad',
                'precioVenta' => 10500.00,
                'precioCompra' => 8200.00,
                'stock' => 3,
                'stockMinimo' => 1,
                'estado' => 'activo',
                'idCategoria' => $categorias->where('nombre', 'Motocicletas')->first()->idCategoria,
            ],

            // Repuestos Motor
            [
                'nombre' => 'Kit de Pistón 125cc',
                'codigoProducto' => 'REP-PISTON125-001',
                'descripcion' => 'Kit completo de pistón para motos 125cc',
                'precioVenta' => 350.00,
                'precioCompra' => 220.00,
                'stock' => 15,
                'stockMinimo' => 5,
                'estado' => 'activo',
                'idCategoria' => $categorias->where('nombre', 'Repuestos Motor')->first()->idCategoria,
            ],
            [
                'nombre' => 'Cadena de Tiempo',
                'codigoProducto' => 'REP-CADTIEMPO-001',
                'descripcion' => 'Cadena de tiempo para motos 150-200cc',
                'precioVenta' => 180.00,
                'precioCompra' => 120.00,
                'stock' => 25,
                'stockMinimo' => 10,
                'estado' => 'activo',
                'idCategoria' => $categorias->where('nombre', 'Repuestos Motor')->first()->idCategoria,
            ],

            // Lubricantes
            [
                'nombre' => 'Aceite Mobil 4T 20W-50',
                'codigoProducto' => 'LUB-MOBIL4T-001',
                'descripcion' => 'Aceite mineral para motor 4 tiempos, 1 litro',
                'precioVenta' => 45.00,
                'precioCompra' => 28.00,
                'stock' => 50,
                'stockMinimo' => 20,
                'estado' => 'activo',
                'idCategoria' => $categorias->where('nombre', 'Lubricantes')->first()->idCategoria,
            ],
            [
                'nombre' => 'Aceite Castrol Power1',
                'codigoProducto' => 'LUB-CASTROL-001',
                'descripcion' => 'Aceite sintético para alto rendimiento, 1 litro',
                'precioVenta' => 65.00,
                'precioCompra' => 42.00,
                'stock' => 30,
                'stockMinimo' => 15,
                'estado' => 'activo',
                'idCategoria' => $categorias->where('nombre', 'Lubricantes')->first()->idCategoria,
            ],

            // Cascos
            [
                'nombre' => 'Casco Integral LS2',
                'codigoProducto' => 'CAS-LS2INT-001',
                'descripcion' => 'Casco integral LS2, talla M, certificado',
                'precioVenta' => 450.00,
                'precioCompra' => 320.00,
                'stock' => 12,
                'stockMinimo' => 5,
                'estado' => 'activo',
                'idCategoria' => $categorias->where('nombre', 'Cascos')->first()->idCategoria,
            ],
            [
                'nombre' => 'Casco Abatible MT',
                'codigoProducto' => 'CAS-MTABAT-001',
                'descripcion' => 'Casco abatible MT, talla L, doble certificación',
                'precioVenta' => 680.00,
                'precioCompra' => 480.00,
                'stock' => 8,
                'stockMinimo' => 3,
                'estado' => 'activo',
                'idCategoria' => $categorias->where('nombre', 'Cascos')->first()->idCategoria,
            ],

            // Neumáticos
            [
                'nombre' => 'Llanta Delantera 2.75-18',
                'codigoProducto' => 'NEU-DEL-27518-001',
                'descripcion' => 'Neumático delantero para motos estándar',
                'precioVenta' => 220.00,
                'precioCompra' => 150.00,
                'stock' => 20,
                'stockMinimo' => 8,
                'estado' => 'activo',
                'idCategoria' => $categorias->where('nombre', 'Neumáticos')->first()->idCategoria,
            ],
            [
                'nombre' => 'Llanta Trasera 3.00-18',
                'codigoProducto' => 'NEU-TRA-30018-001',
                'descripcion' => 'Neumático trasero para motos estándar',
                'precioVenta' => 280.00,
                'precioCompra' => 190.00,
                'stock' => 18,
                'stockMinimo' => 6,
                'estado' => 'activo',
                'idCategoria' => $categorias->where('nombre', 'Neumáticos')->first()->idCategoria,
            ],

            // Frenos
            [
                'nombre' => 'Pastillas de Freno Delanteras',
                'codigoProducto' => 'FRE-PASTDEL-001',
                'descripcion' => 'Juego de pastillas de freno delanteras',
                'precioVenta' => 85.00,
                'precioCompra' => 55.00,
                'stock' => 40,
                'stockMinimo' => 15,
                'estado' => 'activo',
                'idCategoria' => $categorias->where('nombre', 'Frenos')->first()->idCategoria,
            ],
            [
                'nombre' => 'Líquido de Freno DOT4',
                'codigoProducto' => 'FRE-LIQDOT4-001',
                'descripcion' => 'Líquido de freno DOT4, 250ml',
                'precioVenta' => 25.00,
                'precioCompra' => 15.00,
                'stock' => 60,
                'stockMinimo' => 25,
                'estado' => 'activo',
                'idCategoria' => $categorias->where('nombre', 'Frenos')->first()->idCategoria,
            ]
        ];

        foreach ($productos as $producto) {
            Producto::create($producto);
        }

        // Productos adicionales con factory
        Producto::factory()->count(30)->create();

    }
}