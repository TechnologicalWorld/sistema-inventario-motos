import { useEffect, useMemo, useState } from "react";
import departamentosService, {
  Departamento,
  DepartamentoFormPayload,
} from "../departamentos.service";

export function useDepartamentosList() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const loadDepartamentos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await departamentosService.getDepartamentos();
      setDepartamentos(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al obtener departamentos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartamentos();
  }, []);

  const filteredDepartamentos = useMemo(() => {
    if (!search.trim()) return departamentos;

    const term = search.toLowerCase();
    return departamentos.filter(
      (d) =>
        d.nombre.toLowerCase().includes(term) ||
        (d.descripcion ?? "").toLowerCase().includes(term) ||
        `D-${d.idDepartamento.toString().padStart(3, "0")}`
          .toLowerCase()
          .includes(term)
    );
  }, [departamentos, search]);

  const createDepartamento = async (payload: DepartamentoFormPayload) => {
    await departamentosService.createDepartamento(payload);
    await loadDepartamentos();
  };

  const updateDepartamento = async (
    idDepartamento: number,
    payload: DepartamentoFormPayload
  ) => {
    await departamentosService.updateDepartamento(idDepartamento, payload);
    await loadDepartamentos();
  };

  const deleteDepartamento = async (idDepartamento: number) => {
    await departamentosService.deleteDepartamento(idDepartamento);
    await loadDepartamentos();
  };

  return {
    departamentos: filteredDepartamentos,
    rawDepartamentos: departamentos,
    loading,
    error,
    search,
    setSearch,
    reload: loadDepartamentos,
    createDepartamento,
    updateDepartamento,
    deleteDepartamento,
  };
}
