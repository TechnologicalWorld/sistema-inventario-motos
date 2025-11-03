<?php

namespace App\Http\Controllers\Gerente;

use App\Http\Controllers\Controller;
use App\Models\EmpresaProveedora;
use Illuminate\Http\Request;

class ProveedorController extends Controller
{
    public function index(Request $request)
    {
        $query = EmpresaProveedora::withCount('compras');

        if ($request->has('search')) {
            $query->where('nombre', 'like', "%{$request->search}%")
                  ->orWhere('contacto', 'like', "%{$request->search}%");
        }

        $proveedores = $query->orderBy('nombre')->paginate(15);

        return response()->json($proveedores);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'telefono' => 'required|string|max:20',
            'contacto' => 'required|string|max:255',
            'direccion' => 'required|string'
        ]);

        $proveedor = EmpresaProveedora::create($request->all());

        return response()->json([
            'message' => 'Proveedor creado correctamente',
            'proveedor' => $proveedor
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $proveedor = EmpresaProveedora::findOrFail($id);

        $request->validate([
            'nombre' => 'required|string|max:255',
            'telefono' => 'required|string|max:20',
            'contacto' => 'required|string|max:255',
            'direccion' => 'required|string'
        ]);

        $proveedor->update($request->all());

        return response()->json([
            'message' => 'Proveedor actualizado correctamente',
            'proveedor' => $proveedor
        ]);
    }

    public function destroy($id)
    {
        $proveedor = EmpresaProveedora::findOrFail($id);
        
        if ($proveedor->compras()->exists()) {
            return response()->json([
                'message' => 'No se puede eliminar el proveedor porque tiene compras asociadas'
            ], 422);
        }

        $proveedor->delete();

        return response()->json([
            'message' => 'Proveedor eliminado correctamente'
        ]);
    }

    public function comprasPorProveedor($id)
    {
        $proveedor = EmpresaProveedora::with(['compras.detalleCompras.producto'])
            ->findOrFail($id);

        return response()->json($proveedor);
    }
}