<?php

namespace App\Http\Controllers;

use App\Models\Persona;
use App\Models\Gerente;
use App\Models\Empleado;
use App\Models\Propietario;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class PerfilController extends Controller
{
    public function show(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'error' => 'Usuario no autenticado'
                ], 401);
            }

            $persona = $user->persona;

            $perfil = [
                'persona' => $persona,
                'user' => $user,
                'role' => $user->role
            ];

            return response()->json([
                'success' => true,
                'data' => $perfil
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener el perfil',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function updateDatosPersonales(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'paterno' => 'required|string|max:255',
            'materno' => 'required|string|max:255',
            'nombres' => 'required|string|max:255',
            'fecha_naci' => 'required|date',
            'genero' => 'required|in:M,F,O',
            'telefono' => 'required|string|max:20'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();

        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'error' => 'Usuario no autenticado'
                ], 401);
            }

            $persona = $user->persona;
            $persona->update($request->all());

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Datos personales actualizados correctamente',
                'data' => $persona->fresh()
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'error' => 'Error al actualizar datos personales',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function cambiarPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'password_actual' => 'required|string',
            'nuevo_password' => 'required|string|min:6|confirmed'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'error' => 'Usuario no autenticado'
            ], 401);
        }

        if (!Hash::check($request->password_actual, $user->password)) {
            return response()->json([
                'success' => false,
                'error' => 'La contraseña actual es incorrecta'
            ], 422);
        }

        DB::beginTransaction();

        try {
            $user->update([
                'password' => Hash::make($request->nuevo_password)
            ]);

            // Actualizar también en el modelo específico si es necesario
            if ($user->tipo === 'gerente') {
                $gerente = Gerente::find($user->idUsuario);
                if ($gerente) {
                    $gerente->update(['password' => Hash::make($request->nuevo_password)]);
                }
            } elseif ($user->tipo === 'empleado') {
                $empleado = Empleado::find($user->idUsuario);
                if ($empleado) {
                    $empleado->update(['password' => Hash::make($request->nuevo_password)]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Contraseña actualizada correctamente'
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'error' => 'Error al cambiar contraseña',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}