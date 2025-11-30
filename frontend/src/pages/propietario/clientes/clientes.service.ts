import api from "../../../services/api"; 

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
  data: ClienteListApi;
}

// ------- Historial de compras -------

export interface ProductoHistorial {
  idProducto: number;
  nombre: string;
  codigoProducto: string;
  descripcion: string;
  precioVenta: string;
  precioCompra: string;
  stock: number;
  stockMinimo: number;
  estado: "activo" | "inactivo";
  idCategoria: number;
  created_at: string;
  updated_at: string;
}

export interface DetalleVentaHistorial {
  idDetalleVenta: number;
  cantidad: number;
  precioUnitario: string;
  subTotal: string;
  descripcion: string;
  idVenta: number;
  idProducto: number;
  created_at: string;
  updated_at: string;
  producto: ProductoHistorial;
}

export interface EmpleadoPersona {
  idPersona: number;
  ci: string;
  paterno: string;
  materno: string;
  nombres: string;
  fecha_naci: string;
  genero: string;
  telefono: string;
  created_at: string;
  updated_at: string;
}

export interface EmpleadoHistorial {
  idEmpleado: number;
  fecha_contratacion: string;
  email: string;
  direccion: string;
  created_at: string;
  updated_at: string;
  persona: EmpleadoPersona;
}

export interface VentaHistorial {
  idVenta: number;
  fecha: string;
  montoTotal: string;
  metodoPago: string;
  descripcion: string;
  idCliente: number;
  idEmpleado: number;
  created_at: string;
  updated_at: string;
  empleado: EmpleadoHistorial;
  detalle_ventas: DetalleVentaHistorial[];
}

export interface ClienteHistorialApi {
  idCliente: number;
  nit: string | null;
  created_at: string;
  updated_at: string;
  ventas: VentaHistorial[];
}

interface ClienteHistorialResponse {
  success: boolean;
  data: ClienteHistorialApi;
}

// ------- Funciones del service -------

export interface GetClientesParams {
  page?: number;
  search?: string;
}

async function getClientes(
  params: GetClientesParams = {}
): Promise<ClienteListApi> {
  const res = await api.get<ClientesIndexResponse>("/propietario/clientes", {
    params,
  });
  return res.data.data;
}

async function getHistorialCompras(
  idCliente: number
): Promise<ClienteHistorialApi> {
  const res = await api.get<ClienteHistorialResponse>(
    `/propietario/clientes/${idCliente}/historial-compras`
  );
  return res.data.data;
}

const clientesService = {
  getClientes,
  getHistorialCompras,
};

export default clientesService;
