<?php

namespace App\Http\Controllers\Propietario;

use App\Http\Controllers\Controller;
use App\Models\Compra;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;

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

    public function show($id)
    {
        try {
            $compra = Compra::with([
                'empresaProveedora', 
                'gerente.persona', 
                'detalleCompras.producto'
            ])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $compra
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Compra no encontrada'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener la compra',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}