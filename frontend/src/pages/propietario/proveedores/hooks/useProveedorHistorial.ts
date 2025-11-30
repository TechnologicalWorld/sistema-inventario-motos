import { useEffect, useState } from "react";
import proveedoresService from "../proveedores.service";
import { Proveedor, ProveedorComprasResumen } from "../proveedores.service";

export function useProveedorHistorial(idEmpresaP: number | null) {
  const [data, setData] = useState<{
    proveedor: Proveedor;
    resumen: ProveedorComprasResumen;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idEmpresaP) return;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await proveedoresService.getProveedorHistorial(idEmpresaP);
        setData(res);
      } catch (err) {
        console.error(err);
        setError("Error al obtener historial de compras del proveedor.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [idEmpresaP]);

  return { data, loading, error };
}
