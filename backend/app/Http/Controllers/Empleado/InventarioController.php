<?php

namespace App\Http\Controllers\Empleado;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use Illuminate\Http\Request;


class InventarioController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Producto::with('categoria')->activos();

            if ($request->has('search')) {
                $query->where('nombre', 'like', "%{$request->search}%")
                      ->orWhere('codigoProducto', 'like', "%{$request->search}%");
            }

            if ($request->has('categoria')) {
                $query->where('idCategoria', $request->categoria);
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

    public function stockBajo()
    {
        try {
            $productos = Producto::with('categoria')
                ->stockBajo()
                ->activos()
                ->orderBy('stock')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $productos
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener productos con stock bajo',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function showProducto($id)
    {
        try {
            $producto = Producto::with('categoria')->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $producto
            ], 200);

        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'error' => 'Producto no encontrado',
                'details' => $e->getMessage()
            ], 404);
        }
    }   
}