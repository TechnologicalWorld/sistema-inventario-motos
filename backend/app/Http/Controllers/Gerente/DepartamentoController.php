<?php

namespace App\Http\Controllers\Gerente;

use App\Http\Controllers\Controller;
use App\Models\Departamento;
use Illuminate\Http\Request;

class DepartamentoController extends Controller
{
    public function index()
    {
        $departamentos = Departamento::withCount('empleados')->get();
        return response()->json($departamentos);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255|unique:departamento,nombre',
            'descripcion' => 'nullable|string'
        ]);

        $departamento = Departamento::create($request->all());

        return response()->json([
            'message' => 'Departamento creado correctamente',
            'departamento' => $departamento
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $departamento = Departamento::findOrFail($id);

        $request->validate([
            'nombre' => 'required|string|max:255|unique:departamento,nombre,' . $id . ',idDepartamento',
            'descripcion' => 'nullable|string'
        ]);

        $departamento->update($request->all());

        return response()->json([
            'message' => 'Departamento actualizado correctamente',
            'departamento' => $departamento
        ]);
    }

    public function destroy($id)
    {
        $departamento = Departamento::findOrFail($id);
        
        if ($departamento->empleados()->exists()) {
            return response()->json([
                'message' => 'No se puede eliminar el departamento porque tiene empleados asignados'
            ], 422);
        }

        $departamento->delete();

        return response()->json([
            'message' => 'Departamento eliminado correctamente'
        ]);
    }

    public function empleadosPorDepartamento($id)
    {
        $departamento = Departamento::with(['empleados.persona'])->findOrFail($id);
        return response()->json($departamento);
    }
}