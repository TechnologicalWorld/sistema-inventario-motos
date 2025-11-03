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
    public function index()
    {
        // Estadísticas generales
        $estadisticas = [
            'ventas_hoy' => Venta::whereDate('fecha', today())->count(),
            'ventas_mes' => Venta::whereMonth('fecha', now()->month)->count(),
            'compras_mes' => Compra::whereMonth('fecha', now()->month)->count(),
            'clientes_totales' => Cliente::count(),
            'productos_stock_bajo' => Producto::stockBajo()->count(),
        ];

        // Gráfica de ventas vs compras (últimos 7 días)
        $ventasCompras = DB::table('venta')
            ->select(DB::raw('DATE(fecha) as fecha, COUNT(*) as ventas, 0 as compras'))
            ->whereDate('fecha', '>=', now()->subDays(7))
            ->groupBy('fecha')
            ->unionAll(
                DB::table('compra')
                    ->select(DB::raw('DATE(fecha) as fecha, 0 as ventas, COUNT(*) as compras'))
                    ->whereDate('fecha', '>=', now()->subDays(7))
                    ->groupBy('fecha')
            )
            ->get()
            ->groupBy('fecha')
            ->map(function ($items) {
                return [
                    'ventas' => $items->sum('ventas'),
                    'compras' => $items->sum('compras')
                ];
            });

        // Productos con stock mínimo
        $stockMinimo = Producto::with('categoria')
            ->stockBajo()
            ->orderBy('stock')
            ->limit(10)
            ->get();

        // Top productos más vendidos
        $topProductos = DB::table('detalle_venta')
            ->join('producto', 'detalle_venta.idProducto', '=', 'producto.idProducto')
            ->select('producto.nombre', DB::raw('SUM(detalle_venta.cantidad) as total_vendido'))
            ->groupBy('producto.idProducto', 'producto.nombre')
            ->orderBy('total_vendido', 'desc')
            ->limit(10)
            ->get();

        // Clientes frecuentes
        $clientesFrecuentes = DB::table('venta')
            ->join('cliente', 'venta.idCliente', '=', 'cliente.idCliente')
            ->join('persona', 'cliente.idCliente', '=', 'persona.idPersona')
            ->select('persona.nombres', 'persona.paterno', 'persona.materno', 
                     DB::raw('COUNT(venta.idVenta) as total_compras'),
                     DB::raw('SUM(venta.montoTotal) as monto_total'))
            ->groupBy('cliente.idCliente', 'persona.nombres', 'persona.paterno', 'persona.materno')
            ->orderBy('total_compras', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'estadisticas' => $estadisticas,
            'ventas_compras' => $ventasCompras,
            'stock_minimo' => $stockMinimo,
            'top_productos' => $topProductos,
            'clientes_frecuentes' => $clientesFrecuentes
        ]);
    }
}