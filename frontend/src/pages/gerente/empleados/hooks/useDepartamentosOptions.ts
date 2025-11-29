import { useEffect, useState } from "react";
import empleadosService, {
  DepartamentoOption,
} from "../empleados.service";

export function useDepartamentosOptions() {
  const [options, setOptions] = useState<DepartamentoOption[]>([]);
  const [loading, setLoading] = useState(false);

  const loadOptions = async () => {
    try {
      setLoading(true);
      const data = await empleadosService.fetchDepartamentosOptions();
      setOptions(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOptions();
  }, []);

  return { options, loading, reload: loadOptions };
}
