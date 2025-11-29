import api from "../../../services/api";

/* ===== Tipos base ===== */

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

export interface GerentePersona {
  idGerente: number;
  fecha_contratacion: string;
  email: string;
  direccion: string;
  persona: Persona;
}

export interface EmpresaProveedora {
  idEmpresaP: number;
  nombre: string;
  telefono: string;
  contacto: string;
  direccion: string;
}

export interface ProductoCompra {
  idProducto: number;
  nombre: string;
  codigoProducto: string;
  descripcion: string;
  precioVenta: string | number;
  precioCompra: string | number;
  stock: number;
  stockMinimo: number;
  estado: string;
  idCategoria: number;
}

export interface DetalleCompra {
  idDetalleCompra: number;
  precioUnitario: string | number;
  subTotal: string | number;
  cantidad: number;
  idCompra: number;
  idProducto: number;
  producto: ProductoCompra;
}

export interface Compra {
  idCompra: number;
  fecha: string;
  totalPago: string | number;
  observacion: string | null;
  idEmpresaP: number;
  idGerente: number;
  empresa_proveedora: EmpresaProveedora;
  gerente: GerentePersona;
  detalle_compras: DetalleCompra[];
}

export type CompraListItem = Compra;

/* ===== Paginación ===== */

export interface PaginationMeta {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
}

/* ===== Filtros ===== */

export interface ComprasFilters {
  search?: string;
  proveedor?: string | number;
  fecha_inicio?: string; 
  fecha_fin?: string; 
}

/* ===== Payload para crear compra ===== */

export interface DetalleCompraInput {
  idProducto: number;
  cantidad: number;
  precioUnitario: number;
}

export interface NuevaCompraPayload {
  idEmpresaP: number;
  observacion?: string;
  detalles: DetalleCompraInput[];
}

/* ===== Proveedor / Producto para selects ===== */

export interface ProveedorOption {
  idEmpresaP: number;
  nombre: string;
}

export interface ProductoOption {
  idProducto: number;
  nombre: string;
  codigoProducto: string;
  precioCompra: number;
}

/* ===== Helpers internos ===== */

function mapPagination(raw: any): PaginationMeta {
  return {
    currentPage: raw.current_page ?? 1,
    lastPage: raw.last_page ?? 1,
    perPage: raw.per_page ?? raw.data?.length ?? 0,
    total: raw.total ?? raw.data?.length ?? 0,
  };
}

/* ===== Llamadas principales ===== */

export async function getCompras(params: {
  page?: number;
  filters?: ComprasFilters;
}): Promise<{ data: CompraListItem[]; meta: PaginationMeta }> {
  const { page = 1, filters = {} } = params;

  const queryParams: any = {
    page,
  };

  if (filters.proveedor) queryParams.proveedor = filters.proveedor;
  if (filters.fecha_inicio) queryParams.fecha_inicio = filters.fecha_inicio;
  if (filters.fecha_fin) queryParams.fecha_fin = filters.fecha_fin;
  if (filters.search) queryParams.search = filters.search; // el backend lo puede ignorar si aún no lo implementaste

  const res = await api.get("/gerente/compras", { params: queryParams });
  const json = res.data;

  if (!json.success) {
    throw new Error(json.error || "Error al obtener las compras");
  }

  const paginated = json.data;
  const compras: CompraListItem[] = paginated.data || [];
  const meta = mapPagination(paginated);

  return { data: compras, meta };
}

export async function getCompraById(idCompra: number): Promise<Compra> {
  const res = await api.get(`/gerente/compras/${idCompra}`);
  const json = res.data;

  if (!json.success) {
    throw new Error(json.error || "Error al obtener la compra");
  }

  return json.data as Compra;
}

export async function createCompra(
  payload: NuevaCompraPayload
): Promise<Compra> {
  const res = await api.post("/gerente/compras", payload);
  const json = res.data;

  if (!json.success) {
    throw new Error(json.error || "Error al registrar la compra");
  }

  return json.data as Compra;
}

/* ===== Helpers para selects (proveedores / productos) ===== */

export async function fetchProveedoresOptions(): Promise<ProveedorOption[]> {
  try {
    const res = await api.get("/gerente/proveedores");
    const json = res.data;

    if (!json.success) return [];

    const raw = json.data;
    const list = Array.isArray(raw) ? raw : raw.data;

    return (list || []).map((p: any) => ({
      idEmpresaP: p.idEmpresaP,
      nombre: p.nombre,
    }));
  } catch {
    return [];
  }
}

export async function fetchProductosOptions(): Promise<ProductoOption[]> {
  try {
    const res = await api.get("/gerente/inventario/productos");
    const json = res.data;

    if (!json.success) return [];

    const raw = json.data;
    const list = Array.isArray(raw) ? raw : raw.data;

    return (list || []).map((p: any) => ({
      idProducto: p.idProducto,
      nombre: p.nombre,
      codigoProducto: p.codigoProducto,
      precioCompra: Number(p.precioCompra ?? 0),
    }));
  } catch {
    return [];
  }
}
