<?php

namespace App\Http\Controllers\Propietario;

use App\Http\Controllers\Controller;
use App\Models\EmpresaProveedora;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ProveedorController extends Controller
{
    public function index()
    {
        try {
            $proveedores = EmpresaProveedora::with(['compras' => function($query) {
                $query->latest()->take(5);
            }])->get();

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

    public function historialCompras($id)
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
                'error' => 'Error al obtener historial de compras',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}