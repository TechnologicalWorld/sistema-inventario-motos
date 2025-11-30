<?php

namespace App\Http\Controllers\Propietario;

use App\Http\Controllers\Controller;
use App\Models\Empleado;
use App\Models\Persona;
use App\Models\User;
use App\Models\Trabaja;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class EmpleadoController extends Controller
{
    public function index()
    {
        try {
            $empleados = Empleado::with(['persona', 'departamentos'])
                ->get()
                ->map(function($empleado) {
                    return [
                        'id' => $empleado->idEmpleado,
                        'nombre_completo' => $empleado->nombre_completo,
                        'ci' => $empleado->ci,
                        'telefono' => $empleado->telefono,
                        'fecha_contratacion' => $empleado->fecha_contratacion,
                        'departamentos' => $empleado->departamentos->pluck('nombre'),
                        'total_ventas' => $empleado->total_ventas,
                        'monto_total_ventas' => $empleado->monto_total_ventas
                    ];
                });

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
    
    public function desempenio($id)
    {
        try {
            $empleado = Empleado::with(['persona', 'ventas' => function($query) {
                $query->with('detalleVentas')->latest()->take(10);
            }, 'movimientos' => function($query) {
                $query->with('producto')->latest()->take(10);
            }])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => [
                    'empleado' => $empleado,
                    'estadisticas' => [
                        'total_ventas' => $empleado->total_ventas,
                        'monto_total_ventas' => $empleado->monto_total_ventas,
                        'total_movimientos' => $empleado->total_movimientos
                    ]
                ]
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Empleado no encontrado'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener el desempeño del empleado',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function store (Request $request){

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
            'password' => 'required|string|min:4',
            'departamentos' => 'nullable|array',
            'departamentos.*' => 'exists:departamento,idDepartamento'
        ]);

        if($validator->fails()){
            return response()->json([
                'success'=>false,
                "errors"=> $validator->errors()
            ], 422);
        }
        DB::beginTransaction();

        try{
            $persona = Persona::create($request->only([
                'ci', 'paterno', 'materno', 'nombres', 'fecha_naci', 'genero', 'telefono'
            ]));
            $empleado = Empleado::create([
                'idEmpleado' => $persona->idPersona,
                'fecha_contratacion' =>$request->fecha_contratacion,
                'email'=>$request->email,
                'direccion'=>$request->direccion,
                'password' => bcrypt($request->password)
            ]);
            
            DB::commit();
            return response()->json([
                'success'=> true,
                'message' => 'Empleado creado OK',
                'data'=>$empleado->load(['persona', 'departamentos'])
            ], 201);
        }catch(\Exception $e){
            DB::rollBack();
            return response()->json([
                'success'=>false,
                'error'=>'Error al crear Empleado',
                'details'=>$e->getMessage()
            ],500);
        }
    }
    
    public function update(Request $request, $id){
        try{
            $empleado = Empleado::with('persona')->findOrFail($id);

            $validator = Validator::make($request->all(), [
                'ci' => 'required|string|unique:persona,ci, ' . $empleado->persona->idPersona . ',idPersona',
                'paterno' => 'required|string|max:255',
                'materno' => 'required|string|max:255',
                'nombres' => 'required|string|max:255',
                'fecha_naci' => 'required|date',
                'genero' => 'required|in:M,F,O',
                'telefono' => 'required|string|max:20',
                'email' => 'required|email|unique:empleado,email, ' . $id . ',idEmpleado',
                'direccion' => 'required|string',
                'fecha_contratacion' => 'required|date',
                'password' => 'required|string|min:4'
            ]);
            if($validator->fails()){
                return response()->json([
                    'success'=>false,
                    'errors'=>$validator->errors()
                ],422);
            }
            DB::beginTransaction();
            $empleado->persona->update($request->only([
                'ci', 'paterno', 'materno', 'nombres','fecha_naci', 'genero', 'telefono'
            ]));

            $empleadoData=[
                'email'=> $request->email,
                'direccion'=>$request->direccion,
                'fecha_contratacion'=>$request->fecha_contratacion
            ];
            if($request->password){
                $empleadoData["password"]=bcrypt($request->password);
            }
            $empleado->update($empleadoData);
            DB::commit();
            return response()->json([
                'success'=>true,
                'message'=>'Empleado actualizado OK',
                'data'=>$empleado->load(['persona', 'departamentos'])
            ],200);

        }catch(ModelNotFoundException $e){
            return response()->json([
                'success'=>false,
                'error'=>'empleado no encontrado'
            ], 404);
        }catch(\Exception $e){
            DB::rollBack();
            return response()->json([
                'success'=>false,
                'error'=>'error al actualizar empleado',
                'details'=> $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id){
        try{
            $empleado= Empleado::findOrFail($id);

            if($empleado->ventas()->exists() || $empleado->movimientos()->exists()){
                return response()->json([
                    'success' => true,
                    'error'=> 'No se puede eliminar el empleado por que tiene ventas o movimientos registrados'
                ], 422);
            }
            DB::beginTransaction();
            
            $empleado->user()->delete();
            $empleado->trabajos()->delete();
            $empleado->persona->delete();
            $empleado->delete();

            DB::commit();

            return response()->json([
                'success'=>true,
                'message' =>'empleado eliminado OK'
            ], 200);
        }catch(ModelNotFoundException $e){
            return response()->json([
                'success'=>false,
                'error'=> 'empleado no encontrado'
            ], 404);
        }catch(\Exception $e){
            DB::rollBack();
            return response()->json([
                'success' => false,
                'error'=>'error al eliminar',
                'details'=>$e->getMessage()
            ], 500);
        }
    }

    public function show($id){
        try{
            $empleado = Empleado::with(['persona', 'departamentos'])->findOrFail($id);

            return response()->json([
                'success'=> true,
                'data'=>$empleado
            ], 200);
        }catch(ModelNotFoundException $e){
            return response()->json([
                'success'=> false,
                'error'=>'Empleado no encontrado'
            ], 404);
        }catch(\Exception $e){
            return response()->json([
                'success'=> false,
                'error'=> 'Error al obtener el empleado',
                'details' =>$e->getMessage()
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

            Trabaja::where('idEmpleado', $empleado->idEmpleado)->delete();
            
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
}