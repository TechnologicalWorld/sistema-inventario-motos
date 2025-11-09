<?php

namespace App\Http\Controllers\Propietario;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use Illuminate\Http\Request;

class ClienteController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Cliente::with('persona');

            if ($request->has('frecuentes')) {
                $query->whereHas('ventas', function($q) {
                    $q->havingRaw('COUNT(*) > 3');
                });
            }

            if ($request->has('search')) {
                $query->whereHas('persona', function($q) use ($request) {
                    $q->where('nombres', 'like', "%{$request->search}%")
                      ->orWhere('paterno', 'like', "%{$request->search}%")
                      ->orWhere('ci', 'like', "%{$request->search}%");
                });
            }

            $clientes = $query->orderBy('idCliente')->paginate(15);

            return response()->json([
                'success' => true,
                'data' => $clientes
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener los clientes',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function clientesFrecuentes()
    {
        try {
            $clientes = Cliente::with('persona')
                ->withCount('ventas')
                ->having('ventas_count', '>', 3)
                ->orderBy('ventas_count', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $clientes
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener clientes frecuentes',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}