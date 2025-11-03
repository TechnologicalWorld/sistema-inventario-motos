<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Venta;
use App\Models\DetalleVenta;
use App\Models\Empleado;
use App\Models\Cliente;
use App\Models\Producto;

class VentaSeeder extends Seeder
{
    public function run(): void
    {
        $empleados = Empleado::all();
        $clientes = Cliente::all();
        $productos = Producto::where('stock', '>', 0)->get();

        if ($empleados->isEmpty() || $clientes->isEmpty() || $productos->isEmpty()) {
            echo "VentaSeeder: No hay empleados, clientes o productos con stock. Skipping...\n";
            return;
        }

        $ventas = [
            [
                'fecha' => '2024-01-18 10:30:00',
                'montoTotal' => 0, // Se calculará
                'metodoPago' => 'efectivo',
                'descripcion' => 'Venta de repuestos y aceite',
                'idCliente' => $clientes[0]->idCliente,
                'idEmpleado' => $empleados[0]->idEmpleado,
                'detalles' => [
                    [
                        'idProducto' => $productos[2]->idProducto,
                        'cantidad' => 2,
                        'precioUnitario' => 350.00,
                        'subTotal' => 700.00,
                        'descripcion' => 'Kit pistón 125cc'
                    ],
                    [
                        'idProducto' => $productos[4]->idProducto, 
                        'cantidad' => 3,
                        'precioUnitario' => 45.00,
                        'subTotal' => 135.00,
                        'descripcion' => 'Aceite Mobil 4T 1L'
                    ]
                ]
            ],
            [
                'fecha' => '2024-01-22 16:45:00',
                'montoTotal' => 0, // Se calculará
                'metodoPago' => 'tarjeta',
                'descripcion' => 'Venta de casco y accesorios',
                'idCliente' => $clientes[1]->idCliente,
                'idEmpleado' => $empleados[0]->idEmpleado,
                'detalles' => [
                    [
                        'idProducto' => $productos[6]->idProducto, 
                        'cantidad' => 1,
                        'precioUnitario' => 450.00,
                        'subTotal' => 450.00,
                        'descripcion' => 'Casco integral LS2 Talla M'
                    ]
                ]
            ],
            [
                'fecha' => '2024-02-10 11:20:00',
                'montoTotal' => 0, // Se calculará
                'metodoPago' => 'transferencia',
                'descripcion' => 'Venta de neumáticos',
                'idCliente' => $clientes[2]->idCliente,
                'idEmpleado' => $empleados[1]->idEmpleado,
                'detalles' => [
                    [
                        'idProducto' => $productos[8]->idProducto, 
                        'cantidad' => 1,
                        'precioUnitario' => 220.00,
                        'subTotal' => 220.00,
                        'descripcion' => 'Llanta delantera 2.75-18'
                    ],
                    [
                        'idProducto' => $productos[9]->idProducto, 
                        'cantidad' => 1,
                        'precioUnitario' => 280.00,
                        'subTotal' => 280.00,
                        'descripcion' => 'Llanta trasera 3.00-18'
                    ]
                ]
            ]
        ];

        foreach ($ventas as $ventaData) {
            // Calcular total
            $total = 0;
            foreach ($ventaData['detalles'] as $detalle) {
                $total += $detalle['subTotal'];
            }

            $ventaData['montoTotal'] = $total;

            // Crear venta
            $venta = Venta::create([
                'fecha' => $ventaData['fecha'],
                'montoTotal' => $ventaData['montoTotal'],
                'metodoPago' => $ventaData['metodoPago'],
                'descripcion' => $ventaData['descripcion'],
                'idCliente' => $ventaData['idCliente'],
                'idEmpleado' => $ventaData['idEmpleado'],
            ]);

            // Crear detalles
            foreach ($ventaData['detalles'] as $detalleData) {
                DetalleVenta::create([
                    'cantidad' => $detalleData['cantidad'],
                    'precioUnitario' => $detalleData['precioUnitario'],
                    'subTotal' => $detalleData['subTotal'],
                    'descripcion' => $detalleData['descripcion'],
                    'idVenta' => $venta->idVenta,
                    'idProducto' => $detalleData['idProducto'],
                ]);

                // Actualizar stock del producto
                $producto = Producto::find($detalleData['idProducto']);
                $producto->stock -= $detalleData['cantidad'];
                $producto->save();
            }
        }

        // Ventas adicionales
        for ($i = 0; $i < 15; $i++) {
            $this->crearVentaAleatoria($empleados, $clientes, $productos);
        }

        echo "VentaSeeder completado. \n";
        echo "- " . Venta::count() . " ventas creadas\n";
        echo "- " . DetalleVenta::count() . " detalles de venta creados\n";
    }

    private function crearVentaAleatoria($empleados, $clientes, $productos)
    {
        $venta = Venta::create([
            'fecha' => now()->subDays(rand(1, 30))->format('Y-m-d H:i:s'),
            'montoTotal' => 0,
            'metodoPago' => $this->metodoPagoAleatorio(),
            'descripcion' => 'Venta automática #' . rand(1000, 9999),
            'idCliente' => $clientes->random()->idCliente,
            'idEmpleado' => $empleados->random()->idEmpleado,
        ]);

        $total = 0;
        $numDetalles = rand(1, 3);

        for ($j = 0; $j < $numDetalles; $j++) {
            $producto = $productos->where('stock', '>', 0)->random();
            $cantidad = rand(1, min(5, $producto->stock)); // No vender más del stock disponible
            $precioUnitario = $producto->precioVenta;
            $subTotal = $precioUnitario * $cantidad;

            DetalleVenta::create([
                'cantidad' => $cantidad,
                'precioUnitario' => $precioUnitario,
                'subTotal' => $subTotal,
                'descripcion' => $producto->nombre,
                'idVenta' => $venta->idVenta,
                'idProducto' => $producto->idProducto,
            ]);

            // Actualizar stock
            $producto->stock -= $cantidad;
            $producto->save();

            $total += $subTotal;
        }

        $venta->montoTotal = $total;
        $venta->save();
    }

    private function metodoPagoAleatorio(): string
    {
        $metodos = ['efectivo', 'tarjeta', 'transferencia'];
        return $metodos[array_rand($metodos)];
    }
}