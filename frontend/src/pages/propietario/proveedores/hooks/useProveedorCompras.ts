import { useEffect, useState } from "react";
import proveedoresService from "../proveedores.service";
import type { Proveedor, ProveedorComprasResumen } from "../proveedores.service";

export function useProveedorCompras(idEmpresaP: number | null) {
  const [data, setData] = useState<Proveedor | null>(null);
  const [resumen, setResumen] = useState<ProveedorComprasResumen | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idEmpresaP) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // El servicio disponible es `getProveedorHistorial` que devuelve
        // { proveedor, resumen } con la estructura esperada.
        const resp = await proveedoresService.getProveedorHistorial(idEmpresaP);
        const proveedor = resp.data ?? resp; // compatibilidad por si el servicio retorna directamente

        // Algunos servicios devuelven { proveedor, resumen } y otros devolvemos
        // directamente { proveedor, resumen } en la raíz. Normalizamos ambos.
        if ((resp as any).proveedor) {
          setData((resp as any).proveedor as Proveedor);
          setResumen((resp as any).resumen as ProveedorComprasResumen);
        } else if ((resp as any).data && (resp as any).data.proveedor) {
          setData((resp as any).data.proveedor as Proveedor);
          setResumen((resp as any).data.resumen as ProveedorComprasResumen);
        } else if ((resp as any).data && (resp as any).data.compras) {
          // Si el endpoint devuelve directamente el proveedor en data
          setData((resp as any).data as Proveedor);
          // calcular resumen básico a partir de compras
          const compras = (resp as any).data.compras ?? [];
          const numeroCompras = compras.length;
          const totalComprado = compras.reduce((sum: number, c: any) => {
            const v = parseFloat(c.totalPago ?? "0");
            return sum + (isNaN(v) ? 0 : v);
          }, 0);
          setResumen({
            numeroCompras,
            totalComprado,
            ticketPromedio: numeroCompras > 0 ? totalComprado / numeroCompras : 0,
            ultimaCompra: numeroCompras
              ? compras.map((c: any) => c.fecha).sort((a: string, b: string) => b.localeCompare(a))[0]
              : null,
          });
        } else {
          // Fallback: asignar resp directamente si coincide con Proveedor
          setData(resp as any);
        }
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
