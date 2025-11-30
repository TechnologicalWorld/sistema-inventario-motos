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
use App\Http\Controllers\Propietario\GerenteController;
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
use Illuminate\Support\Facades\DB;

// ============================================================================
// RUTAS PÚBLICAS - SIN AUTENTICACIÓN
// ============================================================================

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// ============================================================================
// RUTAS PROTEGIDAS - REQUIEREN AUTENTICACIÓN
// ============================================================================

Route::middleware('auth:sanctum')->group(function () {
    
    // RUTAS COMUNES PARA TODOS LOS USUARIOS AUTENTICADOS
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // PERFIL - Accesible por todos los roles
    Route::prefix('perfil')->group(function () {
        Route::get('/', [PerfilController::class, 'show']);
        Route::put('/datos-personales', [PerfilController::class, 'updateDatosPersonales']);
        Route::put('/cambiar-password', [PerfilController::class, 'cambiarPassword']);
    });

    // CATÁLOGOS - Accesibles por todos los roles
    Route::prefix('catalogos')->group(function () {
        Route::get('/categorias', [CatalogoController::class, 'categorias']);
        Route::get('/proveedores', [CatalogoController::class, 'proveedores']);
        Route::get('/departamentos', [CatalogoController::class, 'departamentos']);
        Route::get('/productos', [CatalogoController::class, 'productos']);
        Route::get('/clientes', [CatalogoController::class, 'clientes']);
        Route::get('/empleados', [CatalogoController::class, 'empleados']);
    });

    // ============================================================================
    // RUTAS DEL PROPIETARIO
    // ============================================================================
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
            //Productos
            Route::get('/', [InventarioController::class, 'index']);
            Route::get('/reporte-stock-bajo', [InventarioController::class, 'reporteStockBajo']);
            Route::post('/productos', [InventarioController::class, 'storeProducto']);
            Route::put('/productos/{id}', [InventarioController::class, 'updateProducto']);
            Route::delete('/productos/{id}', [InventarioController::class, 'destroyProducto']);
            Route::get('/productos/{id}', [InventarioController::class, 'showProducto']);
        
            // Categorías
            Route::get('/categorias', [InventarioController::class, 'indexCategorias']);
            Route::post('/categorias', [InventarioController::class, 'storeCategoria']);
            Route::put('/categorias/{id}', [InventarioController::class, 'updateCategoria']);
            Route::delete('/categorias/{id}', [InventarioController::class, 'destroyCategoria']);
            Route::get('/categoria/{id}', [InventarioController::class, 'showCategoria']);

            
            // Movimientos
            Route::get('/movimientos', [InventarioController::class, 'indexMovimientos']);
            Route::get('/movimientos/{id}', [InventarioController::class, 'showMovimiento']);
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
            Route::post('/', [ClienteController::class, 'store']);
            Route::put('/{id}', [ClienteController::class, 'update']);
            Route::delete('/{id}', [ClienteController::class, 'destroy']);
            Route::get('/{id}', [ClienteController::class, 'show']);
            Route::get('/{id}/historial-compras', [ClienteController::class, 'historialCompras']);
        });
        
        // Compras
        Route::prefix('compras')->group(function () {
            Route::get('/', [CompraController::class, 'index']);
            Route::get('/{id}', [CompraController::class, 'show']);
        });
        // Departamentos 
        Route::prefix('departamentos')->group(function () {
            Route::get('/', [DepartamentoController::class, 'index']);
            Route::post('/', [DepartamentoController::class, 'store']);
            Route::put('/{id}', [DepartamentoController::class, 'update']);
            Route::delete('/{id}', [DepartamentoController::class, 'destroy']);
            Route::get('/{id}', [DepartamentoController::class, 'empleadosPorDepartamento']);
        });
        
        // Empleados
        Route::prefix('empleados')->group(function () {
            Route::get('/', [EmpleadoController::class, 'index']);
            Route::post('/', [EmpleadoController::class, 'store']);
            Route::put('/{id}', [EmpleadoController::class, 'update']);
            Route::delete('/{id}', [EmpleadoController::class, 'destroy']);
            Route::get('/{id}/desempenio', [EmpleadoController::class, 'desempenio']);
        });
        
        // Proveedores
        Route::prefix('proveedores')->group(function () {
            Route::get('/', [ProveedorController::class, 'index']);
            Route::post('/', [ProveedorController::class, 'store']);
            Route::put('/{id}', [ProveedorController::class, 'update']);
            Route::delete('/{id}', [ProveedorController::class, 'destroy']);
            Route::get('/{id}', [ProveedorController::class, 'show']);
            Route::get('/{id}/historial-compras', [ProveedorController::class, 'historialCompras']);
        });
        
        // Gerentes
        Route::prefix('gerentes')->group(function () {
            Route::get('/', [GerenteController::class, 'index']);
            Route::post('/', [GerenteController::class, 'store']);
            Route::put('/{id}', [GerenteController::class, 'update']);
            Route::delete('/{id}', [GerenteController::class, 'destroy']);
            Route::get('/{id}', [GerenteController::class, 'show']);
            Route::get('/{id}/desempenio', [GerenteController::class, 'desempenio']);
        });
        // Reportes
        Route::prefix('reportes')->group(function () {
            Route::post('/ventas-fechas', [ReporteController::class, 'ventasPorFechas']);
            Route::get('/compras-proveedor', [ReporteController::class, 'comprasPorProveedor']);
            Route::get('/stock-minimo', [ReporteController::class, 'stockMinimo']);
            Route::get('/empleados-departamento', [ReporteController::class, 'empleadosPorDepartamento']);
        });
    });

    // ============================================================================
    // RUTAS DEL GERENTE
    // ============================================================================
    Route::middleware('role:gerente')->prefix('gerente')->group(function () {
        
        // Dashboard
        Route::get('/dashboard', [GerenteDashboardController::class, 'index']);
        
        // Inventario - CRUD Completo
        Route::prefix('inventario')->group(function () {
            // Productos
            Route::get('/productos', [GerenteInventarioController::class, 'indexProductos']);
            Route::post('/productos', [GerenteInventarioController::class, 'storeProducto']);
            Route::get('/productos/{id}', [GerenteInventarioController::class, 'showProducto']);
            Route::put('/productos/{id}', [GerenteInventarioController::class, 'updateProducto']);
            Route::delete('/productos/{id}', [GerenteInventarioController::class, 'destroyProducto']);
            
            // Categorías
            Route::get('/categorias', [GerenteInventarioController::class, 'indexCategorias']);
            Route::post('/categorias', [GerenteInventarioController::class, 'storeCategoria']);
            Route::get('/categorias/{id}', [GerenteInventarioController::class, 'showCategoria']);
            Route::put('/categorias/{id}', [GerenteInventarioController::class, 'updateCategoria']);
            Route::delete('/categorias/{id}', [GerenteInventarioController::class, 'destroyCategoria']);
            
            // Movimientos
            Route::get('/movimientos', [GerenteInventarioController::class, 'indexMovimientos']);
            Route::post('/movimientos', [GerenteInventarioController::class, 'storeMovimiento']);
            Route::get('/movimientos/{id}', [GerenteInventarioController::class, 'showMovimiento']);
        });
        
        // Ventas
        Route::prefix('ventas')->group(function () {
            Route::get('/', [GerenteVentaController::class, 'index']);
            Route::get('/{id}', [GerenteVentaController::class, 'show']);
            Route::get('/por-empleado', [GerenteVentaController::class, 'ventasPorEmpleado']);
        });
        
        // Clientes 
        Route::prefix('clientes')->group(function () {
            Route::get('/', [GerenteClienteController::class, 'index']);
            Route::post('/', [GerenteClienteController::class, 'store']);
            Route::get('/{id}', [GerenteClienteController::class, 'show']);
            Route::put('/{id}', [GerenteClienteController::class, 'update']);
            Route::delete('/{id}', [GerenteClienteController::class, 'destroy']);
            Route::get('/{id}/historial-compras', [GerenteClienteController::class, 'historialCompras']);
        });
        
        // Compras 
        Route::prefix('compras')->group(function () {
            Route::get('/', [GerenteCompraController::class, 'index']);
            Route::post('/', [GerenteCompraController::class, 'store']);
            Route::get('/{id}', [GerenteCompraController::class, 'show']);
        });
        
        // Proveedores 
        Route::prefix('proveedores')->group(function () {
            Route::get('/', [GerenteProveedorController::class, 'index']);
            Route::post('/', [GerenteProveedorController::class, 'store']);
            Route::get('/{id}', [GerenteProveedorController::class, 'show']);
            Route::put('/{id}', [GerenteProveedorController::class, 'update']);
            Route::delete('/{id}', [GerenteProveedorController::class, 'destroy']);
            Route::get('/{id}/compras', [GerenteProveedorController::class, 'comprasPorProveedor']);
        });
        
        // Empleados 
        Route::prefix('empleados')->group(function () {
            Route::get('/', [GerenteEmpleadoController::class, 'index']);
            Route::post('/', [GerenteEmpleadoController::class, 'store']);
            Route::get('/{id}', [GerenteEmpleadoController::class, 'show']);
            Route::put('/{id}', [GerenteEmpleadoController::class, 'update']);
            Route::delete('/{id}', [GerenteEmpleadoController::class, 'destroy']);
            Route::post('/{id}/asignar-departamentos', [GerenteEmpleadoController::class, 'asignarDepartamentos']);
            Route::get('/{id}/historial', [GerenteEmpleadoController::class, 'showHistorialEmpleado']);
        });
        
        // Departamentos 
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
        
        // Catálogos adicionales para Gerente
        Route::get('/catalogos/proveedores', [CatalogoController::class, 'proveedores']);
        Route::get('/catalogos/departamentos', [CatalogoController::class, 'departamentos']);
        Route::get('/catalogos/empleados', [CatalogoController::class, 'empleados']);
    });

    // ============================================================================
    // RUTAS DEL EMPLEADO
    // ============================================================================
    Route::middleware('role:empleado')->prefix('empleado')->group(function () {
        
        // Dashboard
        Route::get('/dashboard', [EmpleadoDashboardController::class, 'index']);
        Route::get('/dashboard/estadisticas-avanzadas', [EmpleadoDashboardController::class, 'estadisticasAvanzadas']);
        
        // Inventario 
        Route::prefix('inventario')->group(function () {
            Route::get('/', [EmpleadoInventarioController::class, 'index']);
            Route::get('/stock-bajo', [EmpleadoInventarioController::class, 'stockBajo']);
        });
        
        // Ventas (propias del empleado)
        Route::prefix('ventas')->group(function () {
            Route::get('/', [EmpleadoVentaController::class, 'index']);
            Route::post('/', [EmpleadoVentaController::class, 'store']);
            Route::get('/{id}', [EmpleadoVentaController::class, 'show']);
        });
        
        // Clientes (registro y consulta)
        Route::prefix('clientes')->group(function () {
            Route::get('/', [EmpleadoClienteController::class, 'index']);
            Route::post('/', [EmpleadoClienteController::class, 'store']);
            Route::get('/{id}', [EmpleadoClienteController::class, 'show']);
            Route::get('/buscar/{ci}', [EmpleadoClienteController::class, 'buscar']);
        });
        
        //productos
        Route::prefix('inventario')->group(function () {
            Route::get('/', [EmpleadoInventarioController::class, 'index']);
            Route::get('/stock-bajo', [EmpleadoInventarioController::class, 'stockBajo']);
            Route::get('/productos/{id}', [EmpleadoInventarioController::class, 'showProducto']);
        });

        // Movimientos de inventario (realizados por el empleado)
        Route::prefix('movimientos')->group(function () {
            Route::get('/', [MovimientoController::class, 'index']);
            Route::post('/', [MovimientoController::class, 'store']);
        });
        
        // Departamento (información del departamento del empleado)
        Route::prefix('departamento')->group(function () {
            Route::get('/mi-departamento', [EmpleadoDepartamentoController::class, 'miDepartamento']);
        });
    });

    // ============================================================================
    // RUTAS COMPARTIDAS ENTRE GERENTE Y EMPLEADO
    // ============================================================================
    Route::middleware('role:gerente,empleado')->prefix('shared')->group(function () {
        Route::get('/dashboard', function () {
            return response()->json(['message' => 'Dashboard Compartido']);
        });
        
        // Ejemplo de rutas compartidas que podrías agregar:
        // Route::get('/notificaciones', [NotificacionController::class, 'index']);
        // Route::get('/calendario', [CalendarioController::class, 'index']);
    });
});

// ============================================================================
// RUTAS DE PRUEBA Y DESARROLLO (solo cuando subamos al hostinguer o en funcionamiento)
// ============================================================================

if (app()->environment('local')) {
    Route::get('/test', function () {
        return response()->json([
            'message' => 'API funcionando correctamente',
            'timestamp' => now(),
            'version' => '1.0.0'
        ]);
    });
    
    Route::get('/health', function () {
        return response()->json([
            'status' => 'OK',
            'database' => DB::connection()->getDatabaseName(),
            'timestamp' => now()
        ]);
    });
}