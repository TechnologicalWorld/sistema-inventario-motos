<?php

namespace App\Http\Controllers;

use App\Models\Persona;
use App\Models\Gerente;
use App\Models\Empleado;
use App\Models\Propietario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class PerfilController extends Controller
{
    public function show()
    {
        $user = auth()->user();
        $persona = $user->persona;

        $perfil = [
            'persona' => $persona,
            'user' => $user,
            'role' => $user->role
        ];

        return response()->json($perfil);
    }

    public function updateDatosPersonales(Request $request)
    {
        $user = auth()->user();
        $persona = $user->persona;

        $request->validate([
            'paterno' => 'required|string|max:255',
            'materno' => 'required|string|max:255',
            'nombres' => 'required|string|max:255',
            'fecha_naci' => 'required|date',
            'genero' => 'required|in:M,F,O',
            'telefono' => 'required|string|max:20'
        ]);

        DB::beginTransaction();

        try {
            $persona->update($request->all());

            // Actualizar email en el modelo específico si es gerente o empleado
            if ($user->tipo === 'gerente') {
                $gerente = Gerente::find($user->idUsuario);
                $gerente->update(['email' => $request->email ?? $gerente->email]);
            } elseif ($user->tipo === 'empleado') {
                $empleado = Empleado::find($user->idUsuario);
                $empleado->update(['email' => $request->email ?? $empleado->email]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Datos personales actualizados correctamente',
                'persona' => $persona->fresh()
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Error al actualizar datos: ' . $e->getMessage()
            ], 500);
        }
    }

    public function cambiarPassword(Request $request)
    {
        $request->validate([
            'password_actual' => 'required|string',
            'nuevo_password' => 'required|string|min:6|confirmed'
        ]);

        $user = auth()->user();

        // Verificar password actual
        if (!Hash::check($request->password_actual, $user->password)) {
            return response()->json([
                'error' => 'La contraseña actual es incorrecta'
            ], 422);
        }

        DB::beginTransaction();

        try {
            // Actualizar password en User
            $user->update([
                'password' => Hash::make($request->nuevo_password)
            ]);

            // Actualizar password en el modelo específico
            if ($user->tipo === 'gerente') {
                $gerente = Gerente::find($user->idUsuario);
                $gerente->update(['password' => Hash::make($request->nuevo_password)]);
            } elseif ($user->tipo === 'empleado') {
                $empleado = Empleado::find($user->idUsuario);
                $empleado->update(['password' => Hash::make($request->nuevo_password)]);
            } elseif ($user->tipo === 'propietario') {
                $propietario = Propietario::find($user->idUsuario);
                $propietario->update(['password' => Hash::make($request->nuevo_password)]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Contraseña actualizada correctamente'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Error al cambiar contraseña: ' . $e->getMessage()
            ], 500);
        }
    }
}