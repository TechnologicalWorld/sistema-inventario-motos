import api from "../../../services/api"; 

// ---------- Tipos básicos ----------

export interface Proveedor {
  idEmpresaP: number;
  nombre: string;
  telefono: string;
  contacto: string;
  direccion: string;
  compras_count: number;
  created_at: string;
  updated_at: string;
  total_comprado?: string | null;
}

export interface ProveedoresPaginated {
  current_page: number;
  data: Proveedor[];
  first_page_url: string | null;
  from: number | null;
  last_page: number;
  last_page_url: string | null;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

// ---------- Tipos para compras por proveedor ----------

export interface ProductoBasico {
  idProducto: number;
  nombre: string;
  codigoProducto: string;
  descripcion: string;
  precioVenta: string;
  precioCompra: string;
  stock: number;
  stockMinimo: number;
  estado: string;
  idCategoria: number;
}

export interface DetalleCompraProveedor {
  idDetalleCompra: number;
  precioUnitario: string;
  subTotal: string;
  cantidad: number;
  idCompra: number;
  idProducto: number;
  producto: ProductoBasico;
}

export interface CompraProveedor {
  idCompra: number;
  fecha: string;
  totalPago: string;
  observacion: string | null;
  idEmpresaP: number;
  idGerente: number;
  detalle_compras: DetalleCompraProveedor[];
}

export interface ProveedorCompras {
  idEmpresaP: number;
  nombre: string;
  telefono: string;
  contacto: string;
  direccion: string;
  created_at: string;
  updated_at: string;
  compras: CompraProveedor[];
}

export interface ProveedorComprasResumen {
  numeroCompras: number;
  totalComprado: number;
  ticketPromedio: number;
  ultimaCompra: string | null; // ISO
}

// ---------- Payloads CRUD ----------

export interface ProveedorPayload {
  nombre: string;
  telefono: string;
  contacto: string;
  direccion: string;
}

// ---------- Servicio ----------

const proveedoresService = {
  async getProveedores(params?: { page?: number; search?: string }) {
    const response = await api.get("/gerente/proveedores", {
      params: {
        page: params?.page ?? 1,
        search: params?.search ?? undefined,
      },
    });

    const paginated: ProveedoresPaginated = response.data.data;
    return paginated;
  },

  async createProveedor(payload: ProveedorPayload): Promise<Proveedor> {
    const response = await api.post("/gerente/proveedores", payload);
    return response.data.data as Proveedor;
  },

  async updateProveedor(
    idEmpresaP: number,
    payload: ProveedorPayload
  ): Promise<Proveedor> {
    const response = await api.put(`/gerente/proveedores/${idEmpresaP}`, payload);
    return response.data.data as Proveedor;
  },

  async deleteProveedor(idEmpresaP: number): Promise<void> {
    await api.delete(`/gerente/proveedores/${idEmpresaP}`);
  },

  async getProveedorCompras(
    idEmpresaP: number
  ): Promise<{ proveedor: ProveedorCompras; resumen: ProveedorComprasResumen }> {
    const response = await api.get(`/gerente/proveedores/${idEmpresaP}/compras`);
    const proveedor: ProveedorCompras = response.data.data;

    const numeroCompras = proveedor.compras.length;

    const totalComprado = proveedor.compras.reduce((sum, c) => {
      const val = parseFloat(c.totalPago ?? "0");
      return sum + (isNaN(val) ? 0 : val);
    }, 0);

    const ticketPromedio = numeroCompras > 0 ? totalComprado / numeroCompras : 0;

    const ultimaCompra =
      numeroCompras > 0
        ? proveedor.compras
            .map((c) => c.fecha)
            .sort((a, b) => (a > b ? -1 : 1))[0]
        : null;

    const resumen: ProveedorComprasResumen = {
      numeroCompras,
      totalComprado,
      ticketPromedio,
      ultimaCompra,
    };

    return { proveedor, resumen };
  },
};

export default proveedoresService;
