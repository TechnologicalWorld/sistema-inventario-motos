// src/services/empleadoDashboardService.ts
import api from "../../../services/api";

// ==================== INTERFACES ====================

// Interface principal del dashboard del empleado
export interface EmpleadoDashboardData {
  ventas: number;
  total_vendido: number;
  clientes: number;
  producto_mas_vendido: {
    idProducto?: number;
    nombre?: string;
    total_vendido?: number;
    cantidad_vendida?: number;
    [key: string]: any;
  } | null;
  ventas_por_mes: Array<{
    mes?: number;
    anio?: number;
    total_ventas?: number;
    monto_total?: number;
    [key: string]: any;
  }>;
  ventas_por_producto: Array<{
    idProducto?: number;
    nombre?: string;
    cantidad_vendida?: number;
    total_vendido?: number;
    [key: string]: any;
  }>;
  ventas_2024: Array<{
    mes?: number;
    total_ventas?: number;
    monto_total?: number;
    [key: string]: any;
  }>;
  ventas_2024_con_cantidades: Array<{
    mes?: number;
    total_ventas?: number;
    monto_total?: number;
    cantidad_total?: number;
    [key: string]: any;
  }>;
}

// Interface para la respuesta de la API
export interface EmpleadoDashboardApiResponse {
  success: boolean;
  message?: string;
  data: EmpleadoDashboardData;
}

// ==================== CLASE EMPLEADO DASHBOARD SERVICE ====================

class EmpleadoDashboardService {
  async getDashboard(): Promise<EmpleadoDashboardData> {
    const { data } = await api.get<EmpleadoDashboardApiResponse>("empleado/dashboard");

    if (!data.success) {
      throw new Error("Error al cargar el dashboard");
    }

    return data.data;  
  }
}

const empleadoDashboardService = new EmpleadoDashboardService();
export default empleadoDashboardService;