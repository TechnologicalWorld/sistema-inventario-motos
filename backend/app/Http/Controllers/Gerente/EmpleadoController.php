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
            $empleado = Empleado::with(['persona', 'user'])->findOrFail($id);

            $validator = Validator::make($request->all(), [
                'ci' => 'required|string|unique:persona,ci,' . $empleado->persona->idPersona . ',idPersona',
                'paterno' => 'required|string|max:255',
                'materno' => 'required|string|max:255',
                'nombres' => 'required|string|max:255',
                'fecha_naci' => 'required|date',
                'genero' => 'required|in:M,F,O',
                'telefono' => 'required|string|max:20',
                'email' => 'required|email|unique:empleado,email,' . $id . ',idEmpleado',
                'direccion' => 'required|string',
                'fecha_contratacion' => 'required|date',
                'password' => 'nullable|string|min:6',
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
                'ci', 'paterno', 'materno', 'nombres', 'fecha_naci', 'genero', 'telefono'
            ]));

            $empleadoData = $request->only([
                'email', 'direccion', 'fecha_contratacion'
            ]);

            if ($request->password) {
                $empleadoData['password'] = Hash::make($request->password);
            }

            $empleado->update($empleadoData);

            // Verificar si existe el user antes de actualizar
            if ($empleado->user) {
                $userData = [
                    'email' => $request->email,
                    'direccion' => $request->direccion,
                    'fecha_contratacion' => $request->fecha_contratacion
                ];

                if ($request->password) {
                    $userData['password'] = Hash::make($request->password);
                }

                $empleado->user->update($userData);
            }

            if ($request->has('departamentos')) {
                Trabaja::where('idEmpleado', $empleado->idEmpleado)->delete();
                
                foreach ($request->departamentos as $departamentoId) {
                    Trabaja::create([
                        'idEmpleado' => $empleado->idEmpleado,
                        'idDepartamento' => $departamentoId,
                        'fecha' => now(),
                        'observacion' => 'Actualización de departamentos'
                    ]);
                }
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
                'departamentos.*' => 'exists:departamento,idDepartamento',
                'observacion' => 'nullable|string|max:255'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            // Eliminar asignaciones existentes
            //Trabaja::where('idEmpleado', $empleado->idEmpleado)->delete();
            
            // Crear nuevas asignaciones con fecha y observación
            foreach ($request->departamentos as $departamentoId) {
                Trabaja::create([
                    'idEmpleado' => $empleado->idEmpleado,
                    'idDepartamento' => $departamentoId,
                    'fecha' => now()->toDateString(),
                    'observacion' => $request->observacion ?? 'Asignación de departamentos'
                ]);
            }

            DB::commit();

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
            DB::rollBack();
            return response()->json([
                'success' => false,
                'error' => 'Error al asignar departamentos',
                'details' => $e->getMessage()
            ], 500);
        }
    }
    
    public function show($id)
    {
        try {
            $empleado = Empleado::with(['persona', 'departamentos'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $empleado
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Empleado no encontrado'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener el empleado',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function showHistorialEmpleado($id)
    {
        try {
            $historial = Trabaja::with('departamento')
                ->where('idEmpleado', $id)
                ->orderBy('fecha', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $historial
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener el historial del empleado',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}