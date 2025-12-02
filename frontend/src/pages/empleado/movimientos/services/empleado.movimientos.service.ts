import api from "../../../../services/api";

// ------- Tipos básicos -------

export interface ProductoMovimiento {
  idProducto: number;
  nombre: string;
  codigoProducto: string;
  descripcion: string;
  precioVenta: number;
  precioCompra: number;
  stock: number;
  stockMinimo: number;
  estado: "activo" | "inactivo";
  idCategoria: number;
}

export interface Movimiento {
  idMovimiento: number;
  tipo: "entrada" | "salida";
  cantidad: number;
  observacion: string;
  fechaMovimiento: string;
  idEmpleado: number;
  idProducto: number;
  created_at: string;
  updated_at: string;
  producto: ProductoMovimiento;
}

export interface MovimientoListApi {
  current_page: number;
  data: Movimiento[];
  last_page: number;
  total: number;
  per_page: number;
}

interface MovimientosIndexResponse {
  success: boolean;
  data: MovimientoListApi;
}

interface MovimientoResponse {
  success: boolean;
  data: Movimiento;
}

// ------- Funciones del service -------

export interface GetMovimientosParams {
  page?: number;
}

async function getMovimientos(params: GetMovimientosParams = {}): Promise<MovimientoListApi> {
  console.log("🌐 Llamando GET /empleado/movimientos", params);
  
  // Convertir "todos" a undefined para no enviar ese filtro
  const filteredParams = { ...params };
  
  const res = await api.get<MovimientosIndexResponse>("/empleado/movimientos", { 
    params: filteredParams 
  });
  
  console.log("✅ Respuesta GET movimientos:", res.data);
  return res.data.data;
}

async function getMovimiento(id: number): Promise<Movimiento> {
  const res = await api.get<MovimientoResponse>(`/empleado/movimientos/${id}`);
  return res.data.data;
}

async function createMovimiento(movimientoData: {
  tipo: "entrada" | "salida";
  idProducto: number;
  cantidad: number;
  observacion: string;
}): Promise<Movimiento> {
  const res = await api.post<MovimientoResponse>("/empleado/movimientos", movimientoData);
  return res.data.data;
}

// Para el modal de registro
async function getProductos(): Promise<ProductoMovimiento[]> {
  const res = await api.get<{ success: boolean; data: ProductoMovimiento[] }>("/catalogos/productos");
  return res.data.data;
}

const movimientosService = {
  getMovimientos,
  getMovimiento,
  createMovimiento,
  getProductos,
};

export default movimientosService;