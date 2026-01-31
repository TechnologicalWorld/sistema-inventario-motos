import api from "../../../../services/api";

export interface Categoria {
  idCategoria: number;
  nombre: string;
  descripcion: string | null;
  productos_count?: number;
}

export interface Producto {
  idProducto: number;
  nombre: string;
  codigoProducto: string;
  descripcion: string | null;
  precioVenta: number;
  precioCompra: number;
  stock: number;
  stockMinimo: number;
  estado: "activo" | "inactivo";
  idCategoria: number;
  categoria?: Categoria;
  imagenUrl?: string;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface PaginationResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

interface ProductosIndexResponse {
  success: boolean;
  data: PaginationResponse<Producto>;
}

class ProductosService {
  private baseUrl = "/propietario/inventario";

  async getProductos(params?: {
    page?: number;
    search?: string;
    categoria?: number | null;
  }): Promise<PaginationResponse<Producto>> {
    const response = await api.get<ProductosIndexResponse>(this.baseUrl, {
      params: {
        page: params?.page,
        search: params?.search || undefined,
        categoria: params?.categoria || undefined,
      },
    });

    return response.data.data;
  }

  async getProducto(id: number): Promise<Producto> {
    const response = await api.get<{
      success: boolean;
      data: Producto;
    }>(`${this.baseUrl}/${id}`);

    return response.data.data;
  }

  async createProducto(payload: Omit<Producto, "idProducto" | "categoria">) {
    const response = await api.post(this.baseUrl+"/productos", payload);
    return response.data;
  }

  async updateProducto(
    id: number,
    payload: Omit<Producto, "idProducto" | "categoria">
  ) {
    const response = await api.put(`${this.baseUrl}/productos/${id}`, payload);
    return response.data;
  }

  async deleteProducto(id: number) {
    const response = await api.delete(`${this.baseUrl}/productos/${id}`);
    return response.data;
  }
}

const productosService = new ProductosService();
export default productosService;
