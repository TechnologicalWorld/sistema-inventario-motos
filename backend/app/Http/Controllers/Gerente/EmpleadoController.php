<?php

namespace App\Http\Controllers\Gerente;

use App\Http\Controllers\Controller;
use App\Models\Empleado;
use App\Models\Persona;
use App\Models\Departamento;
use App\Models\Trabaja;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class EmpleadoController extends Controller
{
    public function index(Request $request)
    {
        $query = Empleado::with(['persona', 'departamentos']);

        if ($request->has('search')) {
            $query->whereHas('persona', function($q) use ($request) {
                $q->where('nombres', 'like', "%{$request->search}%")
                  ->orWhere('paterno', 'like', "%{$request->search}%")
                  ->orWhere('ci', 'like', "%{$request->search}%");
            });
        }

        $empleados = $query->orderBy('idEmpleado')->paginate(15);

        return response()->json($empleados);
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
            'email' => 'required|email|unique:empleado,email',
            'direccion' => 'required|string',
            'fecha_contratacion' => 'required|date',
            'password' => 'required|string|min:6',
            'departamentos' => 'nullable|array',
            'departamentos.*' => 'exists:departamento,idDepartamento'
        ]);

        DB::beginTransaction();

        try {
            // Crear persona
            $persona = Persona::create($request->only([
                'ci', 'paterno', 'materno', 'nombres', 'fecha_naci', 'genero', 'telefono'
            ]));

            // Crear empleado
            $empleado = Empleado::create([
                'idEmpleado' => $persona->idPersona,
                'fecha_contratacion' => $request->fecha_contratacion,
                'email' => $request->email,
                'direccion' => $request->direccion,
                'password' => Hash::make($request->password)
            ]);

            // Crear usuario
            \App\Models\User::create([
                'idUsuario' => $persona->idPersona,
                'email' => $request->email,
                'direccion' => $request->direccion,
                'fecha_contratacion' => $request->fecha_contratacion,
                'tipo' => 'empleado',
                'password' => Hash::make($request->password)
            ]);

            // Asignar departamentos
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
                'message' => 'Empleado creado correctamente',
                'empleado' => $empleado->load(['persona', 'departamentos'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Error al crear empleado: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $empleado = Empleado::with('persona')->findOrFail($id);

        $request->validate([
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

        DB::beginTransaction();

        try {
            // Actualizar persona
            $empleado->persona->update($request->only([
                'paterno', 'materno', 'nombres', 'fecha_naci', 'genero', 'telefono'
            ]));

            // Actualizar empleado
            $empleado->update($request->only([
                'email', 'direccion', 'fecha_contratacion'
            ]));

            // Actualizar usuario
            $empleado->user->update([
                'email' => $request->email,
                'direccion' => $request->direccion,
                'fecha_contratacion' => $request->fecha_contratacion
            ]);

            // Sincronizar departamentos
            if ($request->has('departamentos')) {
                $empleado->departamentos()->sync($request->departamentos);
            }

            DB::commit();

            return response()->json([
                'message' => 'Empleado actualizado correctamente',
                'empleado' => $empleado->load(['persona', 'departamentos'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Error al actualizar empleado: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        $empleado = Empleado::findOrFail($id);
        
        // Verificar si tiene ventas o movimientos asociados
        if ($empleado->ventas()->exists() || $empleado->movimientos()->exists()) {
            return response()->json([
                'message' => 'No se puede eliminar el empleado porque tiene ventas o movimientos asociados'
            ], 422);
        }

        DB::beginTransaction();

        try {
            // Eliminar usuario
            $empleado->user()->delete();
            
            // Eliminar asignaciones de departamentos
            $empleado->trabajos()->delete();
            
            // Eliminar empleado
            $empleado->delete();
            
            // La persona se elimina por cascade

            DB::commit();

            return response()->json([
                'message' => 'Empleado eliminado correctamente'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Error al eliminar empleado: ' . $e->getMessage()
            ], 500);
        }
    }

    public function asignarDepartamentos(Request $request, $id)
    {
        $empleado = Empleado::findOrFail($id);

        $request->validate([
            'departamentos' => 'required|array',
            'departamentos.*' => 'exists:departamento,idDepartamento'
        ]);

        $empleado->departamentos()->sync($request->departamentos);

        return response()->json([
            'message' => 'Departamentos asignados correctamente',
            'empleado' => $empleado->load('departamentos')
        ]);
    }
}