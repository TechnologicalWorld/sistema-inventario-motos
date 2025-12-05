import api from "../../../../services/api";

// ------- Tipos -------

export interface Producto {
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
  categoria?: Categoria;
}

export interface Categoria {
  idCategoria: number;
  nombre: string;
  descripcion: string;
  created_at: string;
  updated_at: string;
}

// ------- Paginación -------

export interface ProductoListApi {
  current_page: number;
  data: Producto[];
  last_page: number;
  total: number;
}

interface ProductosIndexResponse {
  success: boolean;
  data: ProductoListApi;
}

interface ProductoShowResponse {
  success: boolean;
  data: Producto;
}

// ------- Funciones del service -------

export interface GetProductosParams {
  page?: number;
  search?: string;
  categoria?: number;
  stock_bajo?: boolean;
}

async function getProductos(
  params: GetProductosParams = {}
): Promise<ProductoListApi> {
  const res = await api.get<ProductosIndexResponse>("/empleado/inventario", {
    params,
  });
  return res.data.data;
}

async function getProducto(id: number): Promise<Producto> {
  const res = await api.get<ProductoShowResponse>(
    `/empleado/inventario/productos/${id}`
  );
  return res.data.data;
}

async function getStockBajo(): Promise<Producto[]> {
  const res = await api.get<{ success: boolean; data: Producto[] }>(
    "/empleado/inventario/stock-bajo"
  );
  return res.data.data;
}

const inventarioService = {
  getProductos,
  getProducto,
  getStockBajo,
};

export default inventarioService;