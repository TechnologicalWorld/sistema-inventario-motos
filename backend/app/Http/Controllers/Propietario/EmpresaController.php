<?php

namespace App\Http\Controllers\Propietario;

use App\Http\Controllers\Controller;
use App\Models\Empresa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EmpresaController extends Controller
{
    public function show()
    {
        try {
            $empresa = Empresa::first();
            
            return response()->json([
                'success' => true,
                'data' => $empresa
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener información de la empresa',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'telefono' => 'required|string|max:20',
            'mision' => 'required|string',
            'vision' => 'required|string',
            'logo' => 'nullable|string|max:50'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $empresa = Empresa::firstOrNew(['codigo' => '001']);
            $empresa->fill($request->all());
            $empresa->save();

            return response()->json([
                'success' => true,
                'message' => 'Información de la empresa actualizada correctamente',
                'data' => $empresa
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al actualizar información de la empresa',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}