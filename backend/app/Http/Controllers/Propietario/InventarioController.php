<?php

namespace App\Http\Controllers\Propietario;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use Illuminate\Http\Request;

class InventarioController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Producto::with('categoria');

            // Filtros
            if ($request->has('categoria')) {
                $query->where('idCategoria', $request->categoria);
            }

            if ($request->has('stock_bajo')) {
                $query->stockBajo();
            }

            if ($request->has('search')) {
                $query->where('nombre', 'like', "%{$request->search}%")
                      ->orWhere('codigoProducto', 'like', "%{$request->search}%");
            }

            $productos = $query->orderBy('nombre')->paginate(15);

            return response()->json([
                'success' => true,
                'data' => $productos
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener el inventario',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function reporteStockBajo()
    {
        try {
            $productos = Producto::with('categoria')
                ->stockBajo()
                ->orderBy('stock')
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Reporte generado correctamente',
                'data' => $productos
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al generar el reporte',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}