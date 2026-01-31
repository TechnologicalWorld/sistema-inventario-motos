<?php

namespace App\Http\Controllers\Propietario;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use App\Models\Categoria;
use App\Models\MovimientoInventario;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Storage;

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
            'idCategoria' => 'required|exists:categoria,idCategoria',
            'imagen' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

    try {
        // Crear array de datos
        $data = $request->except(['imagen']);

        // Manejar imagen si existe
        if ($request->hasFile('imagen') && $request->file('imagen')->isValid()) {
            $imagen = $request->file('imagen');
            
            // Generar nombre único para evitar colisiones
            $extension = $imagen->getClientOriginalExtension();
            $nombreArchivo = 'producto_' . time() . '_' . uniqid() . '.' . $extension;
            
            // Guardar en storage/public/productos
            $path = $imagen->storeAs('productos', $nombreArchivo, 'public');
            
            // IMPORTANTE: Guardar la ruta en el campo 'imagenURL' (como en tu migración)
            $data['imagenURL'] = $path; // Esto guardará algo como: 'productos/producto_123456789_abc123.jpg'
        }
            $producto = Producto::create($data);

            $producto->imagen_completa = $producto->imagenURL ? asset('storage/' . $producto->imagenURL) : null;

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

    public function showProducto($id)
    {
        try {
            $producto = Producto::with('categoria')->findOrFail($id);

            return response()->json([
                'success' => true,
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
                'error' => 'Error al obtener el producto',
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
                'idCategoria' => 'required|exists:categoria,idCategoria',
                'imagen' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            if ($request->hasFile('imagen')) {
                if ($producto->imagen && Storage::disk('public')->exists($producto->imagen)) {
                    Storage::disk('public')->delete($producto->imagen);
                }
                $path = $request->file('imagen')->store('productos', 'public');
                $data['imagenURL'] = $path;
            } elseif ($request->has('eliminar_imagen') && $request->eliminar_imagen) {
                if ($producto->imagen && Storage::disk('public')->exists($producto->imagen)) {
                    Storage::disk('public')->delete($producto->imagen);
                }
                $data['imagenURL'] = null;
            }


            $producto->update($data);

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
    //CATEGORIAS
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
    public function showCategoria($id)
    {
        try {
            $producto = Producto::with('categoria')->findOrFail($id);

            return response()->json([
                'success' => true,
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
                'error' => 'Error al obtener el producto',
                'details' => $e->getMessage()
            ], 500);
        }
    }


    //MOVIMIENTOS
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
    public function showMovimiento($id)
    {
        try {
            $movimiento = MovimientoInventario::with('empleado.persona', 'producto')->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $movimiento
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Movimiento no encontrado',
            ], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener al Movimiento',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}
