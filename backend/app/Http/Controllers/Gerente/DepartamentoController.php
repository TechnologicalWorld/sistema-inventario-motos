<?php

namespace App\Http\Controllers\Gerente;

use App\Http\Controllers\Controller;
use App\Models\Departamento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class DepartamentoController extends Controller
{
    public function index()
    {
        try {
            $departamentos = Departamento::withCount('empleados')->get();

            return response()->json([
                'success' => true,
                'data' => $departamentos
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener los departamentos',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255|unique:departamento,nombre',
            'descripcion' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $departamento = Departamento::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Departamento creado correctamente',
                'data' => $departamento
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al crear departamento',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $departamento = Departamento::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'nombre' => 'required|string|max:255|unique:departamento,nombre,' . $id . ',idDepartamento',
                'descripcion' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $departamento->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Departamento actualizado correctamente',
                'data' => $departamento
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Departamento no encontrado'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al actualizar departamento',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $departamento = Departamento::findOrFail($id);
            
            if ($departamento->empleados()->exists()) {
                return response()->json([
                    'success' => false,
                    'error' => 'No se puede eliminar el departamento porque tiene empleados asignados'
                ], 422);
            }

            $departamento->delete();

            return response()->json([
                'success' => true,
                'message' => 'Departamento eliminado correctamente'
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Departamento no encontrado'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al eliminar departamento',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function empleadosPorDepartamento($id)
    {
        try {
            $departamento = Departamento::with(['empleados.persona'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $departamento
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Departamento no encontrado'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener empleados del departamento',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}