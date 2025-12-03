<?php

namespace App\Http\Controllers\Empleado;

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
        $ventas = DB::select('CALL sp_contar_ventas_empleado(?, ?, ?)', [$empleadoId, $anio, $mes]);
        $totalVendido = DB::select('CALL sp_total_vendido_empleado(?, ?, ?)', [$empleadoId, $anio, $mes]);
        $clientes = DB::select('CALL sp_contar_clientes_empleado(?, ?, ?)', [$empleadoId, $anio, $mes]);
        $productoMasVendido = DB::select('CALL sp_producto_mas_vendido_empleado(?, ?, ?)', [$empleadoId, $anio, $mes]);
        $ventasPorMes = DB::select('CALL sp_ventas_por_mes_empleado(?, ?)', [$empleadoId, $anio]);
        $ventasPorProducto = DB::select('CALL sp_ventas_por_producto_empleado(?, ?, ?)', [$empleadoId, $anio, $mes]);
        $ventas2024 = DB::select('CALL sp_ventas_totales_por_mes_2024(?)', [$anio]);
        $ventas2024ConCantidades = DB::select('CALL sp_ventas_totales_con_cantidades_2024(?)', [$anio]);

            return response()->json([
                'success' => true,
                'data' => [
                    'ventas' => $ventas[0]->total_ventas ?? 0,
                    'total_vendido' => $totalVendido[0]->monto_total ?? 0,
                    'clientes' => $clientes[0]->total_clientes ?? 0,
                    'producto_mas_vendido' => $productoMasVendido[0] ?? null,
                    'ventas_por_mes' => $ventasPorMes,
                    'ventas_por_producto' => $ventasPorProducto,
                    'ventas_2024' => $ventas2024,
                    'ventas_2024_con_cantidades' => $ventas2024ConCantidades,
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

    public function estadisticasAvanzadas(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'error' => 'Usuario no autenticado'
                ], 401);
            }

            $empleadoId = $user->idUsuario;

            // Ventas de los últimos 7 días
            $ventasUltimaSemana = Venta::where('idEmpleado', $empleadoId)
                ->whereDate('fecha', '>=', now()->subDays(7))
                ->select(
                    DB::raw('DATE(fecha) as fecha'),
                    DB::raw('COUNT(*) as total_ventas'),
                    DB::raw('SUM(montoTotal) as monto_total')
                )
                ->groupBy('fecha')
                ->orderBy('fecha')
                ->get();

            // Métodos de pago más utilizados
            $metodosPago = Venta::where('idEmpleado', $empleadoId)
                ->select(
                    'metodoPago',
                    DB::raw('COUNT(*) as total'),
                    DB::raw('SUM(montoTotal) as monto_total')
                )
                ->groupBy('metodoPago')
                ->get();

            // Productos más vendidos por este empleado
            $productosMasVendidos = DB::table('detalle_venta')
                ->join('venta', 'detalle_venta.idVenta', '=', 'venta.idVenta')
                ->join('producto', 'detalle_venta.idProducto', '=', 'producto.idProducto')
                ->where('venta.idEmpleado', $empleadoId)
                ->select(
                    'producto.nombre',
                    'producto.codigoProducto',
                    DB::raw('SUM(detalle_venta.cantidad) as total_vendido'),
                    DB::raw('SUM(detalle_venta.subTotal) as ingreso_total')
                )
                ->groupBy('producto.idProducto', 'producto.nombre', 'producto.codigoProducto')
                ->orderBy('total_vendido', 'desc')
                ->limit(5)
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'ventas_ultima_semana' => $ventasUltimaSemana,
                    'metodos_pago' => $metodosPago,
                    'productos_mas_vendidos' => $productosMasVendidos
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener estadísticas avanzadas',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}