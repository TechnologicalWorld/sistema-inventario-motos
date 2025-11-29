import { useEffect, useState } from "react";
import departamentosService, {
  DepartamentoWithEmpleados,
} from "../departamentos.service";

export function useDepartamentoDetalle(idDepartamento: number | null) {
  const [departamento, setDepartamento] =
    useState<DepartamentoWithEmpleados | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDetalle = async () => {
    if (!idDepartamento) return;
    try {
      setLoading(true);
      setError(null);
      const data = await departamentosService.getDepartamentoEmpleados(
        idDepartamento
      );
      setDepartamento(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al obtener detalle de departamento.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetalle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idDepartamento]);

  return { departamento, loading, error, reload: loadDetalle };
}
