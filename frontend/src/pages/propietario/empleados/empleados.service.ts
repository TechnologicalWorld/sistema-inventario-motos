import api from "../../../services/api";

// ========= Tipos base =========

export interface Persona {
  idPersona: number;
  ci: string;
  paterno: string;
  materno: string;
  nombres: string;
  fecha_naci: string;
  genero: "M" | "F" | "O" | string;
  telefono: string;
}

export interface DepartamentoPivot {
  idEmpleado: number;
  idDepartamento: number;
  fecha: string;
  observacion: string | null;
}

export interface Departamento {
  idDepartamento: number;
  nombre: string;
  descripcion: string;
  pivot?: DepartamentoPivot;
}


export interface Venta {
  idVenta: number;
  fecha: string;
  montoTotal: string;
  metodoPago: string;
  descripcion: string;
  detalleVentas?: {
    idDetalleVenta: number;
    cantidad: number;
    precioUnitario: string;
    subTotal: string;
    descripcion: string;
  }[];
  detalle_ventas?: {
    idDetalleVenta: number;
    cantidad: number;
    precioUnitario: string;
    subTotal: string;
    descripcion: string;
  }[];
}

export interface Movimiento {
  idMovimiento: number;
  tipo: string;
  cantidad: number;
  observacion: string;
  fechaMovimiento: string;
  producto: {
    idProducto: number;
    nombre: string;
    codigoProducto: string;
    descripcion: string;
    precioVenta: string;
    stock: number;
  };
}

// ========= Tipos para tabla =========

export interface EmpleadoResumen {
  id: number;
  idEmpleado?: number; // Para compatibilidad
  nombre_completo: string;
  ci: string;
  telefono: string;
  fecha_contratacion: string;
  departamentos: string[];
  total_ventas: number;
  monto_total_ventas: number | string;
}

// ========= Tipos para desempeño (detalle) =========

export interface EmpleadoConHistorial {
  idEmpleado: number;
  fecha_contratacion: string;
  email: string;
  direccion: string;
  persona: Persona;
  departamentos: Departamento[];
  ventas: Venta[];
  movimientos: Movimiento[];
}

export interface DesempenioResponse {
  empleado: EmpleadoConHistorial;
  estadisticas: {
    total_ventas: number;
    monto_total_ventas: number;
    total_movimientos: number;
  };
}

// ========= Tipos para opciones de departamentos =========

export interface DepartamentoOption {
  idDepartamento: number;
  nombre: string;
  descripcion: string;
}

// ========= Servicio =========

const empleadosService = {
  /** LISTAR empleados (SIN paginación) */
  async getEmpleados(): Promise<EmpleadoResumen[]> {
    const res = await api.get("/propietario/empleados");
    const json = res.data;

    if (!json.success) {
      throw new Error(json.error || "No se pudieron cargar los empleados");
    }

    return json.data as EmpleadoResumen[];
  },

  /** DESCRIPCIÓN completa + ventas + movimientos + estadísticas */
  async getDesempenio(idEmpleado: number): Promise<DesempenioResponse> {
    const res = await api.get(`/propietario/empleados/${idEmpleado}/desempenio`);
    const json = res.data;

    if (!json.success) {
      throw new Error(json.error || "No se pudo cargar el desempeño del empleado");
    }

    return json.data as DesempenioResponse;
  },

  /** OBTENER un empleado (datos básicos + persona + departamentos) */
  async getEmpleado(idEmpleado: number) {
    const res = await api.get(`/propietario/empleados/${idEmpleado}`);
    const json = res.data;

    if (!json.success) {
      throw new Error(json.error || "No se pudo obtener el empleado");
    }

    return json.data;
  },

  /** CREAR empleado */
  async createEmpleado(payload: any) {
    const res = await api.post("/propietario/empleados", payload);
    const json = res.data;

    if (!json.success) {
      throw new Error(json.error || "Error al crear el empleado");
    }

    return json.data;
  },

  /** ACTUALIZAR empleado */
  async updateEmpleado(idEmpleado: number, payload: any) {
    const res = await api.put(`/propietario/empleados/${idEmpleado}`, payload);
    const json = res.data;

    if (!json.success) {
      throw new Error(json.error || "Error al actualizar empleado");
    }

    return json.data;
  },

  /** ELIMINAR empleado */
  async deleteEmpleado(idEmpleado: number) {
    const res = await api.delete(`/propietario/empleados/${idEmpleado}`);
    const json = res.data;

    if (!json.success) {
      throw new Error(json.error || "Error al eliminar el empleado");
    }

    return true;
  },

  /** ASIGNAR departamentos */
  async asignarDepartamentos(idEmpleado: number, payload: { departamentos: number[]; observacion?: string }) {
    const res = await api.post(`/propietario/empleados/${idEmpleado}/asignar-departamentos`, payload);
    const json = res.data;

    if (!json.success) {
      throw new Error(json.error || "Error al asignar departamentos");
    }

    return json.data;
  },

  /** OBTENER opciones de departamentos (para select) */
  async fetchDepartamentosOptions(): Promise<DepartamentoOption[]> {
    const res = await api.get("/propietario/departamentos");
    const json = res.data;

    if (!json.success) {
      throw new Error(json.error || "No se pudieron cargar los departamentos");
    }

    return json.data as DepartamentoOption[];
  },
};


export default empleadosService;
