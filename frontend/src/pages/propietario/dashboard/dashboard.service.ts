import api from "../../../services/api";

export interface VentaPorCategoria {
  Categoria: string;
  TotalVendido: string;
  NroVendidos: number;
  Ganancia: string;
  ProporcionNroVenta: string;
}

export interface ProductoSinVenta {
  NombreProducto: string;
  Categoria: string;
  stock: number;
  stockMinimo: number;
}

export interface MovimientoInventario {
  nombre: string;
  tipo: string;
  TotalMov: string;
}

export interface CompraPorProducto {
  nombre: string;
  TotalGastado: string;
  CantidadComprada: string;
  ProporcionComprada: string;
}

export interface GastoTotalMes {
  GastoTotal: string;
}

export interface TotalVentasMes {
  TotalVentas: string;
}

export interface NroVentasMes {
  NroVentas: number;
}

export interface NroEmpresasProveedoras {
  NroEmpresasProvedoras: number;
}

export interface CantidadProductosActivos {
  CantidadProductosActivos: number;
}

export interface CantidadProductosInactivos {
  CantidadProductosInactivos: number;
}

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

export interface PropietarioDashboardApiResponse {
  success: boolean;
  message?: string;
  data: PropietarioDashboardData;
}

export interface PropietarioDashboardParams {
  anio?: number;
  mes?: number;
}

class DashboardPropietarioService {
  async getDashboard(params?: PropietarioDashboardParams): Promise<PropietarioDashboardData> {
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