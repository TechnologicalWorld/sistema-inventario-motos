<?php

namespace App\Http\Controllers\Gerente;

use App\Http\Controllers\Controller;
use App\Models\EmpresaProveedora;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ProveedorController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = EmpresaProveedora::withCount('compras');

            if ($request->has('search')) {
                $query->where('nombre', 'like', "%{$request->search}%")
                      ->orWhere('contacto', 'like', "%{$request->search}%");
            }

            $proveedores = $query->orderBy('nombre')->paginate(15);

            return response()->json([
                'success' => true,
                'data' => $proveedores
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener los proveedores',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'telefono' => 'required|string|max:20',
            'contacto' => 'required|string|max:255',
            'direccion' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $proveedor = EmpresaProveedora::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Proveedor creado correctamente',
                'data' => $proveedor
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al crear proveedor',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $proveedor = EmpresaProveedora::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'nombre' => 'required|string|max:255',
                'telefono' => 'required|string|max:20',
                'contacto' => 'required|string|max:255',
                'direccion' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $proveedor->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Proveedor actualizado correctamente',
                'data' => $proveedor
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Proveedor no encontrado'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al actualizar proveedor',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $proveedor = EmpresaProveedora::findOrFail($id);
            
            if ($proveedor->compras()->exists()) {
                return response()->json([
                    'success' => false,
                    'error' => 'No se puede eliminar el proveedor porque tiene compras asociadas'
                ], 422);
            }

            $proveedor->delete();

            return response()->json([
                'success' => true,
                'message' => 'Proveedor eliminado correctamente'
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Proveedor no encontrado'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al eliminar proveedor',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function comprasPorProveedor($id)
    {
        try {
            $proveedor = EmpresaProveedora::with(['compras.detalleCompras.producto'])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $proveedor
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Proveedor no encontrado'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener compras del proveedor',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}