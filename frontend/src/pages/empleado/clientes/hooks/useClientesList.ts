import { useEffect, useState } from "react";
import clientesService, {
  Cliente,
} from "../services/empleado.clientes.service";

export interface ClienteConResumen extends Cliente {
  // Sin resumen de compras para el empleado
}

export function useClientesList() {
  const [clientes, setClientes] = useState<ClienteConResumen[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState("");

  const loadClientes = async (pageToLoad = 1, searchValue = search) => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Cargando clientes...', { pageToLoad, searchValue });

      const data = await clientesService.getClientes({
        page: pageToLoad,
        search: searchValue || undefined,
      });

      console.log('📊 Datos recibidos del service:', data);
      
      // VERIFICACIÓN: Asegurarnos que data.data existe
      if (!data || !data.data) {
        console.error('❌ data.data es undefined:', data);
        setError("Estructura de datos inesperada");
        return;
      }

      console.log('👥 Número de clientes recibidos:', data.data.length);
      console.log('📄 Primer cliente:', data.data[0]);

      // El empleado solo necesita los datos básicos, sin resumen de compras
      const clientesConResumen: ClienteConResumen[] = data.data.map((c) => ({
        ...c
      }));

      console.log('✅ Clientes procesados:', clientesConResumen);

      setClientes(clientesConResumen);
      setPage(data.current_page);
      setLastPage(data.last_page);
      
    } catch (e: any) {
      console.error('💥 Error al cargar clientes:', e);
      setError(e.message || "Error al obtener los clientes.");
    } finally {
      setLoading(false);
    }
  };

  const crearCliente = async (clienteData: {
    ci: string;
    paterno: string;
    materno: string;
    nombres: string;
    fecha_naci: string;
    genero: "M" | "F" | "O";
    telefono: string;
    nit?: string;
  }): Promise<boolean> => {
    try {
      setLoading(true);
      await clientesService.createCliente(clienteData);
      
      // Recargar la lista después de crear
      await loadClientes(1, search);
      return true;
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Error al crear el cliente.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const buscarClientePorCI = async (ci: string): Promise<Cliente | null> => {
    try {
      return await clientesService.buscarPorCI(ci);
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  useEffect(() => {
    loadClientes(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    clientes,
    loading,
    error,
    page,
    lastPage,
    search,
    setSearch,
    loadClientes,
    setPage,
    crearCliente,
    buscarClientePorCI,
  };
}