<?php

namespace App\Http\Controllers\Empleado;

use App\Http\Controllers\Controller;
use App\Models\Venta;
use App\Models\Producto;
use App\Models\MovimientoInventario;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $empleadoId = auth()->id();

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
            'estadisticas' => $estadisticas,
            'ultimas_ventas' => $ultimasVentas,
            'stock_bajo' => $stockBajo,
            'ultimos_movimientos' => $ultimosMovimientos
        ]);
    }
}