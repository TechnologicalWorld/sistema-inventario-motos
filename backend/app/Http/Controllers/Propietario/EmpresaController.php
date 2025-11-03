<?php

namespace App\Http\Controllers\Propietario;

use App\Http\Controllers\Controller;
use App\Models\Empresa;
use Illuminate\Http\Request;

class EmpresaController extends Controller
{
    public function show()
    {
        $empresa = Empresa::first();
        return response()->json($empresa);
    }

    public function update(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'telefono' => 'required|string|max:20',
            'mision' => 'required|string',
            'vision' => 'required|string',
            'logo' => 'nullable|string|max:50'
        ]);

        $empresa = Empresa::firstOrNew(['codigo' => '001']);
        $empresa->fill($request->all());
        $empresa->save();

        return response()->json([
            'message' => 'Información de la empresa actualizada correctamente',
            'empresa' => $empresa
        ]);
    }
}