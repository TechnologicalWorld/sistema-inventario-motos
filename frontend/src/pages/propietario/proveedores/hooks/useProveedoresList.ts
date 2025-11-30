import { useEffect, useState } from "react";
import proveedoresService, {
  Proveedor,
  ProveedorPayload,
} from "../proveedores.service";

export function useProveedoresList() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Paginación local simulada (porque tu backend no la tiene)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });

  const ITEMS_PER_PAGE = 10;

  const loadProveedores = async (page: number = 1, searchTerm?: string) => {
    try {
      setLoading(true);
      setError(null);

      const lista = await proveedoresService.getProveedores();
      const filtrados = lista.filter((p) =>
        p.nombre.toLowerCase().includes((searchTerm ?? search).toLowerCase())
      );
//paginacion
      const total = filtrados.length;
      const lastPage = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
      const currentPage = Math.min(page, lastPage);

      const inicio = (currentPage - 1) * ITEMS_PER_PAGE;
      const pageItems = filtrados.slice(inicio, inicio + ITEMS_PER_PAGE);

      setProveedores(pageItems);

      setPagination({
        currentPage,
        lastPage,
        total,
      });
    } catch (err) {
      console.error(err);
      setError("Error al obtener los proveedores.");
      setProveedores([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProveedores(1);
  }, []);

  const crearProveedor = async (payload: ProveedorPayload) => {
    await proveedoresService.createProveedor(payload);
    await loadProveedores(pagination.currentPage);
  };

  const actualizarProveedor = async (
    idEmpresaP: number,
    payload: ProveedorPayload
  ) => {
    await proveedoresService.updateProveedor(idEmpresaP, payload);
    await loadProveedores(pagination.currentPage);
  };

  const eliminarProveedor = async (idEmpresaP: number) => {
    await proveedoresService.deleteProveedor(idEmpresaP);
    await loadProveedores(pagination.currentPage);
  };

  return {
    proveedores,
    pagination,
    search,
    setSearch,
    loading,
    error,
    loadProveedores,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor,
  };
}
