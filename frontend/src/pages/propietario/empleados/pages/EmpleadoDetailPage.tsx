import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiEye } from "react-icons/fi";
import empleadosService from "../empleados.service";
import type { DesempenioResponse, Venta } from "../empleados.service";
import { useEmpleadosList } from "../hooks/useEmpleadosList";
import VentaDetalleModal from "../components/VentaDetalleModal";

const EmpleadoDetailPage: React.FC = () => {
  const { idEmpleado } = useParams<{ idEmpleado: string }>();
  const navigate = useNavigate();
  const { allEmpleados } = useEmpleadosList();

  const [data, setData] = useState<DesempenioResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ventaSeleccionada, setVentaSeleccionada] = useState<Venta | null>(null);
  const [modalVentaOpen, setModalVentaOpen] = useState(false);

  const currentEmpleado = useMemo(() => {
    if (!idEmpleado || !allEmpleados) return null;
    return allEmpleados.find((e) => e.id === parseInt(idEmpleado));
  }, [idEmpleado, allEmpleados]);

  const currentEmpleadoIndex = useMemo(() => {
    if (!currentEmpleado || !allEmpleados) return -1;
    return allEmpleados.findIndex((e) => e.id === currentEmpleado.id);
  }, [currentEmpleado, allEmpleados]);

  useEffect(() => {
    if (currentEmpleadoIndex >= 0) {
      setCurrentIndex(currentEmpleadoIndex);
    }
  }, [currentEmpleadoIndex]);

  useEffect(() => {
    if (!idEmpleado) {
      setError("ID de empleado no proporcionado");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await empleadosService.getDesempenio(parseInt(idEmpleado));
        console.log("Respuesta desempeño:", response);
        setData(response);
      } catch (err: any) {
        console.error("Error al cargar desempeño:", err);
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idEmpleado]);

  function formatFecha(fechaIso: string | undefined | null) {
    if (!fechaIso) return "—";
    const soloFecha = fechaIso.slice(0, 10);
    const [anio, mes, dia] = soloFecha.split("-");
    return `${dia}/${mes}/${anio}`;
  }

  const handleAnterior = () => {
    if (currentIndex > 0) {
      const prevEmpleado = allEmpleados[currentIndex - 1];
      navigate(`/propietario/empleados/${prevEmpleado.id}`);
    }
  };

  const handleSiguiente = () => {
    if (currentIndex < allEmpleados.length - 1) {
      const nextEmpleado = allEmpleados[currentIndex + 1];
      navigate(`/propietario/empleados/${nextEmpleado.id}`);
    }
  };

  const handleVerVenta = (venta: Venta) => {
    setVentaSeleccionada(venta);
    setModalVentaOpen(true);
  };

  return (
    <div className="w-full">
      {/* Título */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          Detalle de Empleado - {data?.empleado.persona.nombres}
        </h1>
      </div>

      {loading && (
        <div className="text-center py-10 text-gray-600">Cargando...</div>
      )}

      {error && (
        <div className="text-center py-10 text-red-600 bg-red-50 rounded-md p-4">
          {error}
        </div>
      )}

      {!loading && data && (
        <>
          {/* Resumen superior - 3 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-sm">
            {/* Info empleado */}
            <div className="bg-[#f0e7e2] border border-gray-300 rounded-md p-3">
              <div className="font-semibold mb-1">Nombre</div>
              <div>{data.empleado.persona.nombres} {data.empleado.persona.paterno} {data.empleado.persona.materno}</div>

              <div className="mt-2 flex justify-between">
                <span className="font-semibold">Contacto:</span>
                <span>{data.empleado.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Teléfono:</span>
                <span>{data.empleado.persona.telefono}</span>
              </div>
              <div className="mt-2">
                <div className="font-semibold mb-1">Dirección:</div>
                <div>{data.empleado.direccion || "—"}</div>
              </div>
            </div>

            {/* Estadísticas Generales */}
            <div className="bg-[#f0e7e2] border border-gray-300 rounded-md p-3">
              <div className="font-semibold mb-1">Total Ventas</div>
              <div className="text-lg font-semibold">
                {data.estadisticas.total_ventas}
              </div>
              <div className="mt-2 flex justify-between">
                <span className="font-semibold">Monto Total Ventas</span>
                <span>
                  Bs. {Number(data.estadisticas.monto_total_ventas).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Información adicional */}
            <div className="bg-[#f0e7e2] border border-gray-300 rounded-md p-3 grid grid-cols-2 gap-2">
              <div>
                <div className="font-semibold mb-1">Fecha Contratación</div>
                <div>{formatFecha(data.empleado.fecha_contratacion)}</div>
              </div>
              <div>
                <div className="font-semibold mb-1">Total Movimientos</div>
                <div className="text-lg font-semibold">
                  {data.estadisticas.total_movimientos}
                </div>
              </div>
            </div>
          </div>

          {/* Departamentos */}
          {data.empleado.departamentos &&
            data.empleado.departamentos.length > 0 && (
              <div className="bg-[#f0e7e2] border border-gray-300 rounded-md p-3 mb-4">
                <h3 className="text-sm font-bold text-gray-800 mb-2">
                  Departamentos Asignados
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.empleado.departamentos.map((dept) => (
                    <span
                      key={dept.idDepartamento}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium border border-gray-200"
                    >
                      {dept.nombre}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {/* Ventas Recientes */}
          {data.empleado.ventas && data.empleado.ventas.length > 0 && (
            <div>
              <h2 className="text-base md:text-lg font-semibold mb-2">
                Ventas Recientes
              </h2>

              <div className="bg-[#f3ebe7] border border-gray-300 rounded-md overflow-hidden mb-4">
                <table className="w-full text-xs md:text-sm">
                  <thead className="bg-gray-300">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">
                        ID Venta
                      </th>
                      <th className="px-4 py-2 text-left font-semibold">
                        Fecha
                      </th>
                      <th className="px-4 py-2 text-left font-semibold">
                        Monto Total
                      </th>
                      <th className="px-4 py-2 text-left font-semibold">
                        Método Pago
                      </th>
                      <th className="px-4 py-2 text-center font-semibold">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.empleado.ventas.map((venta, idx) => (
                      <tr
                        key={venta.idVenta}
                        className={
                          idx % 2 === 0
                            ? "bg-[#f8f2ee]"
                            : "bg-[#efe4dd]"
                        }
                      >
                        <td className="px-4 py-2">{venta.idVenta}</td>
                        <td className="px-4 py-2">{formatFecha(venta.fecha)}</td>
                        <td className="px-4 py-2">
                          Bs. {Number(venta.montoTotal).toFixed(2)}
                        </td>
                        <td className="px-4 py-2">{venta.metodoPago}</td>
                        <td className="px-4 py-2">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleVerVenta(venta)}
                              className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs hover:bg-indigo-700"
                              title="Ver detalles"
                            >
                              <FiEye />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Movimientos Recientes */}
          {data.empleado.movimientos &&
            data.empleado.movimientos.length > 0 && (
              <div>
                <h2 className="text-base md:text-lg font-semibold mb-2">
                  Movimientos de Inventario
                </h2>

                <div className="bg-[#f3ebe7] border border-gray-300 rounded-md overflow-hidden mb-4">
                  <table className="w-full text-xs md:text-sm">
                    <thead className="bg-gray-300">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold">
                          Tipo
                        </th>
                        <th className="px-4 py-2 text-left font-semibold">
                          Producto
                        </th>
                        <th className="px-4 py-2 text-center font-semibold">
                          Cantidad
                        </th>
                        <th className="px-4 py-2 text-left font-semibold">
                          Fecha
                        </th>
                        <th className="px-4 py-2 text-left font-semibold">
                          Observación
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.empleado.movimientos.map((mov, idx) => (
                        <tr
                          key={mov.idMovimiento}
                          className={
                            idx % 2 === 0
                              ? "bg-[#f8f2ee]"
                              : "bg-[#efe4dd]"
                          }
                        >
                          <td className="px-4 py-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                mov.tipo === "entrada"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {mov.tipo}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            {mov.producto?.nombre || "—"}
                          </td>
                          <td className="px-4 py-2 text-center">
                            {mov.cantidad}
                          </td>
                          <td className="px-4 py-2">{formatFecha(mov.fechaMovimiento)}</td>
                          <td className="px-4 py-2">{mov.observacion || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          {/* Navegación inferior */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-6">
            <button
              onClick={() => navigate("/propietario/empleados")}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-700 text-white text-sm hover:bg-gray-800"
            >
              <FiChevronLeft />
              Volver
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleAnterior}
                disabled={currentIndex <= 0}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#c0163b] text-white text-sm hover:bg-[#a41333] disabled:opacity-50"
              >
                <FiChevronLeft />
                Anterior
              </button>
              <button
                onClick={handleSiguiente}
                disabled={currentIndex >= allEmpleados.length - 1}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#c0163b] text-white text-sm hover:bg-[#a41333] disabled:opacity-50"
              >
                Siguiente
                <FiChevronRight />
              </button>
            </div>
          </div>

          {/* Modal detalle de venta */}
          <VentaDetalleModal
            open={modalVentaOpen}
            venta={ventaSeleccionada}
            onClose={() => setModalVentaOpen(false)}
          />
        </>
      )}
    </div>
  );
};

export default EmpleadoDetailPage;
