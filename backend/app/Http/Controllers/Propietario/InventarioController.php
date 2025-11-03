<?php

namespace App\Http\Controllers\Propietario;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use Illuminate\Http\Request;

class InventarioController extends Controller
{
    public function index(Request $request)
    {
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

        return response()->json($productos);
    }

    public function reporteStockBajo()
    {
        $productos = Producto::with('categoria')
            ->stockBajo()
            ->orderBy('stock')
            ->get();

        // Aquí va las cosas para  la logica para generar PDF/Excel
        return response()->json([
            'message' => 'Reporte generado',
            'productos' => $productos
        ]);
    }
}