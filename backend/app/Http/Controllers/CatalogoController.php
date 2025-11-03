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
        $categorias = Categoria::all();
        return response()->json($categorias);
    }

    public function proveedores()
    {
        $proveedores = EmpresaProveedora::all();
        return response()->json($proveedores);
    }

    public function departamentos()
    {
        $departamentos = Departamento::all();
        return response()->json($departamentos);
    }

    public function productos()
    {
        $productos = Producto::with('categoria')->activos()->get();
        return response()->json($productos);
    }

    public function clientes()
    {
        $clientes = Cliente::with('persona')->get();
        return response()->json($clientes);
    }

    public function empleados()
    {
        $empleados = Empleado::with('persona')->get();
        return response()->json($empleados);
    }
}