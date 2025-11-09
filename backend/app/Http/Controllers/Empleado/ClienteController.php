<?php

namespace App\Http\Controllers\Empleado;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\Persona;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ClienteController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Cliente::with('persona');

            if ($request->has('search')) {
                $query->whereHas('persona', function($q) use ($request) {
                    $q->where('nombres', 'like', "%{$request->search}%")
                      ->orWhere('paterno', 'like', "%{$request->search}%")
                      ->orWhere('ci', 'like', "%{$request->search}%");
                });
            }

            $clientes = $query->orderBy('idCliente')->limit(50)->get();

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

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ci' => 'required|string|unique:persona,ci',
            'paterno' => 'required|string|max:255',
            'materno' => 'required|string|max:255',
            'nombres' => 'required|string|max:255',
            'fecha_naci' => 'required|date',
            'genero' => 'required|in:M,F,O',
            'telefono' => 'required|string|max:20',
            'nit' => 'nullable|string|max:20'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

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
                'success' => true,
                'message' => 'Cliente registrado correctamente',
                'data' => $cliente->load('persona')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'error' => 'Error al registrar cliente',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function buscar($ci)
    {
        try {
            $cliente = Cliente::with('persona')
                ->whereHas('persona', function($query) use ($ci) {
                    $query->where('ci', 'like', "%{$ci}%");
                })
                ->first();

            return response()->json([
                'success' => true,
                'data' => $cliente
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al buscar cliente',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}