<?php

namespace App\Http\Controllers\Propietario;

use App\Http\Controllers\Controller;
use App\Models\Compra;
use Illuminate\Http\Request;

class CompraController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Compra::with(['empresaProveedora', 'gerente.persona']);

            if ($request->has('fecha_inicio') && $request->has('fecha_fin')) {
                $query->porFecha($request->fecha_inicio, $request->fecha_fin);
            }

            if ($request->has('proveedor')) {
                $query->porProveedor($request->proveedor);
            }

            $compras = $query->orderBy('fecha', 'desc')->paginate(15);

            return response()->json([
                'success' => true,
                'data' => $compras
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener las compras',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}