<?php

namespace App\Http\Controllers\Empleado;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\Persona;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ClienteController extends Controller
{
    public function index(Request $request)
    {
        $query = Cliente::with('persona');

        if ($request->has('search')) {
            $query->whereHas('persona', function($q) use ($request) {
                $q->where('nombres', 'like', "%{$request->search}%")
                  ->orWhere('paterno', 'like', "%{$request->search}%")
                  ->orWhere('ci', 'like', "%{$request->search}%");
            });
        }

        $clientes = $query->orderBy('idCliente')->limit(50)->get();

        return response()->json($clientes);
    }

    public function store(Request $request)
    {
        $request->validate([
            'ci' => 'required|string|unique:persona,ci',
            'paterno' => 'required|string|max:255',
            'materno' => 'required|string|max:255',
            'nombres' => 'required|string|max:255',
            'fecha_naci' => 'required|date',
            'genero' => 'required|in:M,F,O',
            'telefono' => 'required|string|max:20',
            'nit' => 'nullable|string|max:20'
        ]);

        DB::beginTransaction();

        try {
            $persona = Persona::create($request->only([
                'ci', 'paterno', 'materno', 'nombres', 'fecha_naci', 'genero', 'telefono'
            ]));

            $cliente = Cliente::create([
                'idCliente' => $persona->idPersona,
                'nit' => $request->nit
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Cliente registrado correctamente',
                'cliente' => $cliente->load('persona')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Error al registrar cliente: ' . $e->getMessage()
            ], 500);
        }
    }

    public function buscar($ci)
    {
        $cliente = Cliente::with('persona')
            ->whereHas('persona', function($query) use ($ci) {
                $query->where('ci', 'like', "%{$ci}%");
            })
            ->first();

        return response()->json($cliente);
    }
}