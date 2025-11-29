import { useEffect, useState } from "react";
import proveedoresService, {
  Proveedor,
  ProveedoresPaginated,
  ProveedorPayload,
} from "../proveedores.service";

export function useProveedoresList() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [pagination, setPagination] = useState<{
    currentPage: number;
    lastPage: number;
    total: number;
  }>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProveedores = async (page: number = 1, searchTerm?: string) => {
    try {
      setLoading(true);
      setError(null);

      const data: ProveedoresPaginated = await proveedoresService.getProveedores(
        {
          page,
          search: searchTerm ?? search,
        }
      );

      const baseProveedores = data.data;

      setPagination({
        currentPage: data.current_page,
        lastPage: data.last_page,
        total: data.total,
      });

      const proveedoresConTotales: Proveedor[] = await Promise.all(
        baseProveedores.map(async (p) => {
          if (!p.compras_count) {
            return { ...p, total_comprado: null };
          }

          try {
            const { resumen } = await proveedoresService.getProveedorCompras(
              p.idEmpresaP
            );

            return {
              ...p,
              total_comprado: resumen.totalComprado.toString(),
            };
          } catch (e) {
            console.error(
              "Error al calcular total_comprado del proveedor",
              p.idEmpresaP,
              e
            );
            return { ...p, total_comprado: null };
          }
        })
      );

      setProveedores(proveedoresConTotales);
    } catch (err: any) {
      console.error(err);
      setError("Error al obtener los proveedores.");
      setProveedores([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProveedores(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (proveedores.length === 1 && pagination.currentPage > 1) {
      await loadProveedores(pagination.currentPage - 1);
    } else {
      await loadProveedores(pagination.currentPage);
    }
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
