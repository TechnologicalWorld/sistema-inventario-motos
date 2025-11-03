<?php

namespace App\Http\Controllers;

use App\Models\Persona;
use App\Models\Propietario;
use App\Models\Gerente;
use App\Models\Empleado;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class PersonaController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Persona::query();

            // Filtros
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('ci', 'LIKE', "%{$search}%")
                      ->orWhere('nombres', 'LIKE', "%{$search}%")
                      ->orWhere('paterno', 'LIKE', "%{$search}%")
                      ->orWhere('materno', 'LIKE', "%{$search}%");
                });
            }

            if ($request->has('genero')) {
                $query->where('genero', $request->genero);
            }

            // Ordenamiento
            $sortField = $request->get('sort_field', 'idPersona');
            $sortDirection = $request->get('sort_direction', 'desc');
            $query->orderBy($sortField, $sortDirection);

            $personas = $query->paginate($request->get('per_page', 15));

            return response()->json([
                'status' => true,
                'message' => 'Personas recuperadas exitosamente',
                'data' => $personas
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error al recuperar las personas',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'ci' => 'required|string|max:20|unique:persona,ci',
            'paterno' => 'required|string|max:50',
            'materno' => 'required|string|max:50',
            'nombres' => 'required|string|max:100',
            'fecha_naci' => 'required|date',
            'genero' => 'required|in:M,F',
            'telefono' => 'nullable|string|max:15'
        ]);

        $persona = Persona::create($request->all());
        return response()->json([
            'message' => 'Persona creada correctamente',
            'persona' => $persona
        ], 201);
    }

    //SI SE UTILIZA PARA LOS FILTROS DE TABLAS POR ROL
    public function show($id)
    {
        $persona = Persona::with([
            'propietario',
            'gerente',
            'empleado.departamentos',
            'cliente.ventas' => function($query) {
                $query->with(['empleado.persona', 'detalleVentas'])->latest()->take(5);
            }
        ])->findOrFail($id);

        // ROLES
        $roles = [];
        if ($persona->propietario) $roles[] = 'propietario';
        if ($persona->gerente) $roles[] = 'gerente';
        if ($persona->empleado) $roles[] = 'empleado';
        if ($persona->cliente) $roles[] = 'cliente';

        $persona->roles = $roles;
        return response()->json($persona);
    }

    public function update(Request $request, $id)
    {
        $persona = Persona::findOrFail($id);

        $request->validate([
            'ci' => 'required|string|max:20|unique:persona,ci,' . $id . ',idPersona',
            'paterno' => 'required|string|max:50',
            'materno' => 'required|string|max:50',
            'nombres' => 'required|string|max:100',
            'fecha_naci' => 'required|date',
            'genero' => 'required|in:M,F',
            'telefono' => 'nullable|string|max:15'
        ]);

        $persona->update($request->all());

        return response()->json([
            'message' => 'Persona actualizada correctamente',
            'persona' => $persona->fresh()
        ]);
    }

    public function destroy($id)
    {
        $persona = Persona::with(['propietario', 'gerente', 'empleado', 'cliente'])->findOrFail($id);

        // Verifica si tiene rol
        $rolesAsociados = [];
        if ($persona->propietario) $rolesAsociados[] = 'propietario';
        if ($persona->gerente) $rolesAsociados[] = 'gerente';
        if ($persona->empleado) $rolesAsociados[] = 'empleado';
        if ($persona->cliente) $rolesAsociados[] = 'cliente';

        if (!empty($rolesAsociados)) {
            return response()->json([
                'message' => 'No se puede eliminar la persona porque tiene roles asociados: ' . implode(', ', $rolesAsociados),
                'roles_asociados' => $rolesAsociados
            ], 422);
        }

        $persona->delete();
        return response()->json([
            'message' => 'Persona eliminada correctamente'
        ]);
    }

    //FILTROS DE BUSQUEDA 
    public function buscarAvanzado(Request $request)
    {
        $query = Persona::query();

        if ($request->has('ci')) {$query->where('ci', 'like', "%{$request->ci}%");}
        if ($request->has('nombres')) {$query->where('nombres', 'like', "%{$request->nombres}%");}
        if ($request->has('paterno')) {$query->where('paterno', 'like', "%{$request->paterno}%");}
        if ($request->has('materno')) {$query->where('materno', 'like', "%{$request->materno}%");}
        if ($request->has('telefono')) {$query->where('telefono', 'like', "%{$request->telefono}%");}
        if ($request->has('genero')) {$query->where('genero', $request->genero);}
        if ($request->has('edad_min')) {
            $fechaMaxima = now()->subYears($request->edad_min);
            $query->where('fecha_naci', '<=', $fechaMaxima);
        }
        if ($request->has('edad_max')) {
            $fechaMinima = now()->subYears($request->edad_max + 1);
            $query->where('fecha_naci', '>=', $fechaMinima);
        }
        if ($request->has('fecha_naci_inicio')) {
            $query->where('fecha_naci', '>=', $request->fecha_naci_inicio);
        }

        if ($request->has('fecha_naci_fin')) {
            $query->where('fecha_naci', '<=', $request->fecha_naci_fin);
        }

        // Filtrar por roles
        if ($request->has('tiene_propietario')) {$query->whereHas('propietario');}
        if ($request->has('tiene_gerente')) {$query->whereHas('gerente');}
        if ($request->has('tiene_empleado')) {$query->whereHas('empleado');}
        if ($request->has('tiene_cliente')) {$query->whereHas('cliente');}
        $personas = $query->with(['propietario', 'gerente', 'empleado', 'cliente'])
            ->orderBy('paterno')
            ->orderBy('materno')
            ->orderBy('nombres')
            ->paginate($request->get('per_page', 15));
        return response()->json($personas);
    }

    // ESTADISTICAS GENERALES DE PERSONAS Y REPORTES
    //Verificar si una CI existe
    public function verificarCi($ci)
    {
        $persona = Persona::where('ci', $ci)->first();

        if ($persona) {
            $roles = [];
            if ($persona->propietario) $roles[] = 'propietario';
            if ($persona->gerente) $roles[] = 'gerente';
            if ($persona->empleado) $roles[] = 'empleado';
            if ($persona->cliente) $roles[] = 'cliente';

            return response()->json([
                'existe' => true,
                'persona' => $persona->only(['idPersona', 'nombres', 'paterno', 'materno']),
                'roles' => $roles
            ]);
        }

        return response()->json([
            'existe' => false
        ]);
    }
    //Obtener personas por rol específico
    public function porRol($rol)
    {
        $query = Persona::query();

        switch ($rol) {
            case 'propietario':
                $query->whereHas('propietario');
                break;
            case 'gerente':
                $query->whereHas('gerente');
                break;
            case 'empleado':
                $query->whereHas('empleado');
                break;
            case 'cliente':
                $query->whereHas('cliente');
                break;
            default:
                return response()->json([
                    'message' => 'Rol no válido. Opciones: propietario, gerente, empleado, cliente'
                ], 422);
        }

        $personas = $query->with($rol)
            ->orderBy('paterno')
            ->orderBy('materno')
            ->orderBy('nombres')
            ->get();

        return response()->json([
            'rol' => $rol,
            'total' => $personas->count(),
            'personas' => $personas
        ]);
    }
    // Asignar rol a una persona existente
    public function asignarRol(Request $request, $id)
    {
        $request->validate([
            'rol' => 'required|in:propietario,gerente,empleado,cliente',
            'datos_rol' => 'required|array'
        ]);

        $persona = Persona::findOrFail($id);

        return DB::transaction(function () use ($request, $persona) {
            $rol = $request->rol;
            $datosRol = $request->datos_rol;
            // Verificar si ya tiene el rol
            $tieneRol = false;
            switch ($rol) {
                case 'propietario':
                    $tieneRol = $persona->propietario !== null;
                    break;
                case 'gerente':
                    $tieneRol = $persona->gerente !== null;
                    break;
                case 'empleado':
                    $tieneRol = $persona->empleado !== null;
                    break;
                case 'cliente':
                    $tieneRol = $persona->cliente !== null;
                    break;
            }

            if ($tieneRol) {
                return response()->json([
                    'message' => "La persona ya tiene el rol de {$rol}"
                ], 422);
            }
            // ASIGNAR ROL SEGUN TIPO
            switch ($rol) {
                case 'propietario':
                    Propietario::create(array_merge([
                        'idPropietario' => $persona->idPersona
                    ], $datosRol));
                    break;

                case 'gerente':
                    Gerente::create(array_merge([
                        'idGerente' => $persona->idPersona
                    ], $datosRol));
                    break;

                case 'empleado':
                    Empleado::create(array_merge([
                        'idEmpleado' => $persona->idPersona
                    ], $datosRol));
                    break;

                case 'cliente':
                    Cliente::create(array_merge([
                        'idCliente' => $persona->idPersona
                    ], $datosRol));
                    break;
            }

            return response()->json([
                'message' => "Rol {$rol} asignado correctamente a la persona",
                'persona' => $persona->fresh()->load($rol)
            ]);
        });
    }

    //Obtener historial completo de una persona
    public function historialCompleto($id)
    {
        $persona = Persona::findOrFail($id);
        $historial = [];
        //  empleado
        if ($persona->empleado) {
            $historial['empleado'] = [
                'ventas' => $persona->empleado->ventas()
                    ->with(['cliente.persona', 'detalleVentas'])
                    ->latest()
                    ->take(10)
                    ->get(),
                'movimientos' => $persona->empleado->movimientos()
                    ->with('producto')
                    ->latest()
                    ->take(10)
                    ->get(),
                'departamentos' => $persona->empleado->trabajos()
                    ->with('departamento')
                    ->latest()
                    ->get()
            ];
        }

        //  gerente
        if ($persona->gerente) {
            $historial['gerente'] = [
                'compras' => $persona->gerente->compras()
                    ->with(['empresaProveedora', 'detalleCompras.producto'])
                    ->latest()
                    ->take(10)
                    ->get()
            ];
        }

        //  cliente
        if ($persona->cliente) {
            $historial['cliente'] = [
                'compras' => $persona->cliente->ventas()
                    ->with(['empleado.persona', 'detalleVentas'])
                    ->latest()
                    ->take(10)
                    ->get()
            ];
        }

        return response()->json([
            'persona' => $persona,
            'historial' => $historial
        ]);
    }
    //Buscar personas por cédula o nombre (para autocompletar los modales o selectores)
    public function buscarRapido(Request $request)
    {
        $request->validate([
            'q' => 'required|string|min:2'
        ]);

        $search = $request->q;

        $personas = Persona::where('ci', 'like', "%{$search}%")
            ->orWhere('nombres', 'like', "%{$search}%")
            ->orWhere('paterno', 'like', "%{$search}%")
            ->orWhere('materno', 'like', "%{$search}%")
            ->select('idPersona', 'ci', 'nombres', 'paterno', 'materno')
            ->limit(10)
            ->get()
            ->map(function($persona) {
                return [
                    'id' => $persona->idPersona,
                    'text' => "{$persona->ci} - {$persona->nombre_completo}"
                ];
            });

        return response()->json($personas);
    }
}