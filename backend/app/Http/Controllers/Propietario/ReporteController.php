<?php

namespace App\Http\Controllers\Propietario;

use App\Http\Controllers\Controller;
use App\Models\Venta;
use App\Models\Compra;
use App\Models\Producto;
use App\Models\Empleado;
use Illuminate\Http\Request;

class ReporteController extends Controller
{
    public function ventasPorFechas(Request $request)
    {
        $request->validate([
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio'
        ]);

        $ventas = Venta::with(['cliente.persona', 'empleado.persona', 'detalleVentas.producto'])
            ->porFecha($request->fecha_inicio, $request->fecha_fin)
            ->get();

        return response()->json([
            'reporte' => 'ventas',
            'periodo' => "{$request->fecha_inicio} a {$request->fecha_fin}",
            'total_ventas' => $ventas->count(),
            'monto_total' => $ventas->sum('montoTotal'),
            'datos' => $ventas
        ]);
    }

    public function comprasPorProveedor(Request $request)
    {
        $compras = Compra::with(['empresaProveedora', 'detalleCompras.producto'])
            ->when($request->proveedor, function($query) use ($request) {
                return $query->porProveedor($request->proveedor);
            })
            ->get()
            ->groupBy('idEmpresaP');

        return response()->json([
            'reporte' => 'compras_por_proveedor',
            'datos' => $compras
        ]);
    }

    public function stockMinimo()
    {
        $productos = Producto::with('categoria')
            ->stockBajo()
            ->get();

        return response()->json([
            'reporte' => 'stock_minimo',
            'total_productos' => $productos->count(),
            'datos' => $productos
        ]);
    }

    public function empleadosPorDepartamento()
    {
        $empleados = Empleado::with(['persona', 'departamentos'])
            ->get()
            ->groupBy(function($empleado) {
                return $empleado->departamentos->first()->nombre ?? 'Sin departamento';
            });

        return response()->json([
            'reporte' => 'empleados_por_departamento',
            'datos' => $empleados
        ]);
    }
}