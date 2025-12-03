// src/services/dashboardService.ts
import api from "../../../services/api";

// ==================== INTERFACES ====================

// 1. Productos sin venta en un mes
export interface ProductoSinVenta {
  NombreProducto: string;
  Categoria: string;
  stock: number;
  stockMinimo: number;
}

// 2. Número de compras del gerente por mes
export interface NroComprasGerente {
  NroCompras: number;
}

// 3. Productos sin stock (contador)
export interface ProductosSinStockCount {
  NroProductosSinStock: number;
}

// 4. Número de proveedores
export interface NroProveedores {
  NroProveedores: number;
}

// 5. Número de ventas por mes
export interface NroVentasMes {
  NroVentas: number;
}

// 6. Total de ventas por mes
export interface TotalVentasMes {
  TotalVentas: number;
}

// 7. Top 10 productos más vendidos (con datos del gerente)
export interface TopProductoGerente {
  idProducto: number;
  nombre: string;
  Total: number;
  ProporcionVentas: number;
  NroVentas: number;
}

// 8. Ventas por día de la semana
export interface VentasPorDiaSemana {
  DiaSemana: string;
  NroVentas: number;
}

// 9. Ventas por hora del día
export interface VentasPorHora {
  Hora: number;
  NroVentas: number;
}

// 10. Ventas mensuales por año
export interface VentasMensualesAnio {
  Anio: number;
  Mes: number;
  Total: number;
}

// 11. Top 10 productos más vendidos por mes
export interface TopProductoVendidoMes {
  idProducto: number;
  nombre: string;
  Total: number;
  CantidadVendida: number;
}

// 12. Top 10 categorías más vendidas por mes
export interface TopCategoriaVendidaMes {
  idCategoria: number;
  nombre: string;
  Total: number;
  CantidadVendida: number;
}

// 13. Top 10 productos más comprados
export interface TopProductoComprado {
  idProducto: number;
  nombre: string;
  Total: number;
  CantidadComprada: number;
}

// 14. Top 10 categorías más compradas
export interface TopCategoriaComprada {
  idCategoria: number;
  nombre: string;
  Total: number;
  CantidadComprada: number;
}

// 15. Compras mensuales por año
export interface ComprasMensualesAnio {
  Anio: number;
  Mes: number;
  Total: number;
}

// 16. Productos con stock mínimo o menor
export interface ProductoStockMinimo {
  idProducto: number;
  nombre: string;
  stock: number;
  stockMinimo: number;
}

// 17. Productos sin stock (detallado)
export interface ProductoSinStockDetalle {
  idProducto: number;
  nombre: string;
  stock: number;
  stockMinimo: number;
}

// Interface principal del dashboard
export interface DashboardData {
  productosSinVenta: ProductoSinVenta[];
  nroComprasGerente: NroComprasGerente[];
  productosSinStock: ProductosSinStockCount[];
  nroProveedores: NroProveedores[];
  nroVentasMes: NroVentasMes[];
  totalVentasMes: TotalVentasMes[];
  topProductosGerente: TopProductoGerente[];
  ventasPorDiaSemana: VentasPorDiaSemana[];
  ventasPorHora: VentasPorHora[];
  ventasMensualesAnio: VentasMensualesAnio[];
  topProductosVendidosMes: TopProductoVendidoMes[];
  topCategoriasVendidasMes: TopCategoriaVendidaMes[];
  topProductosComprados: TopProductoComprado[];
  topCategoriasCompradas: TopCategoriaComprada[];
  comprasMensualesAnio: ComprasMensualesAnio[];
  productosStockMinimo: ProductoStockMinimo[];
  productosSinStockDetalle: ProductoSinStockDetalle[];
}

// Interface para la respuesta de la API
export interface DashboardApiResponse {
  success: boolean;
  message?: string;
  data: DashboardData;
}
export interface DashboardParams {
  iduser: number;
  anio?: number;
  mes?: number;
}
class DashboardService {
  /**
   * Obtiene todos los datos del dashboard del gerente
   */
  async getDashboard(params: DashboardParams): Promise<DashboardData> {
    // Agregar valores por defecto para año y mes si no se proporcionan
    const queryParams = {
      iduser: params.iduser,
      anio: params.anio || new Date().getFullYear(),
      mes: params.mes || new Date().getMonth() + 1
    };
    
    const { data } = await api.get<DashboardApiResponse>("gerente/dashboard", {
      params: queryParams
    });

    if (!data.success) {
      throw new Error("Error al cargar el dashboard");
    }

    return data.data;  
  }
}

const dashboardService = new DashboardService();
export default dashboardService;