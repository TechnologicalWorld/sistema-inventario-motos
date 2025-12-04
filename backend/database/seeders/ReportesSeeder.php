<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReportesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Primero eliminar todos los procedimientos
        $this->dropAllProcedures();
        
        // Esperar un momento para asegurar que se eliminaron
        sleep(1);
        
        // Crear procedimientos almacenados
        $this->createProcedures();
    }

    private function dropAllProcedures()
    {
        try {
            
            // Eliminar cada procedimiento
            foreach ($procedures as $procedure) {
                $name = $procedure->routine_name;
                DB::statement("DROP PROCEDURE IF EXISTS `$name`");
            }
            
            $this->command->info('Todos los procedimientos almacenados eliminados correctamente.');
        } catch (\Exception $e) {
            $this->command->warn('Error al eliminar procedimientos: ' . $e->getMessage());
        }
    }

    private function dropExistingProcedures()
    {
        $procedures = [
            'sp_ganancias_producto_mensual',
            'sp_resumen_ganancias_mensual',
            'sp_productos_stock',
            'sp_conteo_stock_critico',
            'sp_costos_compra_mensual',
            'sp_resumen_compras_mensual',
            'sp_ventas_por_empleado_mensual',
            'sp_compras_por_producto_mensual',
            'sp_compras_por_producto_mensual_optional'
        ];

        foreach ($procedures as $procedure) {
            try {
                DB::statement("DROP PROCEDURE IF EXISTS `$procedure`");
            } catch (\Exception $e) {
                // Ignorar errores si el procedimiento no existe
                continue;
            }
        }
    }

    private function createProcedures()
    {
        // Deshabilitar verificaciones temporales
        DB::statement('SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE=\'NO_AUTO_VALUE_ON_ZERO\'');
        DB::statement('SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0');
        
        try {
            // 1. Procedimiento para ganancias por producto
            DB::statement("
                CREATE PROCEDURE sp_ganancias_producto_mensual(
                    IN p_anio INT,
                    IN p_mes INT
                )
                BEGIN
                    SELECT 
                        p.idProducto,
                        p.nombre,
                        p.codigoProducto,
                        SUM(d.cantidad * p.precioVenta - d.cantidad * p.precioCompra) AS Ganancia,
                        SUM(d.cantidad * p.precioVenta) AS VentasTotales
                    FROM detalle_venta d 
                    INNER JOIN producto p ON p.idProducto = d.idProducto
                    INNER JOIN venta v ON v.idVenta = d.idVenta
                    WHERE YEAR(v.fecha) = p_anio AND MONTH(v.fecha) = p_mes
                    GROUP BY p.idProducto, p.nombre, p.codigoProducto
                    ORDER BY Ganancia DESC, VentasTotales DESC;
                END
            ");
            
            $this->command->info('Procedimiento 1 creado: sp_ganancias_producto_mensual');

            // 2. Procedimiento para resumen total de ganancias
            DB::statement("
                CREATE PROCEDURE sp_resumen_ganancias_mensual(
                    IN p_anio INT,
                    IN p_mes INT
                )
                BEGIN
                    SELECT 
                        SUM(d.cantidad * p.precioVenta - d.cantidad * p.precioCompra) AS GananciaTotal,
                        SUM(d.cantidad * p.precioVenta) AS VentasTotales
                    FROM detalle_venta d 
                    INNER JOIN producto p ON p.idProducto = d.idProducto
                    INNER JOIN venta v ON v.idVenta = d.idVenta
                    WHERE YEAR(v.fecha) = p_anio AND MONTH(v.fecha) = p_mes;
                END
            ");
            
            $this->command->info('Procedimiento 2 creado: sp_resumen_ganancias_mensual');

            // 3. Procedimiento para productos con stock crítico
            DB::statement("
                CREATE PROCEDURE sp_productos_stock()
                BEGIN
                    SELECT 
                        p.nombre,
                        p.codigoProducto,
                        p.descripcion,
                        p.stock,
                        p.stockMinimo,
                        CASE 
                            WHEN p.stock <= p.stockMinimo THEN 'CRÍTICO'
                            WHEN p.stock <= (p.stockMinimo * 1.5) THEN 'BAJO'
                            ELSE 'NORMAL'
                        END AS estado_stock
                    FROM producto p 
                    ORDER BY p.stock ASC;
                END
            ");
            
            $this->command->info('Procedimiento 3 creado: sp_productos_stock');

            // 4. Procedimiento para conteo de productos con stock crítico
            DB::statement("
                CREATE PROCEDURE sp_conteo_stock_critico()
                BEGIN
                    SELECT COUNT(*) AS NroProd
                    FROM producto p 
                    WHERE p.stock <= p.stockMinimo;
                END
            ");
            
            $this->command->info('Procedimiento 4 creado: sp_conteo_stock_critico');

            // 5. Procedimiento para costos de compra por producto
            DB::statement("
                CREATE PROCEDURE sp_costos_compra_mensual(
                    IN p_anio INT,
                    IN p_mes INT
                )
                BEGIN
                    SELECT 
                        p.idProducto,
                        p.nombre,
                        p.codigoProducto,
                        p.descripcion,
                        SUM(p.precioCompra * d.cantidad) AS CostoTotal,
                        SUM(d.cantidad) AS CantidadComprada
                    FROM compra c 
                    INNER JOIN detalle_compra d ON d.idCompra = c.idCompra
                    INNER JOIN producto p ON p.idProducto = d.idProducto
                    WHERE YEAR(c.fecha) = p_anio AND MONTH(c.fecha) = p_mes
                    GROUP BY p.idProducto, p.nombre, p.codigoProducto, p.descripcion
                    ORDER BY CostoTotal DESC, CantidadComprada DESC;
                END
            ");
            
            $this->command->info('Procedimiento 5 creado: sp_costos_compra_mensual');

            // 6. Procedimiento para resumen de compras (corregido con totalpago)
            DB::statement("
                CREATE PROCEDURE sp_resumen_compras_mensual(
                    IN p_anio INT,
                    IN p_mes INT
                )
                BEGIN
                    SELECT 
                        IFNULL(SUM(c.totalpago), 0) AS TotalGasto,
                        COUNT(DISTINCT c.idCompra) AS NroCompras,
                        COUNT(d.idDetalleCompra) AS NroProductosComprados
                    FROM compra c 
                    INNER JOIN detalle_compra d ON d.idCompra = c.idCompra
                    WHERE YEAR(c.fecha) = p_anio AND MONTH(c.fecha) = p_mes;
                END
            ");
            
            $this->command->info('Procedimiento 6 creado: sp_resumen_compras_mensual');

            // 7. Procedimiento para ventas por empleado mensual
            DB::statement("
                CREATE PROCEDURE sp_ventas_por_empleado_mensual(
                    IN p_anio INT,
                    IN p_mes INT
                )
                BEGIN
                    SELECT 
                        p.idPersona,
                        CONCAT_WS(' ', p.nombres, p.paterno, p.materno) AS NombreCompleto,
                        SUM(v.montoTotal) AS TotalVendido,
                        COUNT(DISTINCT v.idVenta) AS NroVentas,
                        AVG(v.montoTotal) AS PromedioVenta,
                        MIN(v.fecha) AS PrimeraVenta,
                        MAX(v.fecha) AS UltimaVenta
                    FROM venta v 
                    INNER JOIN detalle_venta d ON d.idVenta = v.idVenta
                    INNER JOIN persona p ON p.idPersona = v.idEmpleado
                    WHERE YEAR(v.fecha) = p_anio 
                        AND MONTH(v.fecha) = p_mes
                    GROUP BY p.idPersona, 
                             CONCAT_WS(' ', p.nombres, p.paterno, p.materno)
                    ORDER BY TotalVendido DESC, NroVentas DESC;
                END
            ");
            
            $this->command->info('Procedimiento 7 creado: sp_ventas_por_empleado_mensual');

            // 8. Procedimiento para compras por producto con filtro por gerente
            DB::statement("
                CREATE PROCEDURE sp_compras_por_producto_mensual(
                    IN p_anio INT,
                    IN p_mes INT,
                    IN p_idGerente INT
                )
                BEGIN
                    SELECT 
                        p.idProducto,
                        p.nombre,
                        p.codigoProducto,
                        p.descripcion,
                        SUM(d.cantidad * p.precioCompra) AS TotalPago,
                        SUM(d.cantidad) AS UnitCompradas,
                        AVG(p.precioCompra) AS PrecioPromedioCompra,
                        COUNT(DISTINCT c.idCompra) AS NroCompras,
                        MAX(c.fecha) AS UltimaCompra,
                        MIN(c.fecha) AS PrimeraCompra
                    FROM compra c 
                    INNER JOIN detalle_compra d ON d.idCompra = c.idCompra
                    INNER JOIN producto p ON p.idProducto = d.idProducto
                    WHERE YEAR(c.fecha) = p_anio 
                        AND MONTH(c.fecha) = p_mes 
                        AND c.idGerente = p_idGerente
                    GROUP BY p.idProducto, 
                             p.nombre, 
                             p.codigoProducto,
                             p.descripcion
                    ORDER BY TotalPago DESC, 
                             UnitCompradas DESC,
                             p.nombre ASC;
                END
            ");
            
            $this->command->info('Procedimiento 8 creado: sp_compras_por_producto_mensual');

            // 9. Procedimiento opcional (filtro por gerente opcional)
            DB::statement("
                CREATE PROCEDURE sp_compras_por_producto_mensual_optional(
                    IN p_anio INT,
                    IN p_mes INT,
                    IN p_idGerente INT
                )
                BEGIN
                    SELECT 
                        p.idProducto,
                        p.nombre,
                        p.codigoProducto,
                        p.descripcion,
                        SUM(d.cantidad * p.precioCompra) AS TotalPago,
                        SUM(d.cantidad) AS UnitCompradas,
                        AVG(p.precioCompra) AS PrecioPromedioCompra,
                        COUNT(DISTINCT c.idCompra) AS NroCompras,
                        MAX(c.fecha) AS UltimaCompra,
                        MIN(c.fecha) AS PrimeraCompra,
                        c.idGerente,
                        IFNULL(pe.nombres, 'N/A') AS NombreGerente
                    FROM compra c 
                    INNER JOIN detalle_compra d ON d.idCompra = c.idCompra
                    INNER JOIN producto p ON p.idProducto = d.idProducto
                    LEFT JOIN persona pe ON pe.idPersona = c.idGerente
                    WHERE YEAR(c.fecha) = p_anio 
                        AND MONTH(c.fecha) = p_mes 
                        AND (p_idGerente IS NULL OR c.idGerente = p_idGerente)
                    GROUP BY p.idProducto, 
                             p.nombre, 
                             p.codigoProducto,
                             p.descripcion,
                             c.idGerente
                    ORDER BY TotalPago DESC, 
                             UnitCompradas DESC;
                END
            ");
            
            $this->command->info('Procedimiento 9 creado: sp_compras_por_producto_mensual_optional');

        } catch (\Exception $e) {
            $this->command->error('Error al crear procedimientos: ' . $e->getMessage());
            throw $e;
        } finally {
            // Restaurar configuraciones
            DB::statement('SET SQL_MODE=@OLD_SQL_MODE');
            DB::statement('SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS');
        }
    }
}