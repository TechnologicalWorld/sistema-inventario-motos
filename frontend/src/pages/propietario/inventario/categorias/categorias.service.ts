import api from "../../../../services/api";

export interface Categoria {
  idCategoria: number;
  nombre: string;
  descripcion: string | null;
  productos_count?: number;
}

interface IndexResponse {
  success: boolean;
  data: Categoria[];
}

class CategoriasService {
  private baseUrl = "/propietario/inventario/categorias";

  async getCategorias(): Promise<Categoria[]> {
    const res = await api.get<IndexResponse>(this.baseUrl);
    return res.data.data;
  }

  async createCategoria(payload: Omit<Categoria, "idCategoria" | "productos_count">) {
    const res = await api.post(this.baseUrl, payload);
    return res.data;
  }

  async updateCategoria(
    id: number,
    payload: Omit<Categoria, "idCategoria" | "productos_count">
  ) {
    const res = await api.put(`${this.baseUrl}/${id}`, payload);
    return res.data;
  }

  async deleteCategoria(id: number) {
    const res = await api.delete(`${this.baseUrl}/${id}`);
    return res.data;
  }
}

const categoriasService = new CategoriasService();
export default categoriasService;
