<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PerfilController;
use App\Http\Controllers\CatalogoController;

// Controladores del Propietario
use App\Http\Controllers\Propietario\DashboardController as PropietarioDashboardController;
use App\Http\Controllers\Propietario\EmpresaController;
use App\Http\Controllers\Propietario\InventarioController;
use App\Http\Controllers\Propietario\VentaController;
use App\Http\Controllers\Propietario\ClienteController;
use App\Http\Controllers\Propietario\CompraController;
use App\Http\Controllers\Propietario\EmpleadoController;
use App\Http\Controllers\Propietario\ProveedorController;
use App\Http\Controllers\Propietario\ReporteController;

// Controladores del Gerente
use App\Http\Controllers\Gerente\DashboardController as GerenteDashboardController;
use App\Http\Controllers\Gerente\InventarioController as GerenteInventarioController;
use App\Http\Controllers\Gerente\VentaController as GerenteVentaController;
use App\Http\Controllers\Gerente\ClienteController as GerenteClienteController;
use App\Http\Controllers\Gerente\CompraController as GerenteCompraController;
use App\Http\Controllers\Gerente\ProveedorController as GerenteProveedorController;
use App\Http\Controllers\Gerente\EmpleadoController as GerenteEmpleadoController;
use App\Http\Controllers\Gerente\DepartamentoController;
use App\Http\Controllers\Gerente\ReporteController as GerenteReporteController;

// Controladores del Empleado
use App\Http\Controllers\Empleado\DashboardController as EmpleadoDashboardController;
use App\Http\Controllers\Empleado\InventarioController as EmpleadoInventarioController;
use App\Http\Controllers\Empleado\VentaController as EmpleadoVentaController;
use App\Http\Controllers\Empleado\ClienteController as EmpleadoClienteController;
use App\Http\Controllers\Empleado\MovimientoController;
use App\Http\Controllers\Empleado\DepartamentoController as EmpleadoDepartamentoController;

use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// RUTAS QUE REQUIEREN AUTENTICACIÓN
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    // PERFIL PARA TODOS LOS USUARIOS
    Route::prefix('perfil')->group(function () {
        Route::get('/', [PerfilController::class, 'show']);
        Route::put('/datos-personales', [PerfilController::class, 'updateDatosPersonales']);
        Route::put('/cambiar-password', [PerfilController::class, 'cambiarPassword']);
    });
    // CATALOGOS COMUNES
    Route::prefix('catalogos')->group(function () {
        Route::get('/categorias', [CatalogoController::class, 'categorias']);
        Route::get('/productos', [CatalogoController::class, 'productos']);
        Route::get('/clientes', [CatalogoController::class, 'clientes']);
    });
    // RUTAS DEL PROPIETARIO
    Route::middleware('role:propietario')->prefix('propietario')->group(function () {

        // Dashboard
        Route::get('/dashboard', [PropietarioDashboardController::class, 'index']);
        // Empresa
        Route::prefix('empresa')->group(function () {
            Route::get('/', [EmpresaController::class, 'show']);
            Route::put('/', [EmpresaController::class, 'update']);
        });
        // Inventario
        Route::prefix('inventario')->group(function () {
            Route::get('/', [InventarioController::class, 'index']);
            Route::get('/reporte-stock-bajo', [InventarioController::class, 'reporteStockBajo']);
        });
        // Ventas
        Route::prefix('ventas')->group(function () {
            Route::get('/', [VentaController::class, 'index']);
            Route::get('/{id}', [VentaController::class, 'show']);
            Route::post('/generar-reporte', [VentaController::class, 'generarReporte']);
        });
        // Clientes
        Route::prefix('clientes')->group(function () {
            Route::get('/', [ClienteController::class, 'index']);
            Route::get('/frecuentes', [ClienteController::class, 'clientesFrecuentes']);
        });
        // Compras
        Route::prefix('compras')->group(function () {
            Route::get('/', [CompraController::class, 'index']);
        });       
        // Empleados
        Route::prefix('empleados')->group(function () {
            Route::get('/', [EmpleadoController::class, 'index']);
            Route::get('/{id}/desempenio', [EmpleadoController::class, 'desempenio']);
        });
        // Proveedores
        Route::prefix('proveedores')->group(function () {
            Route::get('/', [ProveedorController::class, 'index']);
            Route::get('/{id}/historial-compras', [ProveedorController::class, 'historialCompras']);
        });
        // Reportes
        Route::prefix('reportes')->group(function () {
            Route::post('/ventas-fechas', [ReporteController::class, 'ventasPorFechas']);
            Route::get('/compras-proveedor', [ReporteController::class, 'comprasPorProveedor']);
            Route::get('/stock-minimo', [ReporteController::class, 'stockMinimo']);
            Route::get('/empleados-departamento', [ReporteController::class, 'empleadosPorDepartamento']);
        });
    });

    // RUTAS DEL GERENTE
    Route::middleware('role:gerente')->prefix('gerente')->group(function () {
    
        // Dashboard
        Route::get('/dashboard', [GerenteDashboardController::class, 'index']);      
        // Inventario
        Route::prefix('inventario')->group(function () {
            // Productos
            Route::get('/productos', [GerenteInventarioController::class, 'indexProductos']);
            Route::post('/productos', [GerenteInventarioController::class, 'storeProducto']);
            Route::put('/productos/{id}', [GerenteInventarioController::class, 'updateProducto']);
            Route::delete('/productos/{id}', [GerenteInventarioController::class, 'destroyProducto']);
            // Categorías
            Route::get('/categorias', [GerenteInventarioController::class, 'indexCategorias']);
            Route::post('/categorias', [GerenteInventarioController::class, 'storeCategoria']);
            Route::put('/categorias/{id}', [GerenteInventarioController::class, 'updateCategoria']);
            Route::delete('/categorias/{id}', [GerenteInventarioController::class, 'destroyCategoria']);
            // Movimientos
            Route::get('/movimientos', [GerenteInventarioController::class, 'indexMovimientos']);
            Route::post('/movimientos', [GerenteInventarioController::class, 'storeMovimiento']);
        });
        // Ventas
        Route::prefix('ventas')->group(function () {
            Route::get('/', [GerenteVentaController::class, 'index']);
            Route::get('/{id}', [GerenteVentaController::class, 'show']);
            Route::get('/por-empleado', [GerenteVentaController::class, 'ventasPorEmpleado']);
        });
        // Clientes - CRUD
        Route::prefix('clientes')->group(function () {
            Route::get('/', [GerenteClienteController::class, 'index']);
            Route::post('/', [GerenteClienteController::class, 'store']);
            Route::get('/{id}/historial-compras', [GerenteClienteController::class, 'historialCompras']);
        });
        // Compras - CRUD
        Route::prefix('compras')->group(function () {
            Route::get('/', [GerenteCompraController::class, 'index']);
            Route::post('/', [GerenteCompraController::class, 'store']);
            Route::get('/{id}', [GerenteCompraController::class, 'show']);
        });
        // Proveedores - CRUD
        Route::prefix('proveedores')->group(function () {
            Route::get('/', [GerenteProveedorController::class, 'index']);
            Route::post('/', [GerenteProveedorController::class, 'store']);
            Route::put('/{id}', [GerenteProveedorController::class, 'update']);
            Route::delete('/{id}', [GerenteProveedorController::class, 'destroy']);
            Route::get('/{id}/compras', [GerenteProveedorController::class, 'comprasPorProveedor']);
        });
        // Empleados - CRUD Completo
        Route::prefix('empleados')->group(function () {
            Route::get('/', [GerenteEmpleadoController::class, 'index']);
            Route::post('/', [GerenteEmpleadoController::class, 'store']);
            Route::put('/{id}', [GerenteEmpleadoController::class, 'update']);
            Route::delete('/{id}', [GerenteEmpleadoController::class, 'destroy']);
            Route::post('/{id}/asignar-departamentos', [GerenteEmpleadoController::class, 'asignarDepartamentos']);
        });
        // Departamentos - CRUD
        Route::prefix('departamentos')->group(function () {
            Route::get('/', [DepartamentoController::class, 'index']);
            Route::post('/', [DepartamentoController::class, 'store']);
            Route::put('/{id}', [DepartamentoController::class, 'update']);
            Route::delete('/{id}', [DepartamentoController::class, 'destroy']);
            Route::get('/{id}/empleados', [DepartamentoController::class, 'empleadosPorDepartamento']);
        });
        // Reportes
        Route::prefix('reportes')->group(function () {
            Route::post('/ventas', [GerenteReporteController::class, 'ventas']);
            Route::post('/compras', [GerenteReporteController::class, 'compras']);
            Route::get('/inventario', [GerenteReporteController::class, 'inventario']);
        });
        // Catalogos para Gerente
        Route::get('/catalogos/proveedores', [CatalogoController::class, 'proveedores']);
        Route::get('/catalogos/departamentos', [CatalogoController::class, 'departamentos']);
        Route::get('/catalogos/empleados', [CatalogoController::class, 'empleados']);
    });

    // RUTAS DEL EMPLEADO
    Route::middleware('role:empleado')->prefix('empleado')->group(function () {
        // Dashboard
        Route::get('/dashboard', [EmpleadoDashboardController::class, 'index']);
        // Inventario
        Route::prefix('inventario')->group(function () {
            Route::get('/', [EmpleadoInventarioController::class, 'index']);
            Route::get('/stock-bajo', [EmpleadoInventarioController::class, 'stockBajo']);
        });
        // Ventas realizadas
        Route::prefix('ventas')->group(function () {
            Route::get('/', [EmpleadoVentaController::class, 'index']);
            Route::post('/', [EmpleadoVentaController::class, 'store']);
            Route::get('/{id}', [EmpleadoVentaController::class, 'show']);
        });
        // Clientes (registro y consulta)
        Route::prefix('clientes')->group(function () {
            Route::get('/', [EmpleadoClienteController::class, 'index']);
            Route::post('/', [EmpleadoClienteController::class, 'store']);
            Route::get('/buscar/{ci}', [EmpleadoClienteController::class, 'buscar']);
        });
        // Movimientos de inventario
        Route::prefix('movimientos')->group(function () {
            Route::get('/', [MovimientoController::class, 'index']);
            Route::post('/', [MovimientoController::class, 'store']);
        });
        // Departamento
        Route::prefix('departamento')->group(function () {
            Route::get('/mi-departamento', [EmpleadoDepartamentoController::class, 'miDepartamento']);
        });
    });
    // RUTAS COMPARTIDAS ENTRE GERENTE Y EMPLEADO
    Route::middleware('role:gerente,empleado')->prefix('shared')->group(function () {
        // si faltan mas rutas que podemos utilizar solo seria aumentar aqui
        Route::get('/dashboard', function () {
            return response()->json(['message' => 'Dashboard Compartido']);
        });
    });
});

