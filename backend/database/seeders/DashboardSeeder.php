<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DashboardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        
DB::unprepared("DROP PROCEDURE IF EXISTS sp_contar_ventas_empleado");
DB::unprepared(<<<'SQL'
CREATE PROCEDURE sp_contar_ventas_empleado(
    IN p_idEmpleado INT,
    IN p_anio INT,
    IN p_mes INT
)
BEGIN
    SELECT count(*) AS NroVentas
    FROM venta v 
    WHERE v.idEmpleado = p_idEmpleado 
      AND YEAR(v.fecha) = p_anio 
      AND MONTH(v.fecha) = p_mes;
END
SQL);

DB::unprepared("DROP PROCEDURE IF EXISTS sp_total_vendido_empleado");
DB::unprepared(<<<'SQL'
CREATE PROCEDURE sp_total_vendido_empleado(
    IN p_idEmpleado INT,
    IN p_anio INT,
    IN p_mes INT
)
BEGIN
    SELECT sum(v.montoTotal) AS TotalVendido
    FROM venta v 
    WHERE v.idEmpleado = p_idEmpleado 
      AND YEAR(v.fecha) = p_anio 
      AND MONTH(v.fecha) = p_mes;
END
SQL);

DB::unprepared("DROP PROCEDURE IF EXISTS sp_contar_clientes_empleado");
DB::unprepared(<<<'SQL'
CREATE PROCEDURE sp_contar_clientes_empleado(
    IN p_idEmpleado INT,
    IN p_anio INT,
    IN p_mes INT
)
BEGIN
    SELECT count(c.idCliente) AS NroCliente
    FROM cliente c 
    WHERE c.idCliente IN (
        SELECT v.idCliente 
        FROM venta v 
        WHERE YEAR(v.fecha) = p_anio 
          AND MONTH(v.fecha) = p_mes 
          AND v.idEmpleado = p_idEmpleado
    );
END
SQL);

DB::unprepared("DROP PROCEDURE IF EXISTS sp_producto_mas_vendido_empleado");
DB::unprepared(<<<'SQL'
CREATE PROCEDURE sp_producto_mas_vendido_empleado(
    IN p_idEmpleado INT,
    IN p_anio INT,
    IN p_mes INT
)
BEGIN
    SELECT p.nombre 
    FROM producto p 
    WHERE p.idProducto = (
        SELECT max(pa.idProducto) 
        FROM producto pa 
        INNER JOIN detalle_venta d ON d.idProducto = pa.idProducto
        INNER JOIN venta v ON v.idVenta = d.idVenta 
        WHERE YEAR(v.fecha) = p_anio 
          AND MONTH(v.fecha) = p_mes 
          AND v.idEmpleado = p_idEmpleado
    );
END
SQL);

DB::unprepared("DROP PROCEDURE IF EXISTS sp_ventas_por_mes_empleado");
DB::unprepared(<<<'SQL'
CREATE PROCEDURE sp_ventas_por_mes_empleado(
    IN p_idEmpleado INT,
    IN p_anio INT
)
BEGIN
    SELECT year(v.fecha) AS anio, month(v.fecha) AS mes, sum(v.montoTotal) 
    FROM venta v 
    WHERE v.idEmpleado = p_idEmpleado 
      AND YEAR(v.fecha) = p_anio
    GROUP BY anio, mes;
END
SQL);

DB::unprepared("DROP PROCEDURE IF EXISTS sp_ventas_por_producto_empleado");
DB::unprepared(<<<'SQL'
CREATE PROCEDURE sp_ventas_por_producto_empleado(
    IN p_idEmpleado INT,
    IN p_anio INT,
    IN p_mes INT
)
BEGIN
    SELECT p.idProducto, p.nombre, sum(d.subTotal) AS totalVendido, sum(d.cantidad) AS CantidadVendida 
    FROM venta v 
    INNER JOIN detalle_venta d ON d.idVenta = v.idVenta
    INNER JOIN producto p ON p.idProducto = d.idProducto
    WHERE v.idEmpleado = p_idEmpleado 
      AND YEAR(v.fecha) = p_anio 
      AND MONTH(v.fecha) = p_mes
    GROUP BY p.idProducto, p.nombre
    ORDER BY totalVendido, CantidadVendida;
END
SQL);

DB::unprepared("DROP PROCEDURE IF EXISTS sp_ventas_totales_por_mes_2024");
DB::unprepared(<<<'SQL'
CREATE PROCEDURE sp_ventas_totales_por_mes_2024(
    IN p_anio INT
)
BEGIN
    SELECT year(v.fecha) AS anio, month(v.fecha) AS mes, sum(v.montoTotal) AS TotalVendido, sum(d.cantidad) AS CantidadVendida 
    FROM venta v 
    INNER JOIN detalle_venta d ON d.idVenta = v.idVenta
    WHERE YEAR(v.fecha) = p_anio
    GROUP BY anio, mes;
END
SQL);

DB::unprepared("DROP PROCEDURE IF EXISTS sp_ventas_totales_por_mes_2024");
DB::unprepared(<<<'SQL'
CREATE PROCEDURE sp_ventas_totales_por_mes_2024(
    IN p_anio INT
)
BEGIN
    SELECT year(v.fecha) AS anio, month(v.fecha) AS mes, sum(v.montoTotal) AS TotalVendido, sum(d.cantidad) AS CantidadVendida 
    FROM venta v 
    INNER JOIN detalle_venta d ON d.idVenta = v.idVenta
    WHERE YEAR(v.fecha) = p_anio
    GROUP BY anio, mes;
END
SQL);

DB::unprepared("DROP PROCEDURE IF EXISTS sp_ventas_totales_con_cantidades_2024");
DB::unprepared(<<<'SQL'
CREATE PROCEDURE sp_ventas_totales_con_cantidades_2024(
    IN p_anio INT
)
BEGIN
    SELECT year(v.fecha) AS anio, month(v.fecha) AS mes, sum(v.montoTotal) AS TotalVendido, sum(d.cantidad) AS CantidadVendida 
    FROM venta v 
    INNER JOIN detalle_venta d ON d.idVenta = v.idVenta
    WHERE YEAR(v.fecha) = p_anio
    GROUP BY anio, mes;
END
SQL);


//Gerente Procedimiento Gozus
// 1. Productos sin venta en un mes
        DB::unprepared("DROP PROCEDURE IF EXISTS sp_productos_sin_venta_mes");
        DB::unprepared(<<<'SQL'
CREATE PROCEDURE sp_productos_sin_venta_mes(
    IN p_anio INT,
    IN p_mes  INT
)
BEGIN
    SELECT 
        p.nombre AS NombreProducto,
        c.nombre AS Categoria,
        p.stock,
        p.stockMinimo
    FROM producto p
    INNER JOIN categoria c ON c.idCategoria = p.idCategoria
    WHERE p.idProducto NOT IN (
        SELECT DISTINCT d.idProducto
        FROM detalle_venta d
        INNER JOIN venta v ON v.idVenta = d.idVenta 
        WHERE YEAR(v.fecha) = p_anio
          AND MONTH(v.fecha) = p_mes
    )
    ORDER BY 
        c.nombre,
        p.stock * 1.0 / NULLIF(p.stockMinimo, 0) DESC
    LIMIT 10;
END
SQL);

        // 2. Estadísticas básicas - Número de compras del gerente
        DB::unprepared("DROP PROCEDURE IF EXISTS sp_nro_compras_gerente_mes");
        DB::unprepared(<<<'SQL'
CREATE PROCEDURE sp_nro_compras_gerente_mes(
    IN p_anio INT,
    IN p_mes INT,
    IN p_idGerente INT
)
BEGIN
    SELECT count(*) AS NroCompras 
    FROM compra c 
    WHERE c.idGerente = p_idGerente 

      AND YEAR(c.fecha) = p_anio 
      AND MONTH(c.fecha) = p_mes;
END
SQL);

        // 3. Productos sin stock
        DB::unprepared("DROP PROCEDURE IF EXISTS sp_productos_sin_stock");
        DB::unprepared(<<<'SQL'
CREATE PROCEDURE sp_productos_sin_stock()
BEGIN
    SELECT count(*) AS NroProductosSinStock 
    FROM producto p 
    WHERE p.stock = 0;
END
SQL);

        // 4. Número de proveedores
        DB::unprepared("DROP PROCEDURE IF EXISTS sp_nro_proveedores");
        DB::unprepared(<<<'SQL'
CREATE PROCEDURE sp_nro_proveedores()
BEGIN
    SELECT count(*) AS NroProveedores 
    FROM empresa_proveedora;
END
SQL);

        // 5. Número de ventas por mes
        DB::unprepared("DROP PROCEDURE IF EXISTS sp_nro_ventas_mes");
        DB::unprepared(<<<'SQL'
CREATE PROCEDURE sp_nro_ventas_mes(
    IN p_anio INT,
    IN p_mes INT
)
BEGIN
    SELECT count(*) AS NroVentas 
    FROM venta v 
    WHERE YEAR(v.fecha) = p_anio 
      AND MONTH(v.fecha) = p_mes;
END
SQL);

        // 6. Total de ventas por mes
        DB::unprepared("DROP PROCEDURE IF EXISTS sp_total_ventas_mes");
        DB::unprepared(<<<'SQL'
CREATE PROCEDURE sp_total_ventas_mes(
    IN p_anio INT,
    IN p_mes INT
)
BEGIN
    SELECT sum(v.montoTotal) AS TotalVentas 
    FROM venta v
    WHERE YEAR(v.fecha) = p_anio 
      AND MONTH(v.fecha) = p_mes;
END
SQL);

        // 7. Top 10 productos más vendidos (con datos del gerente)
        DB::unprepared("DROP PROCEDURE IF EXISTS sp_top_productos_gerente_mes");
        DB::unprepared(<<<'SQL'
CREATE PROCEDURE sp_top_productos_gerente_mes(
    IN p_anio INT,
    IN p_mes INT,
    IN p_idGerente INT
)
BEGIN
    SELECT 
        p.idProducto,
        p.nombre,
        sum(d.subTotal) AS Total,
        (sum(d.subTotal)/(SELECT sum(montototal) 
                          FROM venta 
                          WHERE YEAR(fecha) = p_anio 
                            AND MONTH(fecha) = p_mes)) * 100 AS ProporcionVentas,
        count(*) AS NroVentas
    FROM venta v 
    INNER JOIN detalle_venta d ON d.idVenta = v.idVenta 
    INNER JOIN producto p ON p.idProducto = d.idProducto
    WHERE p.idProducto IN (
        SELECT DISTINCT p2.idProducto 
        FROM compra c 
        INNER JOIN detalle_compra d2 ON d2.idCompra = c.idCompra
        INNER JOIN producto p2 ON p2.idProducto = d2.idProducto 
        WHERE c.idGerente = p_idGerente 
          AND YEAR(c.fecha) = p_anio 
          AND MONTH(c.fecha) = p_mes
    )
    AND YEAR(v.fecha) = p_anio 
    AND MONTH(v.fecha) = p_mes
    GROUP BY p.idProducto, p.nombre
    ORDER BY total DESC, proporcionventas DESC, NroVentas DESC 
    LIMIT 10;
END
SQL);

        // 8. Ventas por día de la semana
        DB::unprepared("DROP PROCEDURE IF EXISTS sp_ventas_por_dia_semana");
        DB::unprepared(<<<'SQL'
CREATE PROCEDURE sp_ventas_por_dia_semana(
    IN p_anio INT,
    IN p_mes INT
)
BEGIN
    SELECT 
        DAYNAME(v.fecha) AS DiaSemana,
        count(*) AS NroVentas 
    FROM venta v
    WHERE YEAR(v.fecha) = p_anio 
      AND MONTH(v.fecha) = p_mes
    GROUP BY DAYNAME(v.fecha)
    ORDER BY NroVentas DESC;
END
SQL);

        // 9. Ventas por hora del día
        DB::unprepared("DROP PROCEDURE IF EXISTS sp_ventas_por_hora");
        DB::unprepared(<<<'SQL'
CREATE PROCEDURE sp_ventas_por_hora(
    IN p_anio INT,
    IN p_mes INT
)
BEGIN
    SELECT 
        HOUR(v.fecha) AS Hora,
        count(*) AS NroVentas 
    FROM venta v
    WHERE YEAR(v.fecha) = p_anio 
      AND MONTH(v.fecha) = p_mes
    GROUP BY HOUR(v.fecha)
    ORDER BY HOUR(v.fecha);
END
SQL);

        // 10. Ventas mensuales por año
        DB::unprepared("DROP PROCEDURE IF EXISTS sp_ventas_mensuales_anio");
        DB::unprepared(<<<'SQL'
CREATE PROCEDURE sp_ventas_mensuales_anio(
    IN p_anio INT
)
BEGIN
    SELECT 
        YEAR(c.fecha) AS Anio,
        MONTH(c.fecha) AS Mes,
        SUM(c.montoTotal) AS Total  
    FROM venta c
    WHERE YEAR(c.fecha) = p_anio
    GROUP BY YEAR(c.fecha), MONTH(c.fecha)
    ORDER BY Mes;
END
SQL);

        // 11. Top 10 productos más vendidos por mes
        DB::unprepared("DROP PROCEDURE IF EXISTS sp_top_productos_vendidos_mes");
        DB::unprepared(<<<'SQL'
CREATE PROCEDURE sp_top_productos_vendidos_mes(
    IN p_anio INT,
    IN p_mes INT
)
BEGIN
    SELECT 
        p.idProducto,
        p.nombre,
        SUM(d.subTotal) AS Total,
        SUM(d.cantidad) AS CantidadVendida 
    FROM producto p 
    INNER JOIN detalle_venta d ON d.idProducto = p.idProducto
    INNER JOIN venta v ON v.idVenta = d.idVenta
    WHERE YEAR(v.fecha) = p_anio 
      AND MONTH(v.fecha) = p_mes
    GROUP BY p.idProducto, p.nombre
    ORDER BY Total DESC, CantidadVendida DESC
    LIMIT 10;
END
SQL);

        // 12. Top 10 categorías más vendidas por mes
        DB::unprepared("DROP PROCEDURE IF EXISTS sp_top_categorias_vendidas_mes");
        DB::unprepared(<<<'SQL'
CREATE PROCEDURE sp_top_categorias_vendidas_mes(
    IN p_anio INT,
    IN p_mes INT
)
BEGIN
    SELECT 
        c.idCategoria,
        c.nombre,
        SUM(d.subTotal) AS Total,
        SUM(d.cantidad) AS CantidadVendida 
    FROM categoria c 
    INNER JOIN producto p ON p.idCategoria = c.idCategoria
    INNER JOIN detalle_venta d ON d.idProducto = p.idProducto
    INNER JOIN venta v ON v.idVenta = d.idVenta
    WHERE YEAR(v.fecha) = p_anio 
      AND MONTH(v.fecha) = p_mes
    GROUP BY c.idCategoria, c.nombre
    ORDER BY Total DESC, CantidadVendida DESC 
    LIMIT 10;
END
SQL);

        // 13. Top 10 productos más comprados
        DB::unprepared("DROP PROCEDURE IF EXISTS sp_top_productos_comprados");
        DB::unprepared(<<<'SQL'
CREATE PROCEDURE sp_top_productos_comprados()
BEGIN
    SELECT 
        p.idProducto,
        p.nombre,
        SUM(d.subTotal) AS Total,
        SUM(d.cantidad) AS CantidadComprada 
    FROM compra c 
    INNER JOIN detalle_compra d ON d.idCompra = c.idCompra
    INNER JOIN producto p ON p.idProducto = d.idProducto
    GROUP BY p.idProducto, p.nombre
    ORDER BY Total DESC, CantidadComprada DESC 
    LIMIT 10;
END
SQL);

        // 14. Top 10 categorías más compradas
        DB::unprepared("DROP PROCEDURE IF EXISTS sp_top_categorias_compradas");
        DB::unprepared(<<<'SQL'
CREATE PROCEDURE sp_top_categorias_compradas()
BEGIN
    SELECT 
        ca.idCategoria,
        ca.nombre,
        SUM(d.subTotal) AS Total,
        SUM(d.cantidad) AS CantidadComprada 
    FROM compra c 
    INNER JOIN detalle_compra d ON d.idCompra = c.idCompra
    INNER JOIN producto p ON p.idProducto = d.idProducto
    INNER JOIN categoria ca ON ca.idCategoria = p.idCategoria
    GROUP BY ca.idCategoria, ca.nombre
    ORDER BY Total DESC, CantidadComprada DESC 
    LIMIT 10;
END
SQL);

        // 15. Compras mensuales por año
        DB::unprepared("DROP PROCEDURE IF EXISTS sp_compras_mensuales_anio");
        DB::unprepared(<<<'SQL'
CREATE PROCEDURE sp_compras_mensuales_anio(
    IN p_anio INT
)
BEGIN
    SELECT 
        YEAR(c.fecha) AS Anio,
        MONTH(c.fecha) AS Mes,
        SUM(c.totalPago) AS Total  
    FROM compra c
    WHERE YEAR(c.fecha) = p_anio
    GROUP BY YEAR(c.fecha), MONTH(c.fecha)
    ORDER BY Mes;
END
SQL);

        // 16. Productos con stock mínimo o menor
        DB::unprepared("DROP PROCEDURE IF EXISTS sp_productos_stock_minimo");
        DB::unprepared(<<<'SQL'
CREATE PROCEDURE sp_productos_stock_minimo()
BEGIN
    SELECT 
        p.idProducto,
        p.nombre,
        p.stock,
        p.stockMinimo
    FROM producto p
    WHERE p.stock <= p.stockMinimo
    ORDER BY p.stock ASC;
END
SQL);

        // 17. Productos sin stock (detallado)
        DB::unprepared("DROP PROCEDURE IF EXISTS sp_productos_sin_stock_detalle");
        DB::unprepared(<<<'SQL'
CREATE PROCEDURE sp_productos_sin_stock_detalle()
BEGIN
    SELECT 
        p.idProducto,
        p.nombre,
        p.stock,
        p.stockMinimo
    FROM producto p
    WHERE p.stock = 0
    ORDER BY p.nombre;
END
SQL);

 DB::unprepared("DROP PROCEDURE IF EXISTS sp_ventas_por_categoria");

        DB::unprepared(<<<'SQL'
CREATE PROCEDURE sp_ventas_por_categoria(
    IN p_anio INT,
    IN p_mes  INT
)
BEGIN
    SELECT 
        c.nombre AS Categoria,
        SUM(d.subTotal) AS TotalVendido,
        COUNT(*) AS NroVendidos,
        SUM( (p.precioVenta - p.precioCompra) * d.cantidad ) AS Ganancia, 
        COUNT(*) * 1.0 /
        NULLIF(
            (
                SELECT COUNT(*) * 1.0
                FROM detalle_venta dv
                INNER JOIN venta vv ON vv.idVenta = dv.idVenta
                WHERE YEAR(vv.fecha) = p_anio
                  AND MONTH(vv.fecha) = p_mes
            ),
            0
        ) AS ProporcionNroVenta
    FROM detalle_venta d 
    INNER JOIN producto p  ON p.idProducto  = d.idProducto
    INNER JOIN categoria c ON c.idCategoria = p.idCategoria
    INNER JOIN venta v     ON v.idVenta     = d.idVenta
    WHERE YEAR(v.fecha) = p_anio
      AND MONTH(v.fecha) = p_mes
    GROUP BY c.nombre
    ORDER BY TotalVendido DESC;
END
SQL);

        DB::unprepared("DROP PROCEDURE IF EXISTS sp_productos_sin_venta_mes");

        DB::unprepared(<<<'SQL'
CREATE PROCEDURE sp_productos_sin_venta_mes(
    IN p_anio INT,
    IN p_mes  INT
)
BEGIN
    SELECT 
        p.nombre AS NombreProducto,
        c.nombre AS Categoria,
        p.stock,
        p.stockMinimo
    FROM producto p
    INNER JOIN categoria c ON c.idCategoria = p.idCategoria
    WHERE p.idProducto NOT IN (
        SELECT DISTINCT d.idProducto
        FROM detalle_venta d
        INNER JOIN venta v ON v.idVenta = d.idVenta 
        WHERE YEAR(v.fecha) = p_anio
          AND MONTH(v.fecha) = p_mes
    )
    ORDER BY 
        c.nombre,
        p.stock * 1.0 / NULLIF(p.stockMinimo, 0) DESC
    LIMIT 10;
END
SQL);


        DB::unprepared("DROP PROCEDURE IF EXISTS sp_movimientos_inventario_mes");

        DB::unprepared(<<<'SQL'
CREATE PROCEDURE sp_movimientos_inventario_mes(
    IN p_anio INT,
    IN p_mes  INT
)
BEGIN
    SELECT 
        p.nombre,
        m.tipo,
        SUM(m.cantidad) AS TotalMov
    FROM movimiento_inventario m
    INNER JOIN producto p ON p.idProducto = m.idProducto
    WHERE YEAR(m.fechaMovimiento) = p_anio
      AND MONTH(m.fechaMovimiento) = p_mes
    GROUP BY p.nombre, m.tipo
    ORDER BY m.tipo, TotalMov DESC;
END
SQL);

        

        DB::unprepared("DROP PROCEDURE IF EXISTS sp_compras_por_producto");

        DB::unprepared(<<<'SQL'
CREATE PROCEDURE sp_compras_por_producto(
    IN p_anio INT,
    IN p_mes  INT
)
BEGIN
    SELECT 
        p.nombre,
        SUM(d.subTotal) AS TotalGastado,
        SUM(d.cantidad) AS CantidadComprada,
        SUM(d.cantidad) * 1.0 /
        NULLIF(
            (
                SELECT SUM(ds.cantidad) * 1.0
                FROM detalle_compra ds
                INNER JOIN compra cs ON cs.idCompra = ds.idCompra  
                WHERE YEAR(cs.fecha) = p_anio 
                  AND MONTH(cs.fecha) = p_mes
            ),
            0
        ) AS ProporcionComprada
    FROM compra c 
    INNER JOIN detalle_compra d ON d.idCompra = c.idCompra
    INNER JOIN producto p ON p.idProducto = d.idProducto
    WHERE YEAR(c.fecha) = p_anio 
      AND MONTH(c.fecha) = p_mes
    GROUP BY p.nombre
    ORDER BY TotalGastado DESC;
END
SQL);
DB::unprepared('DROP PROCEDURE IF EXISTS sp_gasto_total_mes');

        DB::unprepared(<<<'SQL'
CREATE PROCEDURE sp_gasto_total_mes(
    IN p_anio INT,
    IN p_mes  INT
)
BEGIN
    SELECT 
        IFNULL(SUM(c.totalPago), 0) AS GastoTotal
    FROM compra c 
    WHERE YEAR(c.fecha) = p_anio 
      AND MONTH(c.fecha) = p_mes;
END
SQL);

        DB::unprepared('DROP PROCEDURE IF EXISTS sp_total_ventas_mes');

        DB::unprepared(<<<'SQL'
CREATE PROCEDURE sp_total_ventas_mes(
    IN p_anio INT,
    IN p_mes  INT
)
BEGIN
    SELECT 
        IFNULL(SUM(v.montoTotal), 0) AS TotalVentas
    FROM venta v 
    WHERE YEAR(v.fecha) = p_anio 
      AND MONTH(v.fecha) = p_mes;
END
SQL);

        DB::unprepared('DROP PROCEDURE IF EXISTS sp_nro_ventas_mes');

        DB::unprepared(<<<'SQL'
CREATE PROCEDURE sp_nro_ventas_mes(
    IN p_anio INT,
    IN p_mes  INT
)
BEGIN
    SELECT 
        COUNT(*) AS NroVentas
    FROM venta v
    WHERE YEAR(v.fecha) = p_anio
      AND MONTH(v.fecha) = p_mes;
END
SQL);
DB::unprepared('DROP PROCEDURE IF EXISTS sp_nro_empresas_proveedoras');

        DB::unprepared(<<<'SQL'
CREATE PROCEDURE sp_nro_empresas_proveedoras()
BEGIN
    SELECT 
        COUNT(*) AS NroEmpresasProvedoras
    FROM empresa_proveedora;
END
SQL);

        DB::unprepared('DROP PROCEDURE IF EXISTS sp_cantidad_productos_activos');

        DB::unprepared(<<<'SQL'
CREATE PROCEDURE sp_cantidad_productos_activos()
BEGIN
    SELECT 
        COUNT(*) AS CantidadProductosActivos
    FROM producto p 
    WHERE p.estado = 'activo';
END
SQL);

        DB::unprepared('DROP PROCEDURE IF EXISTS sp_cantidad_productos_inactivos');

        DB::unprepared(<<<'SQL'
CREATE PROCEDURE sp_cantidad_productos_inactivos()
BEGIN
    SELECT 
        COUNT(*) AS CantidadProductosInactivos
    FROM producto p 
    WHERE p.estado = 'inactivo';
END
SQL);



    }
}
