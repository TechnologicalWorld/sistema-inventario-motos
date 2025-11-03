<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MovimientoInventario;
use App\Models\Empleado;
use App\Models\Producto;

class MovimientoInventarioSeeder extends Seeder
{
    public function run(): void
    {
        $empleados = Empleado::all();
        $productos = Producto::all();

        if ($empleados->isEmpty() || $productos->isEmpty()) {
            echo "MovimientoInventarioSeeder: No hay empleados o productos. Skipping...\n";
            return;
        }

        // Movimientos de ajuste de inventario
        $movimientos = [
            [
                'tipo' => 'entrada',
                'cantidad' => 5,
                'observacion' => 'Ajuste de inventario inicial',
                'fechaMovimiento' => '2024-01-01 08:00:00',
                'idEmpleado' => $empleados[0]->idEmpleado,
                'idProducto' => $productos[0]->idProducto,
            ],
            [
                'tipo' => 'salida',
                'cantidad' => 2,
                'observacion' => 'Producto dañado en almacén',
                'fechaMovimiento' => '2024-01-10 14:30:00',
                'idEmpleado' => $empleados[1]->idEmpleado,
                'idProducto' => $productos[2]->idProducto,
            ],
            [
                'tipo' => 'entrada',
                'cantidad' => 10,
                'observacion' => 'Devolución de cliente',
                'fechaMovimiento' => '2024-01-25 11:15:00',
                'idEmpleado' => $empleados[0]->idEmpleado,
                'idProducto' => $productos[4]->idProducto,
            ],
            [
                'tipo' => 'salida',
                'cantidad' => 3,
                'observacion' => 'Uso interno del taller',
                'fechaMovimiento' => '2024-02-05 16:45:00',
                'idEmpleado' => $empleados[2]->idEmpleado,
                'idProducto' => $productos[10]->idProducto, 
            ]
        ];

        foreach ($movimientos as $movimientoData) {
            MovimientoInventario::create($movimientoData);

            // Actualizar stock del producto
            $producto = Producto::find($movimientoData['idProducto']);
            if ($movimientoData['tipo'] === 'entrada') {
                $producto->stock += $movimientoData['cantidad'];
            } else {
                $producto->stock -= $movimientoData['cantidad'];
            }
            $producto->save();
        }

        // Movimientos adicionales
        for ($i = 0; $i < 20; $i++) {
            $this->crearMovimientoAleatorio($empleados, $productos);
        }

        echo "MovimientoInventarioSeeder completado. \n";
        echo "- " . MovimientoInventario::count() . " movimientos de inventario creados\n";
    }

    private function crearMovimientoAleatorio($empleados, $productos)
    {
        $tipo = rand(0, 1) ? 'entrada' : 'salida';
        $producto = $productos->random();
        $cantidad = rand(1, 10);

        // Para salidas, verificar que haya stock suficiente
        if ($tipo === 'salida' && $producto->stock < $cantidad) {
            return; // Saltar este movimiento
        }

        $movimiento = MovimientoInventario::create([
            'tipo' => $tipo,
            'cantidad' => $cantidad,
            'observacion' => $this->observacionAleatoria($tipo),
            'fechaMovimiento' => now()->subDays(rand(1, 60))->format('Y-m-d H:i:s'),
            'idEmpleado' => $empleados->random()->idEmpleado,
            'idProducto' => $producto->idProducto,
        ]);

        // Actualizar stock
        if ($tipo === 'entrada') {
            $producto->stock += $cantidad;
        } else {
            $producto->stock -= $cantidad;
        }
        $producto->save();
    }

    private function observacionAleatoria($tipo): string
    {
        $entradas = [
            'Ajuste de stock',
            'Devolución de proveedor',
            'Ingreso por donación',
            'Corrección de inventario',
            'Stock encontrado'
        ];

        $salidas = [
            'Ajuste de stock',
            'Producto dañado',
            'Uso interno',
            'Merma normal',
            'Donación'
        ];

        if ($tipo === 'entrada') {
            return $entradas[array_rand($entradas)];
        } else {
            return $salidas[array_rand($salidas)];
        }
    }
}