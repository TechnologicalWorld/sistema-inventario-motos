// empresa/hooks/useEmpresa.ts
import { useState, useEffect } from "react";
import empresaService, { Empresa, EmpresaUpdatePayload } from "../empresa.service";

export function useEmpresa() {
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEmpresa = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await empresaService.getEmpresa();
      setEmpresa(data);
    } catch (err) {
      console.error("Error al cargar empresa:", err);
      setError("No se pudo cargar la información de la empresa.");
    } finally {
      setLoading(false);
    }
  };

  const updateEmpresa = async (payload: EmpresaUpdatePayload) => {
    try {
      setLoading(true);
      setError(null);
      const updated = await empresaService.updateEmpresa(payload);
      setEmpresa(updated);
      return { success: true, message: "Datos actualizados correctamente." };
    } catch (err) {
      console.error("Error al actualizar empresa:", err);
      setError("No se pudieron guardar los cambios.");
      return { success: false, message: "Error al guardar los cambios." };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmpresa();
  }, []);

  return {
    empresa,
    loading,
    error,
    updateEmpresa,
  };
}