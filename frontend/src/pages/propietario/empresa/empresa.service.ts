import api from "../../../services/api";

// ------- Tipos -------

export interface Empresa {
  id: number;
  codigo: string;
  nombre: string;
  telefono: string;
  mision: string;
  vision: string;
  logo: string | null;
  created_at: string;
  updated_at: string;
}

interface EmpresaResponse {
  success: boolean;
  data: Empresa;
}

interface EmpresaUpdateResponse {
  success: boolean;
  message: string;
  data: Empresa;
}

export interface EmpresaUpdatePayload {
  nombre: string;
  telefono: string;
  mision: string;
  vision: string;
  logo?: string;
}

// ------- Funciones del servicio -------

async function getEmpresa(): Promise<Empresa> {
  const res = await api.get<EmpresaResponse>("/propietario/empresa");
  return res.data.data;
}

async function updateEmpresa(payload: EmpresaUpdatePayload): Promise<Empresa> {
  const res = await api.put<EmpresaUpdateResponse>("/propietario/empresa", payload);
  return res.data.data;
}

const empresaService = {
  getEmpresa,
  updateEmpresa,
};

export default empresaService;
