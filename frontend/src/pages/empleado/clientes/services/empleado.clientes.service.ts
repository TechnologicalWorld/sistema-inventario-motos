import api from "../../../../services/api"; 

// ------- Tipos básicos -------

export interface Persona {
  idPersona: number;
  ci: string;
  paterno: string;
  materno: string;
  nombres: string;
  fecha_naci: string;
  genero: "M" | "F" | "O";
  telefono: string;
  created_at: string;
  updated_at: string;
}

export interface Cliente {
  idCliente: number;
  nit: string | null;
  created_at: string;
  updated_at: string;
  persona: Persona;
}

// ------- Paginación -------

export interface ClienteListApi {
  current_page: number;
  data: Cliente[];
  last_page: number;
  total: number;
}

interface ClientesIndexResponse {
  success: boolean;
  data: Cliente[]; // CAMBIO: Array directo, no objeto paginado
}

// ------- Funciones del service -------

export interface GetClientesParams {
  page?: number;
  search?: string;
}

async function getClientes(
  params: GetClientesParams = {}
): Promise<ClienteListApi> {
  console.log('🔍 Solicitando clientes desde: /empleado/clientes', params);
  
  const res = await api.get<ClientesIndexResponse>("/empleado/clientes", {
    params,
  });
  
  console.log('✅ Respuesta completa de la API:', res.data);
  
  // CAMBIO: La respuesta es {success: true, data: Array(11)}
  // No tiene paginación, así que creamos una estructura compatible
  if (!res.data.data || !Array.isArray(res.data.data)) {
    console.error('❌ Estructura de respuesta inesperada:', res.data);
    throw new Error('Estructura de respuesta inesperada');
  }
  
  // Crear estructura de paginación manualmente
  const clientesData: ClienteListApi = {
    data: res.data.data,
    current_page: 1,
    last_page: 1,
    total: res.data.data.length
  };
  
  console.log('📊 Datos procesados:', clientesData);
  return clientesData;
}

async function createCliente(clienteData: {
  ci: string;
  paterno: string;
  materno: string;
  nombres: string;
  fecha_naci: string;
  genero: "M" | "F" | "O";
  telefono: string;
  nit?: string;
}): Promise<Cliente> {
  const res = await api.post<{ success: boolean; data: Cliente }>(
    "/empleado/clientes",
    clienteData
  );
  return res.data.data;
}

async function buscarPorCI(ci: string): Promise<Cliente | null> {
  try {
    const res = await api.get<{ success: boolean; data: Cliente }>(
      `/empleado/clientes/buscar/${ci}`
    );
    return res.data.data;
  } catch (error) {
    return null;
  }
}

async function getCliente(id: number): Promise<Cliente> {
  const res = await api.get<{ success: boolean; data: Cliente }>(
    `/empleado/clientes/${id}`
  );
  return res.data.data;
}

const clientesService = {
  getClientes,
  createCliente,
  buscarPorCI,
  getCliente,
};

export default clientesService;