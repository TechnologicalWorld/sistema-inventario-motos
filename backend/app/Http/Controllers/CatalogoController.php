<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use App\Models\EmpresaProveedora;
use App\Models\Departamento;
use App\Models\Producto;
use App\Models\Cliente;
use App\Models\Empleado;
use Illuminate\Http\Request;

class CatalogoController extends Controller
{
    public function categorias()
    {
        try {
            $categorias = Categoria::all();
            
            return response()->json([
                'success' => true,
                'data' => $categorias
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener categorías',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function proveedores()
    {
        try {
            $proveedores = EmpresaProveedora::all();
            
            return response()->json([
                'success' => true,
                'data' => $proveedores
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener proveedores',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function departamentos()
    {
        try {
            $departamentos = Departamento::all();
            
            return response()->json([
                'success' => true,
                'data' => $departamentos
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener departamentos',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function productos()
    {
        try {
            $productos = Producto::with('categoria')->activos()->get();
            
            return response()->json([
                'success' => true,
                'data' => $productos
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener productos',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function clientes()
    {
        try {
            $clientes = Cliente::with('persona')->get();
            
            return response()->json([
                'success' => true,
                'data' => $clientes
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener clientes',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function empleados()
    {
        try {
            $empleados = Empleado::with('persona')->get();
            
            return response()->json([
                'success' => true,
                'data' => $empleados
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener empleados',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}