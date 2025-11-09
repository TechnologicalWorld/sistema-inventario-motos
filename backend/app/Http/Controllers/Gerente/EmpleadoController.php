<?php

namespace App\Http\Controllers\Gerente;

use App\Http\Controllers\Controller;
use App\Models\Empleado;
use App\Models\Persona;
use App\Models\Departamento;
use App\Models\Trabaja;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class EmpleadoController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Empleado::with(['persona', 'departamentos']);

            if ($request->has('search')) {
                $query->whereHas('persona', function($q) use ($request) {
                    $q->where('nombres', 'like', "%{$request->search}%")
                      ->orWhere('paterno', 'like', "%{$request->search}%")
                      ->orWhere('ci', 'like', "%{$request->search}%");
                });
            }

            $empleados = $query->orderBy('idEmpleado')->paginate(15);

            return response()->json([
                'success' => true,
                'data' => $empleados
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener los empleados',
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
            'email' => 'required|email|unique:empleado,email',
            'direccion' => 'required|string',
            'fecha_contratacion' => 'required|date',
            'password' => 'required|string|min:6',
            'departamentos' => 'nullable|array',
            'departamentos.*' => 'exists:departamento,idDepartamento'
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

            $empleado = Empleado::create([
                'idEmpleado' => $persona->idPersona,
                'fecha_contratacion' => $request->fecha_contratacion,
                'email' => $request->email,
                'direccion' => $request->direccion,
                'password' => Hash::make($request->password)
            ]);

            User::create([
                'idUsuario' => $persona->idPersona,
                'email' => $request->email,
                'direccion' => $request->direccion,
                'fecha_contratacion' => $request->fecha_contratacion,
                'tipo' => 'empleado',
                'password' => Hash::make($request->password)
            ]);

            if ($request->has('departamentos')) {
                foreach ($request->departamentos as $departamentoId) {
                    Trabaja::create([
                        'idEmpleado' => $empleado->idEmpleado,
                        'idDepartamento' => $departamentoId,
                        'fecha' => now(),
                        'observacion' => 'Asignación inicial'
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Empleado creado correctamente',
                'data' => $empleado->load(['persona', 'departamentos'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'error' => 'Error al crear empleado',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $empleado = Empleado::with('persona')->findOrFail($id);

            $validator = Validator::make($request->all(), [
                'paterno' => 'required|string|max:255',
                'materno' => 'required|string|max:255',
                'nombres' => 'required|string|max:255',
                'fecha_naci' => 'required|date',
                'genero' => 'required|in:M,F,O',
                'telefono' => 'required|string|max:20',
                'email' => 'required|email|unique:empleado,email,' . $id . ',idEmpleado',
                'direccion' => 'required|string',
                'fecha_contratacion' => 'required|date',
                'departamentos' => 'nullable|array',
                'departamentos.*' => 'exists:departamento,idDepartamento'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            $empleado->persona->update($request->only([
                'paterno', 'materno', 'nombres', 'fecha_naci', 'genero', 'telefono'
            ]));

            $empleado->update($request->only([
                'email', 'direccion', 'fecha_contratacion'
            ]));

            $empleado->user->update([
                'email' => $request->email,
                'direccion' => $request->direccion,
                'fecha_contratacion' => $request->fecha_contratacion
            ]);

            if ($request->has('departamentos')) {
                $empleado->departamentos()->sync($request->departamentos);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Empleado actualizado correctamente',
                'data' => $empleado->load(['persona', 'departamentos'])
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Empleado no encontrado'
            ], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'error' => 'Error al actualizar empleado',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $empleado = Empleado::findOrFail($id);
            
            if ($empleado->ventas()->exists() || $empleado->movimientos()->exists()) {
                return response()->json([
                    'success' => false,
                    'error' => 'No se puede eliminar el empleado porque tiene ventas o movimientos asociados'
                ], 422);
            }

            DB::beginTransaction();

            $empleado->user()->delete();
            $empleado->trabajos()->delete();
            $empleado->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Empleado eliminado correctamente'
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Empleado no encontrado'
            ], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'error' => 'Error al eliminar empleado',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function asignarDepartamentos(Request $request, $id)
    {
        try {
            $empleado = Empleado::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'departamentos' => 'required|array',
                'departamentos.*' => 'exists:departamento,idDepartamento'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $empleado->departamentos()->sync($request->departamentos);

            return response()->json([
                'success' => true,
                'message' => 'Departamentos asignados correctamente',
                'data' => $empleado->load('departamentos')
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Empleado no encontrado'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al asignar departamentos',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}