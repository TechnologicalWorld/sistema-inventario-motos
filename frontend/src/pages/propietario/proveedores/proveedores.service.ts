import api from "../../../services/api";

// ---------- Interfaces ----------

export interface Proveedor {
  idEmpresaP: number;
  nombre: string;
  telefono: string;
  contacto: string;
  direccion: string;
  created_at: string;
  updated_at: string;
  compras?: CompraProveedor[];
}

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
  detalle_compras?: DetalleCompraProveedor[];
}

export interface ProveedorPayload {
  nombre: string;
  telefono: string;
  contacto: string;
  direccion: string;
}

export interface ProveedorComprasResumen {
  numeroCompras: number;
  totalComprado: number;
  ticketPromedio: number;
  ultimaCompra: string | null;
}

const proveedoresService = {

  // GET LISTA simple 
  async getProveedores(): Promise<Proveedor[]> {
    const response = await api.get("/propietario/proveedores");
    return response.data.data as Proveedor[];
  },

  // CREATE proveedor
  async createProveedor(payload: ProveedorPayload): Promise<Proveedor> {
    const response = await api.post("/propietario/proveedores", payload);
    return response.data.data as Proveedor;
  },

  // UPDATE proveedor
  async updateProveedor(idEmpresaP: number, payload: ProveedorPayload): Promise<Proveedor> {
    const response = await api.put(`/propietario/proveedores/${idEmpresaP}`, payload);
    return response.data.data as Proveedor;
  },

  // DELETE proveedor
  async deleteProveedor(idEmpresaP: number): Promise<void> {
    await api.delete(`/propietario/proveedores/${idEmpresaP}`);
  },

  // HISTORIAL COMPRAS
  async getProveedorHistorial(idEmpresaP: number): Promise<{
    proveedor: Proveedor;
    resumen: ProveedorComprasResumen;
  }> {
    const response = await api.get(`/propietario/proveedores/${idEmpresaP}/historial-compras`);

    const proveedor: Proveedor = response.data.data;

    const compras = proveedor.compras ?? [];

    const numeroCompras = compras.length;

    const totalComprado = compras.reduce((sum, c) => {
      const v = parseFloat(c.totalPago ?? "0");
      return sum + (isNaN(v) ? 0 : v);
    }, 0);

    const ticketPromedio = numeroCompras > 0 ? totalComprado / numeroCompras : 0;

    const ultimaCompra = numeroCompras
      ? compras.map(c => c.fecha).sort((a, b) => b.localeCompare(a))[0]
      : null;

    return {
      proveedor,
      resumen: {
        numeroCompras,
        totalComprado,
        ticketPromedio,
        ultimaCompra,
      },
    };
  },
};

export default proveedoresService;
