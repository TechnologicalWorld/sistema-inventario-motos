<?php

namespace App\Http\Controllers\Gerente;

use App\Http\Controllers\Controller;
use App\Models\Venta;
use App\Models\Producto;
use App\Models\MovimientoInventario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            $anio = $request->input('anio', date('Y'));
            $mes = $request->input('mes', date('m'));
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'error' => 'Usuario no autenticado'
                ], 401);
            }

            $empleadoId = $user->idUsuario;
            $productosSinVenta = DB::select('CALL sp_productos_sin_venta_mes(?, ?)', [$anio, $mes]);
            $nroComprasGerente = DB::select('CALL sp_nro_compras_gerente_mes(?, ?, ?)', [$anio, $mes, $empleadoId]);
            $productosSinStock = DB::select('CALL sp_productos_sin_stock()');
            $nroProveedores = DB::select('CALL sp_nro_proveedores()');
            $nroVentasMes = DB::select('CALL sp_nro_ventas_mes(?, ?)', [$anio, $mes]);
            $totalVentasMes = DB::select('CALL sp_total_ventas_mes(?, ?)', [$anio, $mes]);
            $topProductosGerente = DB::select('CALL sp_top_productos_gerente_mes(?, ?, ?)', [$anio, $mes, $empleadoId]);
            $ventasPorDiaSemana = DB::select('CALL sp_ventas_por_dia_semana(?, ?)', [$anio, $mes]);
            $ventasPorHora = DB::select('CALL sp_ventas_por_hora(?, ?)', [$anio, $mes]);
            $ventasMensualesAnio = DB::select('CALL sp_ventas_mensuales_anio(?)', [$anio]);
            $topProductosVendidosMes = DB::select('CALL sp_top_productos_vendidos_mes(?, ?)', [$anio, $mes]);
            $topCategoriasVendidasMes = DB::select('CALL sp_top_categorias_vendidas_mes(?, ?)', [$anio, $mes]);
            $topProductosComprados = DB::select('CALL sp_top_productos_comprados()');
            $topCategoriasCompradas = DB::select('CALL sp_top_categorias_compradas()');
            $comprasMensualesAnio = DB::select('CALL sp_compras_mensuales_anio(?)', [$anio]);
            $productosStockMinimo = DB::select('CALL sp_productos_stock_minimo()');
            $productosSinStockDetalle = DB::select('CALL sp_productos_sin_stock_detalle()');


            return response()->json([
                'success' => true,
                'data' => [
                    'productos_sin_venta' => $productosSinVenta,
                    'nro_compras_gerente' => $nroComprasGerente,
                    'productos_sin_stock' => $productosSinStock,
                    'nro_proveedores' => $nroProveedores,
                    'nro_ventas_mes' => $nroVentasMes,
                    'total_ventas_mes' => $totalVentasMes,
                    'top_productos_gerente' => $topProductosGerente,
                    'ventas_por_dia_semana' => $ventasPorDiaSemana,
                    'ventas_por_hora' => $ventasPorHora,
                    'ventas_mensuales_anio' => $ventasMensualesAnio,
                    'top_productos_vendidos_mes' => $topProductosVendidosMes,
                    'top_categorias_vendidas_mes' => $topCategoriasVendidasMes,
                    'top_productos_comprados' => $topProductosComprados,
                    'top_categorias_compradas' => $topCategoriasCompradas,
                    'compras_mensuales_anio' => $comprasMensualesAnio,
                    'productos_stock_minimo' => $productosStockMinimo,
                    'productos_sin_stock_detalle' => $productosSinStockDetalle,
                    
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al cargar el dashboard',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}