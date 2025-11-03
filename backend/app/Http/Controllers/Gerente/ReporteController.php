<?php

namespace App\Http\Controllers\Gerente;

use App\Http\Controllers\Controller;
use App\Models\Venta;
use App\Models\Compra;
use App\Models\Producto;
use Illuminate\Http\Request;

class ReporteController extends Controller
{
    public function ventas(Request $request)
    {
        $request->validate([
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio'
        ]);

        $ventas = Venta::with(['cliente.persona', 'empleado.persona', 'detalleVentas.producto'])
            ->porFecha($request->fecha_inicio, $request->fecha_fin)
            ->get();

        $estadisticas = [
            'total_ventas' => $ventas->count(),
            'monto_total' => $ventas->sum('montoTotal'),
            'promedio_venta' => $ventas->avg('montoTotal'),
            'venta_maxima' => $ventas->max('montoTotal'),
            'venta_minima' => $ventas->min('montoTotal')
        ];

        return response()->json([
            'reporte' => 'ventas',
            'periodo' => "{$request->fecha_inicio} a {$request->fecha_fin}",
            'estadisticas' => $estadisticas,
            'datos' => $ventas
        ]);
    }

    public function compras(Request $request)
    {
        $request->validate([
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio'
        ]);

        $compras = Compra::with(['empresaProveedora', 'detalleCompras.producto'])
            ->porFecha($request->fecha_inicio, $request->fecha_fin)
            ->get();

        $estadisticas = [
            'total_compras' => $compras->count(),
            'monto_total' => $compras->sum('totalPago'),
            'promedio_compra' => $compras->avg('totalPago')
        ];

        return response()->json([
            'reporte' => 'compras',
            'periodo' => "{$request->fecha_inicio} a {$request->fecha_fin}",
            'estadisticas' => $estadisticas,
            'datos' => $compras
        ]);
    }

    public function inventario()
    {
        $productos = Producto::with('categoria')->get();

        $estadisticas = [
            'total_productos' => $productos->count(),
            'productos_activos' => $productos->where('estado', 'activo')->count(),
            'stock_total' => $productos->sum('stock'),
            'valor_inventario' => $productos->sum(function($producto) {
                return $producto->stock * $producto->precioCompra;
            }),
            'productos_stock_bajo' => $productos->where('stock_bajo', true)->count()
        ];

        return response()->json([
            'reporte' => 'inventario',
            'estadisticas' => $estadisticas,
            'datos' => $productos
        ]);
    }
}