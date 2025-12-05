import { useEffect, useState } from "react";
import proveedoresService, {
  ProveedorCompras,
  ProveedorComprasResumen,
} from "../proveedores.service";

export function useProveedorCompras(idEmpresaP: number | null) {
  const [data, setData] = useState<ProveedorCompras | null>(null);
  const [resumen, setResumen] = useState<ProveedorComprasResumen | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idEmpresaP) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const { proveedor, resumen } =
          await proveedoresService.getProveedorCompras(idEmpresaP);
        setData(proveedor);
        setResumen(resumen);
      } catch (err: any) {
        console.error(err);
        setError("Error al obtener las compras del proveedor.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idEmpresaP]);

  return { data, resumen, loading, error };
}
