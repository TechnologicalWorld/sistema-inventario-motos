<?php

namespace App\Http\Controllers;

use App\Models\Empleado;
use App\Models\Gerente;
use App\Models\Persona;
use App\Models\Propietario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{

    public function register(Request $request)
    {
        $validatorPersona = Validator::make($request->all(), [
            'role' => 'required|in:gerente,empleado,propietario',
            'ci' => 'required|string|unique:persona,ci',
            'paterno' => 'required|string|max:255',
            'materno' => 'required|string|max:255',
            'nombres' => 'required|string|max:255',
            'fecha_naci' => 'required|date',
            'genero' => 'required|in:M,F',
            'telefono' => 'required|string|max:20',
        ]);

        if ($validatorPersona->fails()) {
            return response()->json(['errors' => $validatorPersona->errors()], 422);
        }
        // Validaciones específicas por rol
        if (in_array($request->role, ['gerente', 'empleado', 'propietario'])) {
            $validatorTrabajador = Validator::make($request->all(), [
                'email' => 'required|email|unique:gerente,email|unique:empleado,email|unique:propietario,email',
                'password' => 'required|string',
                'direccion' => 'required|string|max:255',
                'fecha_contratacion' => 'required|date',
            ]);
            if ($validatorTrabajador->fails()) {
                return response()->json(['errors' => $validatorTrabajador->errors()], 422);
            }
        }

        DB::beginTransaction();

        try {
            // 1. Crear la Persona
            $persona = Persona::create([
                'ci' => $request->ci,
                'paterno' => $request->paterno,
                'materno' => $request->materno,
                'nombres' => $request->nombres,
                'fecha_naci' => $request->fecha_naci,
                'genero' => $request->genero,
                'telefono' => $request->telefono,
            ]);

            $persona->save();


            // 2. Crear el registro específico según el rol
            switch ($request->role) {
                case 'gerente':
                    try {
                        $user = Gerente::create([
                            'idGerente' => $persona->idPersona,
                            'fecha_contratacion' => $request->fecha_contratacion,
                            'email' => $request->email,
                            'direccion' => $request->direccion,
                            'password' => $request->password,
                        ]);
                    } catch (\Throwable $th) {
                        echo $th;
                    }

                    break;

                case 'empleado':
                    try {
                        $user = Empleado::create([
                            'idEmpleado' => $persona->idPersona,
                            'fecha_contratacion' => $request->fecha_contratacion,
                            'email' => $request->email,
                            'direccion' => $request->direccion,
                            'password' => $request->password,
                        ]);
                    } catch (\Throwable $th) {
                        echo $th;
                    }

                    break;

                case 'propietario':
                    try {
                        Propietario::create([
                            'idPropietario' => $persona->idPersona,
                            'email' => $request->email,
                            'password' => $request->password
                        ]);
                    } catch (\Throwable $th) {
                        echo $th;
                    }

                    break;

                default:
                    throw new \Exception('Rol no válido');
            }

            DB::commit();
            // Si es un usuario autenticable, generar token
            if (in_array($request->role, ['gerente', 'empleado', 'propietario'])) {
                try {
                    $token = $user->createToken($user->email)->plainTextToken;
                } catch (\Throwable $th) {
                    echo $th;
                }
                return response()->json([
                    'message' => 'Usuario registrado exitosamente',
                    'token' => $token,
                    'usuario' => $this->getUserData($user, $request->role),
                    'role' => $request->role
                ], 201);
            }

            return response()->json([
                'message' => 'Error',

            ], 400);
        } catch (\Exception $e) {
            DB::rollBack();
            throw ValidationException::withMessages([
                'error' => ['Error en el registro: ' . $e->getMessage()],
            ]);
        }
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Intentar autenticar como Gerente
        $gerente = Gerente::where('email', $request->email)->first();
        if ($gerente && Hash::check($request->password, $gerente->password)) {
            $token = $gerente->createToken('gerente-token')->plainTextToken;
            return response()->json([
                'message' => 'Usuario logueado exitosamente',
                'token' => $token,
                'user' => $this->getUserData($gerente, 'gerente'),
                'role' => 'gerente'
            ]);
        }

        // Intentar autenticar como Empleado
        $empleado = Empleado::where('email', $request->email)->first();
        if ($empleado && Hash::check($request->password, $empleado->password)) {
            $token = $empleado->createToken('empleado-token')->plainTextToken;
            return response()->json([
                'message' => 'Usuario logueado exitosamente',
                'token' => $token,
                'user' => $this->getUserData($empleado, 'empleado'),
                'role' => 'empleado'
            ]);
        }

        $propietario = Propietario::where('email', $request->email)->first();
        if ($propietario && Hash::check($request->password, $propietario->password)) {
            $token = $propietario->createToken('propietario-token')->plainTextToken;
            return response()->json([
                'message' => 'Usuario logueado exitosamente',
                'token' => $token,
                'user' => $this->getUserData($propietario, 'propietario'),
                'role' => 'propietario'
            ]);
        }

        throw ValidationException::withMessages([
            'email' => ['Las credenciales son incorrectas.'],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Sesión cerrada correctamente']);
    }

    public function user(Request $request)
    {
        $user = $request->user();

        if ($user instanceof Gerente) {
            return response()->json([
                'user' => $this->getUserData($user, 'gerente'),
                'role' => 'gerente'
            ]);
        }

        if ($user instanceof Empleado) {
            return response()->json([
                'user' => $this->getUserData($user, 'empleado'),
                'role' => 'empleado'
            ]);
        }

        if ($user instanceof Propietario) {
            return response()->json([
                'user' => $this->getUserData($user, 'propietario'),
                'role' => 'propietario'
            ]);
        }

        return response()->json(['error' => 'Usuario no válido'], 401);
    }

    private function getUserData($user, $role)
    {
        $persona = $user->persona;

        return $user;
    }
}
