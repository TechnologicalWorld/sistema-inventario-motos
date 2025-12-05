import api from "../../../services/api"; 

// 1. Para sp_ganancias_producto_mensual
export interface GananciasProducto {
  idProducto: number;
  nombre: string;
  codigoProducto: string;
  Ganancia: number;
  VentasTotales: number;
}

// 2. Para sp_resumen_ganancias_mensual
export interface ResumenGanancias {
  GananciaTotal: number;
  VentasTotales: number;
}

// 3. Para sp_productos_stock
export interface ProductoStock {
  nombre: string;
  codigoProducto: string;
  descripcion: string;
  stock: number;
  stockMinimo: number;
  estado_stock: string; // 'CRÍTICO' | 'BAJO' | 'NORMAL'
}

// 4. Para sp_conteo_stock_critico
export interface ConteoStock {
  NroProd: number;
}

// 5. Para sp_costos_compra_mensual
export interface CostoCompra {
  idProducto: number;
  nombre: string;
  codigoProducto: string;
  descripcion: string;
  CostoTotal: number;
  CantidadComprada: number;
}

// 6. Para sp_resumen_compras_mensual
export interface ResumenCompras {
  TotalGasto: number;
  NroCompras: number;
  NroProductosComprados: number;
}

// Interface para parámetros de fecha
export interface FechaParams {
  anio: number;
  mes: number;
}

class ReportesService {
    static async obtenerReportes(anio: number, mes: number) {
        const response = await api.get("/propietario/reportes",
             {
      params: { anio, mes }}
        );
        return response.data;
    }
}

export default ReportesService;