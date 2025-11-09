<?php

namespace App\Http\Controllers\Propietario;

use App\Http\Controllers\Controller;
use App\Models\Venta;
use App\Models\Compra;
use App\Models\Producto;
use App\Models\Empleado;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReporteController extends Controller
{
    public function ventasPorFechas(Request $request)
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

            return response()->json([
                'success' => true,
                'data' => [
                    'reporte' => 'ventas',
                    'periodo' => "{$request->fecha_inicio} a {$request->fecha_fin}",
                    'total_ventas' => $ventas->count(),
                    'monto_total' => $ventas->sum('montoTotal'),
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

    public function comprasPorProveedor(Request $request)
    {
        try {
            $compras = Compra::with(['empresaProveedora', 'detalleCompras.producto'])
                ->when($request->proveedor, function($query) use ($request) {
                    return $query->porProveedor($request->proveedor);
                })
                ->get()
                ->groupBy('idEmpresaP');

            return response()->json([
                'success' => true,
                'data' => [
                    'reporte' => 'compras_por_proveedor',
                    'compras' => $compras
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al generar reporte de compras por proveedor',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function stockMinimo()
    {
        try {
            $productos = Producto::with('categoria')
                ->stockBajo()
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'reporte' => 'stock_minimo',
                    'total_productos' => $productos->count(),
                    'productos' => $productos
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al generar reporte de stock mínimo',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function empleadosPorDepartamento()
    {
        try {
            $empleados = Empleado::with(['persona', 'departamentos'])
                ->get()
                ->groupBy(function($empleado) {
                    return $empleado->departamentos->first()->nombre ?? 'Sin departamento';
                });

            return response()->json([
                'success' => true,
                'data' => [
                    'reporte' => 'empleados_por_departamento',
                    'empleados' => $empleados
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al generar reporte de empleados por departamento',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}