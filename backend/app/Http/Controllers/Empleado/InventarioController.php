<?php

namespace App\Http\Controllers\Empleado;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use Illuminate\Http\Request;

class InventarioController extends Controller
{
    public function index(Request $request)
    {
        $query = Producto::with('categoria')->activos();

        if ($request->has('search')) {
            $query->where('nombre', 'like', "%{$request->search}%")
                  ->orWhere('codigoProducto', 'like', "%{$request->search}%");
        }

        if ($request->has('categoria')) {
            $query->where('idCategoria', $request->categoria);
        }

        $productos = $query->orderBy('nombre')->paginate(15);

        return response()->json($productos);
    }

    public function stockBajo()
    {
        $productos = Producto::with('categoria')
            ->stockBajo()
            ->activos()
            ->orderBy('stock')
            ->get();

        return response()->json($productos);
    }
}