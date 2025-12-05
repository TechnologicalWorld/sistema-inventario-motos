import api from "../../../../services/api";

// ------- Tipos básicos -------

export interface Departamento {
  idDepartamento: number;
  nombre: string;
  descripcion: string;
  created_at: string;
  updated_at: string;
}

export interface Trabaja {
  idEmpleado: number;
  idDepartamento: number;
  fecha: string;
  observacion: string | null;
  created_at: string;
  updated_at: string;
  departamento: Departamento;
}

export interface MiDepartamentoResponse {
  departamento_actual: Departamento | null;
  historial_asignaciones: Trabaja[];
}

interface DepartamentoApiResponse {
  success: boolean;
  data: MiDepartamentoResponse;
}

// ------- Funciones del service -------

async function getMiDepartamento(): Promise<MiDepartamentoResponse> {
  const res = await api.get<DepartamentoApiResponse>("/empleado/departamento/mi-departamento");
  return res.data.data;
}

const departamentoService = {
  getMiDepartamento,
};

export default departamentoService;