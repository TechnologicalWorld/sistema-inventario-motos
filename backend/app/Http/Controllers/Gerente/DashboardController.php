<?php

namespace App\Http\Controllers\Gerente;

use App\Http\Controllers\Controller;
use App\Models\Venta;
use App\Models\Producto;
use App\Models\MovimientoInventario;
use Illuminate\Http\Request;

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

            // Últimas ventas del empleado
            $ultimasVentas = Venta::with(['cliente.persona', 'detalleVentas'])
                ->where('idEmpleado', $empleadoId)
                ->latest()
                ->limit(5)
                ->get();

            // Productos con stock bajo
            $stockBajo = Producto::with('categoria')
                ->stockBajo()
                ->orderBy('stock')
                ->limit(5)
                ->get();

            // Últimos movimientos del empleado
            $ultimosMovimientos = MovimientoInventario::with('producto')
                ->where('idEmpleado', $empleadoId)
                ->latest()
                ->limit(5)
                ->get();

            $estadisticas = [
                'ventas_hoy' => Venta::where('idEmpleado', $empleadoId)
                    ->whereDate('fecha', today())->count(),
                'movimientos_hoy' => MovimientoInventario::where('idEmpleado', $empleadoId)
                    ->whereDate('fechaMovimiento', today())->count(),
                'productos_stock_bajo' => $stockBajo->count()
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
}