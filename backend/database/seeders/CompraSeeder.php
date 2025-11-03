<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Compra;
use App\Models\DetalleCompra;
use App\Models\Gerente;
use App\Models\EmpresaProveedora;
use App\Models\Producto;

class CompraSeeder extends Seeder
{
    public function run(): void
    {
        $gerentes = Gerente::all();
        $proveedores = EmpresaProveedora::all();
        $productos = Producto::all();

        if ($gerentes->isEmpty() || $proveedores->isEmpty() || $productos->isEmpty()) {
            echo "CompraSeeder: No hay gerentes, proveedores o productos. Skipping...\n";
            return;
        }

        $compras = [
            [
                'fecha' => '2024-01-15 09:30:00',
                'totalPago' => 0, // Se calculará
                'observacion' => 'Compra mensual de repuestos',
                'idEmpresaP' => $proveedores[0]->idEmpresaP,
                'idGerente' => $gerentes[0]->idGerente,
                'detalles' => [
                    [
                        'idProducto' => $productos[2]->idProducto, 
                        'precioUnitario' => 220.00,
                        'cantidad' => 10,
                        'subTotal' => 2200.00
                    ],
                    [
                        'idProducto' => $productos[3]->idProducto,
                        'precioUnitario' => 120.00,
                        'cantidad' => 15,
                        'subTotal' => 1800.00
                    ]
                ]
            ],
            [
                'fecha' => '2024-01-20 14:15:00',
                'totalPago' => 0, // Se calculará
                'observacion' => 'Compra de lubricantes y aceites',
                'idEmpresaP' => $proveedores[5]->idEmpresaP,
                'idGerente' => $gerentes[0]->idGerente,
                'detalles' => [
                    [
                        'idProducto' => $productos[4]->idProducto, 
                        'precioUnitario' => 28.00,
                        'cantidad' => 40,
                        'subTotal' => 1120.00
                    ],
                    [
                        'idProducto' => $productos[5]->idProducto,
                        'precioUnitario' => 42.00,
                        'cantidad' => 25,
                        'subTotal' => 1050.00
                    ]
                ]
            ],
            [
                'fecha' => '2024-02-05 11:00:00',
                'totalPago' => 0,
                'observacion' => 'Compra de equipamiento de seguridad',
                'idEmpresaP' => $proveedores[7]->idEmpresaP,
                'idGerente' => $gerentes[0]->idGerente,
                'detalles' => [
                    [
                        'idProducto' => $productos[6]->idProducto, 
                        'precioUnitario' => 320.00,
                        'cantidad' => 8,
                        'subTotal' => 2560.00
                    ],
                    [
                        'idProducto' => $productos[7]->idProducto, 
                        'precioUnitario' => 480.00,
                        'cantidad' => 5,
                        'subTotal' => 2400.00
                    ]
                ]
            ]
        ];

        foreach ($compras as $compraData) {
            // Calcular total
            $total = 0;
            foreach ($compraData['detalles'] as $detalle) {
                $total += $detalle['subTotal'];
            }

            $compraData['totalPago'] = $total;

            // Crear compra
            $compra = Compra::create([
                'fecha' => $compraData['fecha'],
                'totalPago' => $compraData['totalPago'],
                'observacion' => $compraData['observacion'],
                'idEmpresaP' => $compraData['idEmpresaP'],
                'idGerente' => $compraData['idGerente'],
            ]);

            // Crear detalles
            foreach ($compraData['detalles'] as $detalleData) {
                DetalleCompra::create([
                    'precioUnitario' => $detalleData['precioUnitario'],
                    'subTotal' => $detalleData['subTotal'],
                    'cantidad' => $detalleData['cantidad'],
                    'idCompra' => $compra->idCompra,
                    'idProducto' => $detalleData['idProducto'],
                ]);

                // Actualizar stock del producto
                $producto = Producto::find($detalleData['idProducto']);
                $producto->stock += $detalleData['cantidad'];
                $producto->save();
            }
        }

        // Compras adicionales
        for ($i = 0; $i < 8; $i++) {
            $this->crearCompraAleatoria($gerentes, $proveedores, $productos);
        }

        echo "CompraSeeder completado. \n";
        echo "- " . Compra::count() . " compras creadas\n";
        echo "- " . DetalleCompra::count() . " detalles de compra creados\n";
    }

    private function crearCompraAleatoria($gerentes, $proveedores, $productos)
    {
        $compra = Compra::create([
            'fecha' => now()->subDays(rand(1, 60))->format('Y-m-d H:i:s'),
            'totalPago' => 0,
            'observacion' => 'Compra automática #' . rand(1000, 9999),
            'idEmpresaP' => $proveedores->random()->idEmpresaP,
            'idGerente' => $gerentes->random()->idGerente,
        ]);

        $total = 0;
        $numDetalles = rand(1, 4);

        for ($j = 0; $j < $numDetalles; $j++) {
            $producto = $productos->random();
            $cantidad = rand(5, 30);
            $precioUnitario = $producto->precioCompra;
            $subTotal = $precioUnitario * $cantidad;

            DetalleCompra::create([
                'precioUnitario' => $precioUnitario,
                'subTotal' => $subTotal,
                'cantidad' => $cantidad,
                'idCompra' => $compra->idCompra,
                'idProducto' => $producto->idProducto,
            ]);

            // Actualizar stock
            $producto->stock += $cantidad;
            $producto->save();

            $total += $subTotal;
        }

        $compra->totalPago = $total;
        $compra->save();
    }
}