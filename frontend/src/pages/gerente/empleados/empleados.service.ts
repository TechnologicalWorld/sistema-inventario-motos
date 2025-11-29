import api from "../../../services/api";

/* ========= Tipos base ========= */

export interface Persona {
  idPersona: number;
  ci: string;
  paterno: string;
  materno: string;
  nombres: string;
  fecha_naci: string; 
  genero: "M" | "F" | "O" | string;
  telefono: string;
  created_at?: string;
  updated_at?: string;
}

export interface DepartamentoPivot {
  idEmpleado: number;
  idDepartamento: number;
  fecha: string;
  observacion: string | null;
  created_at: string;
  updated_at: string;
}

export interface Departamento {
  idDepartamento: number;
  nombre: string;
  descripcion: string;
  created_at?: string;
  updated_at?: string;
  pivot?: DepartamentoPivot;
}

export interface Empleado {
  idEmpleado: number;
  fecha_contratacion: string; 
  email: string;
  direccion: string;
  created_at: string;
  updated_at: string;
  persona: Persona;
  departamentos: Departamento[];
}

/* ========= Paginación / filtros ========= */

export interface PaginationMeta {
  currentPage: number;
  lastPage: number;
  total: number;
}

export interface EmpleadosFilters {
  search?: string;
  departamentoId?: number | "";
}

export interface EmpleadoFormInput {
  ci: string;
  paterno: string;
  materno: string;
  nombres: string;
  fechaNacimiento: string;          
  genero: "M" | "F" | "O" | "";     
  telefono: string;
  email: string;
  direccion: string;
  fechaContratacion: string;        
  password: string;
  departamentoInicialId?: number | null;
}

/* ========= Asignar departamentos ========= */

export interface AsignarDepartamentosPayload {
  departamentos: number[];
  observacion?: string;
}

/* ========= Otros tipos ========= */

export interface DepartamentoOption {
  idDepartamento: number;
  nombre: string;
}

/* ========= Helpers internos ========= */

function mapPagination(raw: any): PaginationMeta {
  return {
    currentPage: raw.current_page ?? 1,
    lastPage: raw.last_page ?? 1,
    total: raw.total ?? raw.data?.length ?? 0,
  };
}

/* ========= Servicio ========= */

const empleadosService = {
  async getEmpleados(params?: {
    page?: number;
    filters?: EmpleadosFilters;
  }): Promise<{ data: Empleado[]; meta: PaginationMeta }> {
    const { page = 1, filters = {} } = params || {};

    const queryParams: any = { page };

    if (filters.search) {
      queryParams.search = filters.search;
    }

    const res = await api.get("/gerente/empleados", { params: queryParams });

    const json = res.data;
    if (!json.success) {
      throw new Error(json.error || "Error al obtener los empleados");
    }

    const paginated = json.data;
    const empleados: Empleado[] = paginated.data || [];
    const meta = mapPagination(paginated);

    return { data: empleados, meta };
  },

  /** Crear empleado NUEVO */
  async createEmpleado(form: EmpleadoFormInput): Promise<Empleado> {
    const payload: any = {
      ci: form.ci,
      paterno: form.paterno,
      materno: form.materno,
      nombres: form.nombres,
      fecha_naci: form.fechaNacimiento,
      genero: form.genero,
      telefono: form.telefono,
      email: form.email,
      direccion: form.direccion,
      fecha_contratacion: form.fechaContratacion,
      password: form.password,
    };

    if (form.departamentoInicialId) {
      payload.departamentos = [form.departamentoInicialId];
    }

    const res = await api.post("/gerente/empleados", payload);
    const json = res.data;

    if (!json.success) {
      console.error("Errores de validación createEmpleado:", json.errors);
      throw new Error(json.error || "Error al crear empleado");
    }

    return json.data as Empleado;
  },

  async updateEmpleado(
    idEmpleado: number,
    form: EmpleadoFormInput
  ): Promise<Empleado> {
    const payload: any = {
      ci: form.ci,
      paterno: form.paterno,
      materno: form.materno,
      nombres: form.nombres,
      fecha_naci: form.fechaNacimiento,
      genero: form.genero,
      telefono: form.telefono,
      email: form.email,
      direccion: form.direccion,
      fecha_contratacion: form.fechaContratacion,
    };

    if (form.password.trim() !== "") {
      payload.password = form.password;
    }

    if (form.departamentoInicialId) {
      payload.departamentos = [form.departamentoInicialId];
    }

    const res = await api.put(`/gerente/empleados/${idEmpleado}`, payload);
    const json = res.data;

    if (!json.success) {
      console.error("Errores de validación updateEmpleado:", json.errors);
      throw new Error(json.error || "Error al actualizar empleado");
    }

    return json.data as Empleado;
  },

  async deleteEmpleado(idEmpleado: number): Promise<void> {
    const res = await api.delete(`/gerente/empleados/${idEmpleado}`);
    const json = res.data;

    if (!json.success) {
      throw new Error(json.error || "Error al eliminar empleado");
    }
  },

  async asignarDepartamentos(
    idEmpleado: number,
    payload: AsignarDepartamentosPayload
  ): Promise<Empleado> {
    const res = await api.post(
      `/gerente/empleados/${idEmpleado}/asignar-departamentos`,
      payload
    );
    const json = res.data;

    if (!json.success) {
      throw new Error(json.error || "Error al asignar departamentos");
    }

    return json.data as Empleado;
  },

  async fetchDepartamentosOptions(): Promise<DepartamentoOption[]> {
    try {
      const res = await api.get("/gerente/departamentos");
      const json = res.data;
      if (!json.success) return [];

      const raw = json.data;
      const list = Array.isArray(raw) ? raw : raw.data;

      return (list || []).map((d: any) => ({
        idDepartamento: d.idDepartamento,
        nombre: d.nombre,
      }));
    } catch (e) {
      console.error(e);
      return [];
    }
  },
};

export default empleadosService;

export type EmpleadoCreatePayload = EmpleadoFormInput;
export type EmpleadoUpdatePayload = EmpleadoFormInput;
