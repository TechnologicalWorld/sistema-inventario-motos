import dashboardService from "./dashboard.service";
import React, { useEffect, useState } from "react";
export default function DashboardGerente() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await dashboardService.getDashboard();
        console.log("Datos del dashboard:", data);
      } catch (err) {
        console.error("Error al cargar dashboard:", err);
        setError("Hubo un error al cargar los datos del dashboard.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
    return (<div>Dashboard Gerente</div>);
  }