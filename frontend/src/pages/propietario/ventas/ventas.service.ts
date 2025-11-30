import axios from "../../../services/api";

// ------------ Tipos ------------

export interface Persona {
  idPersona: number;
  ci: string;
  paterno: string;
  materno: string;
  nombres: string;
  telefono: string;
  fecha_naci?: string;
  genero?: string;
}

export interface Cliente {
  idCliente: number;
  nit: string;
  persona: Persona;
}

export interface Empleado {
  idEmpleado: number;
  email: string;
  direccion: string;
  persona: Persona;
}

export interface DetalleVenta {
  idDetalleVenta: number;
  cantidad: number;
  precioUnitario: string;
  subTotal: string;
  descripcion: string;
  idProducto: number;
  producto?: {
    idProducto: number;
    nombre: string;
    codigoProducto: string;
    descripcion?: string;
  };
}

export interface Venta {
  idVenta: number;
  fecha: string;
  montoTotal: string;
  metodoPago: string;
  descripcion: string;
  idCliente: number;
  idEmpleado: number;
  cliente: Cliente;
  empleado: Empleado;
  detalle_ventas?: DetalleVenta[]; // opcional en index
}

// ------------ Respuesta paginada ------------

export interface VentasPaginatedResponse {
  data: Venta[];
  current_page: number;
  last_page: number;
  total: number;
}

// ------------ Filtros para index ------------

export interface VentasFilters {
  page?: number;
  empleadoId?: number | null;
  fechaInicio?: string | null; 
  fechaFin?: string | null;
}

// ------------ Service ------------

const ventasService = {
  async getVentas(filters: VentasFilters = {}): Promise<VentasPaginatedResponse> {
    const params: any = {};

    if (filters.page) params.page = filters.page;
    if (filters.empleadoId) params.empleado = filters.empleadoId;
    if (filters.fechaInicio) params.fecha_inicio = filters.fechaInicio;
    if (filters.fechaFin) params.fecha_fin = filters.fechaFin;

    const res = await axios.get("/propietario/ventas", { params });

    // <-- AQUÍ EL ARREGLO
    return {
      data: res.data.data.data,
      current_page: res.data.data.current_page,
      last_page: res.data.data.last_page,
      total: res.data.data.total
    };
  },

  async getVentaById(idVenta: number): Promise<Venta> {
    const res = await axios.get(`/propietario/ventas/${idVenta}`);
    console.log("RESPUESTA API:", res.data);
    return res.data.data as Venta;
  },
};

export default ventasService;
