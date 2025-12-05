<?php

namespace App\Http\Controllers\Propietario;

use App\Http\Controllers\Controller;
use App\Models\Venta;
use App\Models\Compra;
use App\Models\Producto;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        try {
            $anio=$request->input('anio', date('Y'));
            $mes=$request->input('mes', date('m'));
            
            $ventasPorCategoria = DB::select('CALL sp_ventas_por_categoria(?, ?)', [$anio, $mes]);
            $productosSinVenta = DB::select('CALL sp_productos_sin_venta_mes(?, ?)', [$anio, $mes]);
            $movimientosInventario = DB::select('CALL sp_movimientos_inventario_mes(?, ?)', [$anio, $mes]);
            $comprasPorProducto = DB::select('CALL sp_compras_por_producto(?, ?)', [$anio, $mes]);
            $gastoTotalMes = DB::select('CALL sp_gasto_total_mes(?, ?)', [$anio, $mes]);
            $totalVentasMes = DB::select('CALL sp_total_ventas_mes(?, ?)', [$anio, $mes]);
            $nroVentasMes = DB::select('CALL sp_nro_ventas_mes(?, ?)', [$anio, $mes]);
            $nroEmpresasProvedoras = DB::select('CALL sp_nro_empresas_proveedoras()');
            $cantidadProductosActivos = DB::select('CALL sp_cantidad_productos_activos()');
            $cantidadProductosInactivos = DB::select('CALL sp_cantidad_productos_inactivos()');


            return response()->json([
                'success' => true,
                'data' => [
                    'ventas_por_categoria' => $ventasPorCategoria,
                    'productos_sin_venta' => $productosSinVenta,
                    'movimientos_inventario' => $movimientosInventario,
                    'compras_por_producto' => $comprasPorProducto,
                    'gasto_total_mes' => $gastoTotalMes,
                    'total_ventas_mes' => $totalVentasMes,
                    'nro_ventas_mes' => $nroVentasMes,
                    'nro_empresas_provedoras' => $nroEmpresasProvedoras,
                    'cantidad_productos_activos' => $cantidadProductosActivos,
                    'cantidad_productos_inactivos' => $cantidadProductosInactivos,
                    
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