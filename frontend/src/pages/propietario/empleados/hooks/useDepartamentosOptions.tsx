import { useEffect, useState } from "react";
import empleadosService from "../empleados.service";
import type { DepartamentoOption } from "../empleados.service";

export function useDepartamentosOptions() {
  const [options, setOptions] = useState<DepartamentoOption[]>([]);
  const [loading, setLoading] = useState(false);

  const loadOptions = async () => {
    try {
      setLoading(true);
      const data = await empleadosService.fetchDepartamentosOptions();
      setOptions(data);
    } catch (err) {
      console.error("Error al cargar departamentos:", err);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOptions();
  }, []);

  return { options, loading, reload: loadOptions };
}
