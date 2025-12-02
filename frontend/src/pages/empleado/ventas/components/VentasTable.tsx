import React from "react";
import {
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiShoppingCart,
  FiUsers
} from "react-icons/fi";
import { Venta } from "../services/empleado.ventas.service";
import { useNavigate } from "react-router-dom";

interface Props {
  ventas: Venta[];
  loading: boolean;
  error: string | null;
  page: number;
  lastPage: number;
  search: string;
  setSearch: (value: string) => void;
  onSearch: () => void;
  onChangePage: (page: number) => void;
  onVerDetalle: (venta: Venta) => void;
  onRegistrarVenta: () => void;
}

function formatFecha(fechaIso: string) {
  const d = new Date(fechaIso);
  if (Number.isNaN(d.getTime())) return "-";
  const dia = d.getDate().toString().padStart(2, "0");
  const mes = (d.getMonth() + 1).toString().padStart(2, "0");
  const anio = d.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

// FUNCIÓN para convertir string a number de forma segura
function parseNumber(value: any): number {
  if (value === null || value === undefined) return 0;
  
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  
  // Verificar si es un número válido
  if (isNaN(num)) {
    console.warn("Valor no numérico encontrado:", value);
    return 0;
  }
  
  return num;
}

// FUNCIÓN para formatear montos
function formatMonto(monto: any): string {
  const num = parseNumber(monto);
  return `Bs. ${num.toFixed(2)}`;
}

const VentasTable: React.FC<Props> = ({
  ventas = [],
  loading,
  error,
  page,
  lastPage,
  search,
  setSearch,
  onSearch,
  onChangePage,
  onVerDetalle,
  onRegistrarVenta,
}) => {
  const navigate = useNavigate();

  const handleBuscarClick = () => {
    onSearch();
  };

  const handleIrAClientes = () => {
    navigate("/empleado/clientes");
  };

  // FUNCIÓN SEGURA para calcular items
  const calcularTotalItems = (venta: Venta): number => {
    try {
      // Usar detalle_ventas (con guión bajo)
      const detalles = venta.detalle_ventas;
      if (!detalles || !Array.isArray(detalles)) {
        return 0;
      }
      
      return detalles.reduce(
        (sum: number, item: any) => sum + (item.cantidad || 0), 0
      );
    } catch (error) {
      console.warn("Error calculando total items:", error);
      return 0;
    }
  };

  // FUNCIÓN SEGURA para obtener nombre del cliente
  const obtenerNombreCliente = (venta: Venta): string => {
    try {
      if (!venta.cliente) return "Cliente no registrado";
      
      const persona = venta.cliente.persona;
      if (!persona) return "Cliente sin información";
      
      return `${persona.nombres || ''} ${persona.paterno || ''}`.trim();
    } catch (error) {
      return "Error cargando cliente";
    }
  };

  // VALIDAR que ventas sea un array
  const ventasArray = Array.isArray(ventas) ? ventas : [];

  return (
    <div className="w-full">
      {/* Header título */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Gestión de Ventas - Empleado
          </h1>
        </div>
        
        {/* Botones de acción */}
        <div className="flex gap-3">
          <button
            onClick={handleIrAClientes}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            title="Ir a gestión de clientes"
          >
            <FiUsers />
            Agregar Cliente
          </button>
          
          <button
            onClick={onRegistrarVenta}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <FiShoppingCart />
            Registrar Venta
          </button>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-5">
        <div className="flex flex-wrap items-center gap-3 justify-start">
          <div className="flex items-stretch">
            <div className="flex items-center bg-white border border-gray-400 rounded-l-full px-3 py-1.5 min-w-[260px]">
              <span className="text-gray-500 mr-2">
                <FiSearch />
              </span>
              <input
                type="text"
                placeholder="Buscar por ID venta, cliente..."
                className="flex-1 text-sm outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleBuscarClick()}
              />
            </div>
            <button
              onClick={handleBuscarClick}
              className="px-5 py-1.5 rounded-r-full bg-black text-white text-sm hover:bg-gray-900 transition -ml-px"
            >
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de ventas */}
      <div className="bg-[#f3ebe7] border border-gray-300 rounded-md overflow-hidden">
        <table className="w-full text-xs md:text-sm">
          <thead className="bg-gray-300">
            <tr className="text-left">
              <th className="px-4 py-2 font-semibold">ID Venta</th>
              <th className="px-4 py-2 font-semibold">Fecha</th>
              <th className="px-4 py-2 font-semibold">Cliente</th>
              <th className="px-4 py-2 font-semibold">Método Pago</th>
              <th className="px-4 py-2 font-semibold">Monto Total</th>
              <th className="px-4 py-2 font-semibold">Items</th>
              <th className="px-4 py-2 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-600">
                  Cargando ventas...
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={7} className="text-center py-6 text-red-600">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && ventasArray.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-600">
                  No hay ventas registradas.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              ventasArray.map((venta, idx) => {
                // VALIDAR que venta existe
                if (!venta) return null;
                
                const nombreCliente = obtenerNombreCliente(venta);
                const totalItems = calcularTotalItems(venta);
                const idVenta = venta.idVenta || 0;

                return (
                  <tr
                    key={idVenta}
                    className={idx % 2 === 0 ? "bg-[#f8f2ee]" : "bg-[#efe4dd]"}
                  >
                    <td className="px-4 py-2 font-medium">
                      V-{idVenta.toString().padStart(4, "0")}
                    </td>
                    <td className="px-4 py-2">
                      {venta.fecha ? formatFecha(venta.fecha) : "-"}
                    </td>
                    <td className="px-4 py-2">{nombreCliente}</td>
                    <td className="px-4 py-2 capitalize">
                      {venta.metodoPago || "-"}
                    </td>
                    <td className="px-4 py-2 font-medium">
                      {formatMonto(venta.montoTotal)}
                    </td>
                    <td className="px-4 py-2 text-center">{totalItems}</td>
                    <td className="px-4 py-2">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onVerDetalle(venta)}
                          className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs hover:bg-indigo-700"
                          title="Ver detalle de venta"
                        >
                          <FiEye />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="mt-5 flex items-center justify-center gap-4">
        <button
          disabled={page <= 1}
          onClick={() => onChangePage(page - 1)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm ${
            page <= 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-white text-gray-800 hover:bg-gray-100"
          }`}
        >
          <FiChevronLeft />
          <span>Anterior</span>
        </button>

        <span className="text-sm text-gray-700">
          Página {page} de {lastPage}
        </span>

        <button
          disabled={page >= lastPage}
          onClick={() => onChangePage(page + 1)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm ${
            page >= lastPage
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-white text-gray-800 hover:bg-gray-100"
          }`}
        >
          <span>Siguiente</span>
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default VentasTable;