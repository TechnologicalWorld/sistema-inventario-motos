// src/services/empleadoDashboardService.ts
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
export interface DashboardParams {
  iduser: number;
  anio?: number;
  mes?: number;
}

// ==================== CLASE EMPLEADO DASHBOARD SERVICE ====================

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

// Interface para los parámetros de consulta
export interface DashboardParams {
  iduser: number;
  anio?: number;
  mes?: number;
}

// ==================== CLASE EMPLEADO DASHBOARD SERVICE ====================

class EmpleadoDashboardService {
  /**
   * Obtiene los datos del dashboard del empleado
   * @param params - Parámetros de consulta (iduser, anio, mes)
   */
  async getDashboard(params: DashboardParams): Promise<EmpleadoDashboardData> {
    // Agregar valores por defecto para año y mes si no se proporcionan
    const queryParams = {
      iduser: params.iduser,
      anio: params.anio || new Date().getFullYear(),
      mes: params.mes || new Date().getMonth() + 1
    };
    
    const { data } = await api.get<EmpleadoDashboardApiResponse>("empleado/dashboard", {
      params: queryParams
    });

    if (!data.success) {
      throw new Error(data.message || "Error al cargar el dashboard");
    }

    return data.data;  
  }
}

const empleadoDashboardService = new EmpleadoDashboardService();
export default empleadoDashboardService;