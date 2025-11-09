<?php

namespace App\Http\Controllers\Gerente;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use App\Models\Categoria;
use App\Models\MovimientoInventario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class InventarioController extends Controller
{
    // CRUD Productos
    public function indexProductos(Request $request)
    {
        try {
            $query = Producto::with('categoria');

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
                'error' => 'Error al obtener los productos',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function storeProducto(Request $request)
    {
        $validator = Validator::make($request->all(), [
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

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $producto = Producto::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Producto creado correctamente',
                'data' => $producto
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al crear el producto',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function updateProducto(Request $request, $id)
    {
        try {
            $producto = Producto::findOrFail($id);

            $validator = Validator::make($request->all(), [
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

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $producto->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Producto actualizado correctamente',
                'data' => $producto
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Producto no encontrado'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al actualizar el producto',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function destroyProducto($id)
    {
        try {
            $producto = Producto::findOrFail($id);
            
            if ($producto->detalleVentas()->exists() || $producto->detalleCompras()->exists()) {
                return response()->json([
                    'success' => false,
                    'error' => 'No se puede eliminar el producto porque tiene ventas o compras asociadas'
                ], 422);
            }

            $producto->delete();

            return response()->json([
                'success' => true,
                'message' => 'Producto eliminado correctamente'
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Producto no encontrado'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al eliminar el producto',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    // CRUD Categorías
    public function indexCategorias()
    {
        try {
            $categorias = Categoria::withCount('productos')->get();

            return response()->json([
                'success' => true,
                'data' => $categorias
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener las categorías',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function storeCategoria(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255|unique:categoria,nombre',
            'descripcion' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $categoria = Categoria::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Categoría creada correctamente',
                'data' => $categoria
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al crear la categoría',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function updateCategoria(Request $request, $id)
    {
        try {
            $categoria = Categoria::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'nombre' => 'required|string|max:255|unique:categoria,nombre,' . $id . ',idCategoria',
                'descripcion' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $categoria->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Categoría actualizada correctamente',
                'data' => $categoria
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Categoría no encontrada'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al actualizar la categoría',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function destroyCategoria($id)
    {
        try {
            $categoria = Categoria::findOrFail($id);
            
            if ($categoria->productos()->exists()) {
                return response()->json([
                    'success' => false,
                    'error' => 'No se puede eliminar la categoría porque tiene productos asociados'
                ], 422);
            }

            $categoria->delete();

            return response()->json([
                'success' => true,
                'message' => 'Categoría eliminada correctamente'
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Categoría no encontrada'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al eliminar la categoría',
                'details' => $e->getMessage()
            ], 500);
        }
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