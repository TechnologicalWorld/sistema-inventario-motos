import { useEffect, useState } from "react";
import departamentoService, { 
  MiDepartamentoResponse, 
  Departamento, 
  Trabaja 
} from "../services/empleado.departamento.service";

export function useMiDepartamento() {
  const [departamentoActual, setDepartamentoActual] = useState<Departamento | null>(null);
  const [historialAsignaciones, setHistorialAsignaciones] = useState<Trabaja[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMiDepartamento = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await departamentoService.getMiDepartamento();
      
      setDepartamentoActual(data.departamento_actual);
      setHistorialAsignaciones(data.historial_asignaciones || []);
      
    } catch (e: any) {
      console.error('Error al cargar departamento:', e);
      setError(e.response?.data?.error || e.message || "Error al obtener información del departamento.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMiDepartamento();
  }, []);

  return {
    departamentoActual,
    historialAsignaciones,
    loading,
    error,
    reload: loadMiDepartamento,
  };
}