<?php

namespace App\Http\Controllers\Propietario;

use App\Http\Controllers\Controller;
use App\Models\EmpresaProveedora;
use Illuminate\Http\Request;

class ProveedorController extends Controller
{
    public function index()
    {
        $proveedores = EmpresaProveedora::with(['compras' => function($query) {
            $query->latest()->take(5);
        }])->get();

        return response()->json($proveedores);
    }

    public function historialCompras($id)
    {
        $proveedor = EmpresaProveedora::with(['compras.detalleCompras.producto'])
            ->findOrFail($id);

        return response()->json($proveedor);
    }
}