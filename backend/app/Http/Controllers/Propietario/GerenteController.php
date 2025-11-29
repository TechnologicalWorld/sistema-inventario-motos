<?php

namespace App\Http\Controllers\Propietario;

use App\Http\Controllers\Controller;
use App\Models\Gerente;
use App\Models\Persona;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class GerenteController extends Controller
{
    public function index()
    {
        try {
            $gerentes = Gerente::with('persona')->get();

            return response()->json([
                'success' => true,
                'data' => $gerentes
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener los gerentes',
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
            'email' => 'required|email|unique:gerente,email',
            'direccion' => 'required|string',
            'fecha_contratacion' => 'required|date',
            'password' => 'required|string|min:6'
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

            $gerente = Gerente::create([
                'idGerente' => $persona->idPersona,
                'fecha_contratacion' => $request->fecha_contratacion,
                'email' => $request->email,
                'direccion' => $request->direccion,
                'password' => Hash::make($request->password)
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Gerente creado correctamente',
                'data' => $gerente->load('persona')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'error' => 'Error al crear gerente',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $gerente = Gerente::with('persona')->findOrFail($id);

            $validator = Validator::make($request->all(), [
                'ci' => 'required|string|unique:persona,ci,' . $gerente->persona->idPersona . ',idPersona',
                'paterno' => 'required|string|max:255',
                'materno' => 'required|string|max:255',
                'nombres' => 'required|string|max:255',
                'fecha_naci' => 'required|date',
                'genero' => 'required|in:M,F,O',
                'telefono' => 'required|string|max:20',
                'email' => 'required|email|unique:gerente,email,' . $id . ',idGerente',
                'direccion' => 'required|string',
                'fecha_contratacion' => 'required|date',
                'password' => 'nullable|string|min:6'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            $gerente->persona->update($request->only([
                'ci', 'paterno', 'materno', 'nombres', 'fecha_naci', 'genero', 'telefono'
            ]));

            $gerenteData = [
                'email' => $request->email,
                'direccion' => $request->direccion,
                'fecha_contratacion' => $request->fecha_contratacion
            ];

            if ($request->password) {
                $gerenteData['password'] = Hash::make($request->password);
            }

            $gerente->update($gerenteData);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Gerente actualizado correctamente',
                'data' => $gerente->load('persona')
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Gerente no encontrado'
            ], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'error' => 'Error al actualizar gerente',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $gerente = Gerente::findOrFail($id);
            
            if ($gerente->compras()->exists()) {
                return response()->json([
                    'success' => false,
                    'error' => 'No se puede eliminar el gerente porque tiene compras asociadas'
                ], 422);
            }

            DB::beginTransaction();

            $gerente->persona->delete();
            $gerente->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Gerente eliminado correctamente'
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Gerente no encontrado'
            ], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'error' => 'Error al eliminar gerente',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $gerente = Gerente::with('persona')->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $gerente
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Gerente no encontrado'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener el gerente',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function desempenio($id)
    {
        try {
            $gerente = Gerente::with(['persona', 'compras' => function($query) {
                $query->with('detalleCompras')->latest()->take(10);
            }])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => [
                    'gerente' => $gerente,
                    'estadisticas' => [
                        'total_compras' => $gerente->compras()->count(),
                        'monto_total_compras' => $gerente->compras()->sum('totalPago')
                    ]
                ]
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Gerente no encontrado'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener el desempeño del gerente',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}