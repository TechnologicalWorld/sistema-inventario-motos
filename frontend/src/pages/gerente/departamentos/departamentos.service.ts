import api from "../../../services/api";

/* ===== Tipos base ===== */

export interface Departamento {
  idDepartamento: number;
  nombre: string;
  descripcion: string | null;
  empleados_count: number;
  created_at: string;
  updated_at: string;
}

export interface DepartamentoFormPayload {
  nombre: string;
  descripcion?: string;
}

export interface PersonaDepto {
  idPersona: number;
  ci: string;
  paterno: string;
  materno: string;
  nombres: string;
  fecha_naci: string;
  genero: "M" | "F" | "O" | string;
  telefono: string;
  created_at: string;
  updated_at: string;
}

export interface EmpleadoDeptoPivot {
  idDepartamento: number;
  idEmpleado: number;
  fecha: string; // YYYY-MM-DD
  observacion: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmpleadoDepto {
  idEmpleado: number;
  fecha_contratacion: string;
  email: string;
  direccion: string;
  created_at: string;
  updated_at: string;
  pivot?: EmpleadoDeptoPivot;
  persona: PersonaDepto;
}

export interface DepartamentoWithEmpleados {
  idDepartamento: number;
  nombre: string;
  descripcion: string | null;
  created_at: string;
  updated_at: string;
  empleados: EmpleadoDepto[];
}

/* ===== Servicio ===== */

const departamentosService = {
  async getDepartamentos(): Promise<Departamento[]> {
    const res = await api.get("/gerente/departamentos");
    const json = res.data;

    if (!json.success) {
      throw new Error(json.error || "Error al obtener departamentos");
    }

    return json.data as Departamento[];
  },

  async createDepartamento(
    payload: DepartamentoFormPayload
  ): Promise<Departamento> {
    const res = await api.post("/gerente/departamentos", payload);
    const json = res.data;

    if (!json.success) {
      throw new Error(
        json.error ||
          (json.errors ? JSON.stringify(json.errors) : "Error al crear departamento")
      );
    }

    return json.data as Departamento;
  },

  async updateDepartamento(
    idDepartamento: number,
    payload: DepartamentoFormPayload
  ): Promise<Departamento> {
    const res = await api.put(`/gerente/departamentos/${idDepartamento}`, payload);
    const json = res.data;

    if (!json.success) {
      throw new Error(
        json.error ||
          (json.errors
            ? JSON.stringify(json.errors)
            : "Error al actualizar departamento")
      );
    }

    return json.data as Departamento;
  },

  async deleteDepartamento(idDepartamento: number): Promise<void> {
    const res = await api.delete(`/gerente/departamentos/${idDepartamento}`);
    const json = res.data;

    if (!json.success) {
      throw new Error(json.error || "Error al eliminar departamento");
    }
  },

  async getDepartamentoEmpleados(
    idDepartamento: number
  ): Promise<DepartamentoWithEmpleados> {
    const res = await api.get(`/gerente/departamentos/${idDepartamento}/empleados`);
    const json = res.data;

    if (!json.success) {
      throw new Error(json.error || "Error al obtener empleados del departamento");
    }

    return json.data as DepartamentoWithEmpleados;
  },
};

export default departamentosService;
