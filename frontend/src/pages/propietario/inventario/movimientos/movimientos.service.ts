import api from "../../../../services/api";
import type { Producto } from "../productos/productos.service";

export interface Persona {
  idPersona: number;
  ci: string;
  paterno: string;
  materno: string;
  nombres: string;
  fecha_naci: string;
  genero: string;
  telefono: string;
}

export interface Empleado {
  idEmpleado: number;
  fecha_contratacion: string;
  email: string;
  direccion: string;
  persona: Persona;
}

export interface Movimiento {
  idMovimiento: number;
  tipo: "entrada" | "salida";
  cantidad: number;
  observacion: string;
  fechaMovimiento: string;
  idEmpleado: number;
  idProducto: number;
  empleado: Empleado;
  producto: Producto;
}

export interface PaginationResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: any[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

class MovimientosService {
  private baseUrl = "/propietario/inventario/movimientos";

  async getMovimientos(params?: {
    page?: number;
    tipo?: "entrada" | "salida" | "";
    fecha_inicio?: string;
    fecha_fin?: string;
  }): Promise<PaginationResponse<Movimiento>> {
    const res = await api.get<PaginationResponse<Movimiento>>(
      this.baseUrl,
      {
        params: {
          page: params?.page,
          tipo: params?.tipo || undefined,
          fecha_inicio: params?.fecha_inicio || undefined,
          fecha_fin: params?.fecha_fin || undefined,
        },
      }
    );
    return res.data;
  }

  async createMovimiento(payload: {
    tipo: "entrada" | "salida";
    cantidad: number;
    observacion: string;
    idProducto: number;
    idEmpleado: number;
  }) {
    const res = await api.post(this.baseUrl, payload);
    return res.data;
  }
}

const movimientosService = new MovimientosService();
export default movimientosService;
