import api from "../../../services/api";

export interface ProductoSinVenta {
  NombreProducto: string;
  Categoria: string;
  stock: number;
  stockMinimo: number;
}

export interface NroComprasGerente {
  NroCompras: number;
}

export interface ProductosSinStockCount {
  NroProductosSinStock: number;
}

export interface NroProveedores {
  NroProveedores: number;
}

export interface NroVentasMes {
  NroVentas: number;
}

export interface TotalVentasMes {
  TotalVentas: number;
}

export interface TopProductoGerente {
  idProducto: number;
  nombre: string;
  Total: number;
  ProporcionVentas: number;
  NroVentas: number;
}

export interface VentasPorDiaSemana {
  DiaSemana: string;
  NroVentas: number;
}

export interface VentasPorHora {
  Hora: number;
  NroVentas: number;
}

export interface VentasMensualesAnio {
  Anio: number;
  Mes: number;
  Total: number;
}

export interface TopProductoVendidoMes {
  idProducto: number;
  nombre: string;
  Total: number;
  CantidadVendida: number;
}

export interface TopCategoriaVendidaMes {
  idCategoria: number;
  nombre: string;
  Total: number;
  CantidadVendida: number;
}

export interface TopProductoComprado {
  idProducto: number;
  nombre: string;
  Total: number;
  CantidadComprada: number;
}

export interface TopCategoriaComprada {
  idCategoria: number;
  nombre: string;
  Total: number;
  CantidadComprada: number;
}

export interface ComprasMensualesAnio {
  Anio: number;
  Mes: number;
  Total: number;
}

export interface ProductoStockMinimo {
  idProducto: number;
  nombre: string;
  stock: number;
  stockMinimo: number;
}

export interface ProductoSinStockDetalle {
  idProducto: number;
  nombre: string;
  stock: number;
  stockMinimo: number;
}

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
  async getDashboard(params: DashboardParams): Promise<DashboardData> {
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