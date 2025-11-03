<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DetalleVenta;
use App\Models\Venta;
use App\Models\Producto;
use Illuminate\Support\Facades\DB;

class DetalleVentaSeeder extends Seeder
{
    public function run(): void
    {
        $ventas = Venta::all();
        $productos = Producto::where('stock', '>', 0)->get();

        if ($ventas->isEmpty() || $productos->isEmpty()) {
            echo "DetalleVentaSeeder: No hay ventas o productos con stock. Skipping...\n";
            return;
        }

        $detallesCreados = 0;

        foreach ($ventas as $venta) {
            // Verificar si la venta ya tiene detalles usando una consulta directa
            $detallesExistentes = DB::table('detalle_venta')
                ->where('idVenta', $venta->idVenta)
                ->count();

            if ($detallesExistentes == 0) {
                // Crear 1-3 detalles por venta
                $numDetalles = rand(1, 3);
                
                for ($i = 0; $i < $numDetalles; $i++) {
                    $producto = $productos->where('stock', '>', 0)->random();
                    $cantidad = rand(1, min(3, $producto->stock));
                    $precioUnitario = $producto->precioVenta;
                    $subTotal = $precioUnitario * $cantidad;

                    DetalleVenta::create([
                        'cantidad' => $cantidad,
                        'precioUnitario' => $precioUnitario,
                        'subTotal' => $subTotal,
                        'descripcion' => 'Venta de ' . $producto->nombre,
                        'idVenta' => $venta->idVenta,
                        'idProducto' => $producto->idProducto,
                    ]);

                    // Actualizar stock
                    $producto->stock -= $cantidad;
                    $producto->save();

                    $detallesCreados++;
                }

                // Recalcular el total de la venta
                $totalVenta = DB::table('detalle_venta')
                    ->where('idVenta', $venta->idVenta)
                    ->sum('subTotal');

                $venta->montoTotal = $totalVenta;
                $venta->save();
            }
        }
    }
}