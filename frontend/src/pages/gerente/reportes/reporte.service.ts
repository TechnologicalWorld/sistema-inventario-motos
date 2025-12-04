import api from "../../../services/api";

// Interfaces para los reportes
export interface VentaPorEmpleado {
  idPersona: number;
  NombreCompleto: string;
  TotalVendido: number;
  NroVentas: number;
  PromedioVenta: number;
  PrimeraVenta: string;
  UltimaVenta: string;
}

export interface CompraPorProducto {
  idProducto: number;
  nombre: string;
  codigoProducto: string;
  descripcion: string;
  TotalPago: number;
  UnitCompradas: number;
  PrecioPromedioCompra: number;
  NroCompras: number;
  UltimaCompra: string;
  PrimeraCompra: string;
  idGerente: number | null;
  NombreGerente: string;
}

export interface ProductoStock {
  idProducto: number;
  codigoProducto: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  stock_minimo: number;
  estado_stock: string;
}

export interface StockCritico {
  total_productos_criticos: number;
}

export interface GananciasProducto {
  idProducto: number;
  nombre: string;
  codigoProducto: string;
  total_ganancias: number;
  total_unidades_vendidas: number;
  ganancia_promedio_unidad: number;
}

// En tu archivo reporte.service.ts
export interface ResumenGanancias {
  GananciaTotal?: string;  // O number, dependiendo de cómo lo manejes
  VentasTotales?: string;
  total_ventas?: string | number;
  total_compras?: string | number;
  ganancia_neta?: string | number;
  porcentaje_ganancia?: string | number;
}
export interface RespuestaReportes {
  success: boolean;
  data: {
    ventas_empleados: VentaPorEmpleado[];
    compras_gerente: CompraPorProducto[];
    productos_stock: ProductoStock[];
    conteo_stock_critico: StockCritico[];
    ganancias_producto: GananciasProducto[];
    resumen_ganancias: ResumenGanancias[];
  };
  error?: string;
}

class ReportesService {
  static async obtenerReportes(
    anio: number, 
    mes: number, 
    idGerente?: number
  ): Promise<RespuestaReportes> {
    try {
      const response = await api.get("/gerente/reportes", {
        params: { 
          anio, 
          mes, 
          iduser: idGerente 
        }
      });
      
      // Normalizar los datos para que tengan nombres consistentes
      const data = response.data;
      
      if (data.success && data.data) {
        // Mapear campos del backend a los nombres esperados por el frontend
        data.data.ganancias_producto = data.data.ganancias_producto?.map((item: any) => ({
          ...item,
          total_ganancias: item.Ganancia,
          // Añadir otros mapeos si es necesario
        })) || [];
        
        data.data.resumen_ganancias = data.data.resumen_ganancias?.map((item: any) => ({
          ...item,
          total_ventas: item.VentasTotales,
          ganancia_neta: item.GananciaTotal,
          // Calcular otros campos si es necesario
        })) || [];
        
        data.data.conteo_stock_critico = data.data.conteo_stock_critico?.map((item: any) => ({
          ...item,
          total_productos_criticos: item.NroProd
        })) || [];
      }
      
      return data;
    } catch (error) {
      console.error("Error en ReportesService:", error);
      throw error;
    }
  }
}
export default ReportesService;