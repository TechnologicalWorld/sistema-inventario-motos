<?php

namespace App\Http\Controllers\Gerente;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use App\Models\Categoria;
use App\Models\MovimientoInventario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InventarioController extends Controller
{
    // CRUD Productos
    public function indexProductos(Request $request)
    {
        $query = Producto::with('categoria');

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

    public function storeProducto(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'codigoProducto' => 'required|string|unique:producto,codigoProducto',
            'descripcion' => 'nullable|string',
            'precioVenta' => 'required|numeric|min:0',
            'precioCompra' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'stockMinimo' => 'required|integer|min:0',
            'estado' => 'required|in:activo,inactivo',
            'idCategoria' => 'required|exists:categoria,idCategoria'
        ]);

        $producto = Producto::create($request->all());

        return response()->json([
            'message' => 'Producto creado correctamente',
            'producto' => $producto
        ], 201);
    }

    public function updateProducto(Request $request, $id)
    {
        $producto = Producto::findOrFail($id);

        $request->validate([
            'nombre' => 'required|string|max:255',
            'codigoProducto' => 'required|string|unique:producto,codigoProducto,' . $id . ',idProducto',
            'descripcion' => 'nullable|string',
            'precioVenta' => 'required|numeric|min:0',
            'precioCompra' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'stockMinimo' => 'required|integer|min:0',
            'estado' => 'required|in:activo,inactivo',
            'idCategoria' => 'required|exists:categoria,idCategoria'
        ]);

        $producto->update($request->all());

        return response()->json([
            'message' => 'Producto actualizado correctamente',
            'producto' => $producto
        ]);
    }

    public function destroyProducto($id)
    {
        $producto = Producto::findOrFail($id);
        
        // Verificar si tiene ventas o compras asociadas
        if ($producto->detalleVentas()->exists() || $producto->detalleCompras()->exists()) {
            return response()->json([
                'message' => 'No se puede eliminar el producto porque tiene ventas o compras asociadas'
            ], 422);
        }

        $producto->delete();

        return response()->json([
            'message' => 'Producto eliminado correctamente'
        ]);
    }

    // CRUD Categorías
    public function indexCategorias()
    {
        $categorias = Categoria::withCount('productos')->get();
        return response()->json($categorias);
    }

    public function storeCategoria(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255|unique:categoria,nombre',
            'descripcion' => 'nullable|string'
        ]);

        $categoria = Categoria::create($request->all());

        return response()->json([
            'message' => 'Categoría creada correctamente',
            'categoria' => $categoria
        ], 201);
    }

    public function updateCategoria(Request $request, $id)
    {
        $categoria = Categoria::findOrFail($id);

        $request->validate([
            'nombre' => 'required|string|max:255|unique:categoria,nombre,' . $id . ',idCategoria',
            'descripcion' => 'nullable|string'
        ]);

        $categoria->update($request->all());

        return response()->json([
            'message' => 'Categoría actualizada correctamente',
            'categoria' => $categoria
        ]);
    }

    public function destroyCategoria($id)
    {
        $categoria = Categoria::findOrFail($id);
        
        if ($categoria->productos()->exists()) {
            return response()->json([
                'message' => 'No se puede eliminar la categoría porque tiene productos asociados'
            ], 422);
        }

        $categoria->delete();

        return response()->json([
            'message' => 'Categoría eliminada correctamente'
        ]);
    }

    // Movimientos de Inventario
    public function indexMovimientos(Request $request)
    {
        $query = MovimientoInventario::with(['empleado.persona', 'producto']);

        if ($request->has('tipo')) {
            $query->where('tipo', $request->tipo);
        }

        if ($request->has('fecha_inicio') && $request->has('fecha_fin')) {
            $query->porFecha($request->fecha_inicio, $request->fecha_fin);
        }

        $movimientos = $query->orderBy('fechaMovimiento', 'desc')->paginate(15);

        return response()->json($movimientos);
    }

    public function storeMovimiento(Request $request)
    {
        $request->validate([
            'tipo' => 'required|in:entrada,salida',
            'cantidad' => 'required|integer|min:1',
            'observacion' => 'required|string|max:500',
            'idProducto' => 'required|exists:producto,idProducto',
            'idEmpleado' => 'required|exists:empleado,idEmpleado'
        ]);

        DB::beginTransaction();

        try {
            $movimiento = MovimientoInventario::create([
                'tipo' => $request->tipo,
                'cantidad' => $request->cantidad,
                'observacion' => $request->observacion,
                'fechaMovimiento' => now(),
                'idProducto' => $request->idProducto,
                'idEmpleado' => $request->idEmpleado
            ]);

            // Actualizar stock del producto
            $producto = Producto::find($request->idProducto);
            if ($request->tipo === 'entrada') {
                $producto->stock += $request->cantidad;
            } else {
                if ($producto->stock < $request->cantidad) {
                    throw new \Exception('Stock insuficiente para realizar la salida');
                }
                $producto->stock -= $request->cantidad;
            }
            $producto->save();

            DB::commit();

            return response()->json([
                'message' => 'Movimiento registrado correctamente',
                'movimiento' => $movimiento->load(['empleado.persona', 'producto'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Error al registrar movimiento: ' . $e->getMessage()
            ], 500);
        }
    }
}