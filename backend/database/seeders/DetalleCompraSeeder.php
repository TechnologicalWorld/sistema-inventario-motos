<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DetalleCompra;
use App\Models\Compra;
use App\Models\Producto;
use Illuminate\Support\Facades\DB;

class DetalleCompraSeeder extends Seeder
{
    public function run(): void
    {
        $compras = Compra::all();
        $productos = Producto::all();

        if ($compras->isEmpty() || $productos->isEmpty()) {
            echo "DetalleCompraSeeder: No hay compras o productos. Skipping...\n";
            return;
        }

        $detallesCreados = 0;

        foreach ($compras as $compra) {
            // Verificar si la compra ya tiene detalles usando una consulta directa
            $detallesExistentes = DB::table('detalle_compra')
                ->where('idCompra', $compra->idCompra)
                ->count();

            if ($detallesExistentes == 0) {
                $numDetalles = rand(1, 4);
                
                for ($i = 0; $i < $numDetalles; $i++) {
                    $producto = $productos->random();
                    $cantidad = rand(5, 50);
                    $precioUnitario = $producto->precioCompra * (1 - rand(0, 10) / 100); 
                    $subTotal = $precioUnitario * $cantidad;

                    DetalleCompra::create([
                        'precioUnitario' => $precioUnitario,
                        'subTotal' => $subTotal,
                        'cantidad' => $cantidad,
                        'idCompra' => $compra->idCompra,
                        'idProducto' => $producto->idProducto,
                    ]);

                    $detallesCreados++;

                    // Actualizar stock del producto
                    $producto->stock += $cantidad;
                    $producto->save();
                }

                // Recalcular el total de la compra
                $totalCompra = DB::table('detalle_compra')
                    ->where('idCompra', $compra->idCompra)
                    ->sum('subTotal');

                $compra->totalPago = $totalCompra;
                $compra->save();
            }
        }
    }
}