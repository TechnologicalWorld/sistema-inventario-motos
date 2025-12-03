// src/services/dashboardPropietarioService.ts
import api from "../../../services/api";

// ==================== INTERFACES ====================

// 1. Ventas por categoría
export interface VentaPorCategoria {
  Categoria: string;
  TotalVendido: string;
  NroVendidos: number;
  Ganancia: string;
  ProporcionNroVenta: string;
}

// 2. Productos sin venta
export interface ProductoSinVenta {
  NombreProducto: string;
  Categoria: string;
  stock: number;
  stockMinimo: number;
}

// 3. Movimientos de inventario
export interface MovimientoInventario {
  nombre: string;
  tipo: string;
  TotalMov: string;
}

// 4. Compras por producto
export interface CompraPorProducto {
  nombre: string;
  TotalGastado: string;
  CantidadComprada: string;
  ProporcionComprada: string;
}

// 5. Gasto total mes
export interface GastoTotalMes {
  GastoTotal: string;
}

// 6. Total ventas mes
export interface TotalVentasMes {
  TotalVentas: string;
}

// 7. Número de ventas mes
export interface NroVentasMes {
  NroVentas: number;
}

// 8. Número de empresas proveedoras
export interface NroEmpresasProveedoras {
  NroEmpresasProvedoras: number;
}

// 9. Cantidad productos activos
export interface CantidadProductosActivos {
  CantidadProductosActivos: number;
}

// 10. Cantidad productos inactivos
export interface CantidadProductosInactivos {
  CantidadProductosInactivos: number;
}

// Interface principal del dashboard del propietario
export interface PropietarioDashboardData {
  ventas_por_categoria: VentaPorCategoria[];
  productos_sin_venta: ProductoSinVenta[];
  movimientos_inventario: MovimientoInventario[];
  compras_por_producto: CompraPorProducto[];
  gasto_total_mes: GastoTotalMes[];
  total_ventas_mes: TotalVentasMes[];
  nro_ventas_mes: NroVentasMes[];
  nro_empresas_provedoras: NroEmpresasProveedoras[];
  cantidad_productos_activos: CantidadProductosActivos[];
  cantidad_productos_inactivos: CantidadProductosInactivos[];
}

// Interface para la respuesta de la API
export interface PropietarioDashboardApiResponse {
  success: boolean;
  message?: string;
  data: PropietarioDashboardData;
}

// Parámetros opcionales para el dashboard
export interface PropietarioDashboardParams {
  anio?: number;
  mes?: number;
}

// ==================== CLASE DASHBOARD SERVICE ====================

// src/services/dashboardPropietarioService.ts
class DashboardPropietarioService {
  /**
   * Obtiene todos los datos del dashboard del propietario
   */
  async getDashboard(params?: PropietarioDashboardParams): Promise<PropietarioDashboardData> {
    // Si no se pasan parámetros, usa el mes y año actual
    const defaultParams = {
      anio: new Date().getFullYear(),
      mes: new Date().getMonth() + 1
    };
    
    const queryParams = params || defaultParams;
    
    const { data } = await api.get<PropietarioDashboardApiResponse>("propietario/dashboard", {
      params: queryParams
    });

    if (!data.success) {
      throw new Error(data.message || "Error al cargar el dashboard del propietario");
    }

    return data.data;  
  }
}
const dashboardPropietarioService = new DashboardPropietarioService();
export default dashboardPropietarioService;