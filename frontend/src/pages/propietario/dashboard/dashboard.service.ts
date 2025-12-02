import api from "../../../services/api";

// Dashboard: respuesta completa de la API
export interface DashboardApiResponse {
  success: boolean;
  data: DashboardData;
}

// Data interna del dashboard
export interface DashboardData {
  estadisticas: EstadisticasDashboard;
  ventas_compras: VentasComprasPorFecha;
  stock_minimo: ProductoStockMinimo[];
  top_productos: TopProducto[];
  clientes_frecuentes: ClienteFrecuente[];
}

// ====== ESTADÍSTICAS ======
export interface EstadisticasDashboard {
  ventas_hoy: number;
  ventas_mes: number;
  compras_mes: number;
  clientes_totales: number;
  productos_stock_bajo: number;
}

// ====== VENTAS vs COMPRAS (por fecha) ======
export interface VentasComprasItem {
  ventas: number;
  compras: number;
}

// Ejemplo de clave: "2025-11-27"
export type VentasComprasPorFecha = Record<string, VentasComprasItem>;

// ====== PRODUCTOS CON STOCK MÍNIMO ======
export interface CategoriaProducto {
  idCategoria: number;
  nombre: string;
  descripcion: string;
  created_at: string;
  updated_at: string;
}

export interface ProductoStockMinimo {
  idProducto: number;
  nombre: string;
  codigoProducto: string;
  descripcion: string;
  precioVenta: string;   // viene como string en el JSON
  precioCompra: string;  // también string
  stock: number;
  stockMinimo: number;
  estado: string;
  idCategoria: number;
  created_at: string;
  updated_at: string;
  categoria: CategoriaProducto;
}

// ====== TOP PRODUCTOS MÁS VENDIDOS ======
export interface TopProducto {
  nombre: string;
  total_vendido: string; // en el ejemplo viene como "16", "9", etc. (string)
}

// ====== CLIENTES FRECUENTES ======
export interface ClienteFrecuente {
  nombres: string;
  paterno: string;
  materno: string;
  total_compras: number;
  monto_total: string; // viene como string: "8271.45"
}

class DashboardService {
  async getDashboard(): Promise<DashboardData> {
    const { data } = await api.get<DashboardApiResponse>("propietario/dashboard");

    if (!data.success) {
      throw new Error("Error al cargar el dashboard");
    }

    return data.data;
  }
}

const dashboardService = new DashboardService();
export default dashboardService; 
