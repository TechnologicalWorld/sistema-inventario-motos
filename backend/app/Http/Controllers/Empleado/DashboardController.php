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
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'error' => 'Usuario no autenticado'
                ], 401);
            }

            $empleadoId = $user->idUsuario;

            // Estadísticas del día
            $ventasHoy = Venta::where('idEmpleado', $empleadoId)
                ->whereDate('fecha', today())
                ->get();

            $movimientosHoy = MovimientoInventario::where('idEmpleado', $empleadoId)
                ->whereDate('fechaMovimiento', today())
                ->get();

            // Últimas ventas del empleado
            $ultimasVentas = Venta::with(['cliente.persona', 'detalleVentas.producto'])
                ->where('idEmpleado', $empleadoId)
                ->latest()
                ->limit(5)
                ->get();

            // Productos con stock bajo
            $stockBajo = Producto::with('categoria')
                ->stockBajo()
                ->activos()
                ->orderBy('stock')
                ->limit(5)
                ->get();

            // Últimos movimientos del empleado
            $ultimosMovimientos = MovimientoInventario::with('producto')
                ->where('idEmpleado', $empleadoId)
                ->latest()
                ->limit(5)
                ->get();

            // Ventas del mes actual
            $ventasMes = Venta::where('idEmpleado', $empleadoId)
                ->whereMonth('fecha', now()->month)
                ->whereYear('fecha', now()->year)
                ->get();

            $estadisticas = [
                'ventas_hoy' => $ventasHoy->count(),
                'monto_ventas_hoy' => $ventasHoy->sum('montoTotal'),
                'movimientos_hoy' => $movimientosHoy->count(),
                'productos_stock_bajo' => $stockBajo->count(),
                'ventas_mes' => $ventasMes->count(),
                'monto_ventas_mes' => $ventasMes->sum('montoTotal')
            ];

            return response()->json([
                'success' => true,
                'data' => [
                    'estadisticas' => $estadisticas,
                    'ultimas_ventas' => $ultimasVentas,
                    'stock_bajo' => $stockBajo,
                    'ultimos_movimientos' => $ultimosMovimientos
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