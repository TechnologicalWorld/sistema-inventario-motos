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
    public function index()
    {
        // Resumen de ventas del día
        $ventasHoy = Venta::whereDate('fecha', today())->get();
        
        // Stock crítico
        $stockCritico = Producto::with('categoria')
            ->stockBajo()
            ->orderBy('stock')
            ->limit(10)
            ->get();

        // Movimientos recientes
        $movimientosRecientes = MovimientoInventario::with(['empleado.persona', 'producto'])
            ->latest()
            ->limit(10)
            ->get();

        $estadisticas = [
            'ventas_hoy' => $ventasHoy->count(),
            'monto_ventas_hoy' => $ventasHoy->sum('montoTotal'),
            'stock_critico' => $stockCritico->count(),
            'movimientos_hoy' => MovimientoInventario::whereDate('fechaMovimiento', today())->count()
        ];

        return response()->json([
            'estadisticas' => $estadisticas,
            'stock_critico' => $stockCritico,
            'movimientos_recientes' => $movimientosRecientes,
            'ventas_hoy' => $ventasHoy
        ]);
    }
}