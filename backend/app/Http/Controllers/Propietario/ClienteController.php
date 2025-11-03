<?php

namespace App\Http\Controllers\Propietario;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use Illuminate\Http\Request;

class ClienteController extends Controller
{
    public function index(Request $request)
    {
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

        return response()->json($clientes);
    }

    public function clientesFrecuentes()
    {
        $clientes = Cliente::with('persona')
            ->withCount('ventas')
            ->having('ventas_count', '>', 3)
            ->orderBy('ventas_count', 'desc')
            ->get();

        return response()->json($clientes);
    }
}