<?php

namespace App\Http\Controllers\Gerente;

use App\Http\Controllers\Controller;
use App\Models\Venta;
use App\Models\Compra;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReporteController extends Controller
{
    public function ventas(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
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
                'success' => true,
                'data' => [
                    'reporte' => 'ventas',
                    'periodo' => "{$request->fecha_inicio} a {$request->fecha_fin}",
                    'estadisticas' => $estadisticas,
                    'ventas' => $ventas
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al generar reporte de ventas',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function compras(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $compras = Compra::with(['empresaProveedora', 'detalleCompras.producto'])
                ->porFecha($request->fecha_inicio, $request->fecha_fin)
                ->get();

            $estadisticas = [
                'total_compras' => $compras->count(),
                'monto_total' => $compras->sum('totalPago'),
                'promedio_compra' => $compras->avg('totalPago')
            ];

            return response()->json([
                'success' => true,
                'data' => [
                    'reporte' => 'compras',
                    'periodo' => "{$request->fecha_inicio} a {$request->fecha_fin}",
                    'estadisticas' => $estadisticas,
                    'compras' => $compras
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al generar reporte de compras',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function inventario()
    {
        try {
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
                'success' => true,
                'data' => [
                    'reporte' => 'inventario',
                    'estadisticas' => $estadisticas,
                    'productos' => $productos
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al generar reporte de inventario',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}