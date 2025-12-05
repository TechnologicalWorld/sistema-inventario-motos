import api from "../../../../services/api";

// ------- Tipos básicos -------

export interface ProductoVenta {
  idProducto: number;
  nombre: string;
  codigoProducto: string;
  precioVenta: number | string; // Puede ser string desde la API
  stock: number;
  descripcion: string;
}

export interface DetalleVenta {
  idDetalleVenta: number;
  cantidad: number;
  precioUnitario: number | string; // Puede ser string
  subTotal: number | string; // Puede ser string
  descripcion: string;
  idVenta: number;
  idProducto: number;
  producto: ProductoVenta;
}

export interface Venta {
  idVenta: number;
  fecha: string;
  montoTotal: number | string; // <-- PUEDE SER STRING
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';
  descripcion: string;
  idCliente: number;
  idEmpleado: number;
  created_at: string;
  updated_at: string;
  cliente: {
    idCliente: number;
    nit: string | null;
    persona: {
      idPersona: number;
      ci: string;
      paterno: string;
      materno: string;
      nombres: string;
    };
  };
  detalle_ventas: DetalleVenta[]; // <-- CON GUION BAJO
}

export interface VentaListApi {
  current_page: number;
  data: Venta[];
  last_page: number;
  total: number;
  per_page: number;
}

interface VentasIndexResponse {
  success: boolean;
  data: VentaListApi;
}

interface VentaResponse {
  success: boolean;
  data: Venta;
}

// ------- Funciones del service -------

export interface GetVentasParams {
  page?: number;
  search?: string;
}

async function getVentas(params: GetVentasParams = {}): Promise<VentaListApi> {
  console.log("🌐 GET /empleado/ventas", params);
  const res = await api.get<VentasIndexResponse>("/empleado/ventas", { params });
  console.log("✅ Respuesta ventas:", res.data);
  return res.data.data;
}

async function getVenta(id: number): Promise<Venta> {
  const res = await api.get<VentaResponse>(`/empleado/ventas/${id}`);
  return res.data.data;
}

async function createVenta(ventaData: {
  idCliente: number;
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';
  descripcion?: string;
  detalles: {
    idProducto: number;
    cantidad: number;
  }[];
}): Promise<Venta> {
  const res = await api.post<VentaResponse>("/empleado/ventas", ventaData);
  return res.data.data;
}

// Para el modal de registro de venta
async function getProductos(): Promise<ProductoVenta[]> {
  try {
    console.log("🌐 GET /catalogos/productos");
    const res = await api.get<{ success: boolean; data: ProductoVenta[] }>("/catalogos/productos");
    console.log("✅ Productos cargados:", res.data.data?.length || 0);
    return res.data.data || [];
  } catch (error) {
    console.error("❌ Error cargando productos:", error);
    throw error;
  }
}
async function getClientes(): Promise<any[]> {
  const res = await api.get<{ success: boolean; data: any[] }>("/catalogos/clientes");
  return res.data.data;
}


// Función auxiliar para convertir strings a números
export function parseToNumber(value: any): number {
  if (value === null || value === undefined) return 0;
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  return isNaN(num) ? 0 : num;
}

const ventasService = {
  getVentas,
  getVenta,
  createVenta,
  getProductos,
  getClientes,
  parseToNumber,
};

export default ventasService;