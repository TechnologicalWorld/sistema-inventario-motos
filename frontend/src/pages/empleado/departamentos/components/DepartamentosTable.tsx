import React from "react";
import { FiEye, FiCalendar, FiRefreshCw } from "react-icons/fi";
import { DepartamentoAsignado, HistorialAsignacion } from "../services/empleado.departamento.service";

interface Props {
  departamentos: DepartamentoAsignado[];
  historial: HistorialAsignacion[];
  loading: boolean;
  error: string | null;
  onVerDetalle: (departamento: DepartamentoAsignado) => void;
  onRecargar: () => void;
}

function formatFecha(fechaIso: string) {
  const d = new Date(fechaIso);
  if (Number.isNaN(d.getTime())) return "-";
  const dia = d.getDate().toString().padStart(2, "0");
  const mes = (d.getMonth() + 1).toString().padStart(2, "0");
  const anio = d.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

const DepartamentosTable: React.FC<Props> = ({
  departamentos,
  historial,
  loading,
  error,
  onVerDetalle,
  onRecargar,
}) => {
  return (
    <div className="w-full">
      {/* Header título */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Mis Departamentos
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Departamentos asignados y historial de asignaciones
          </p>
        </div>
        
        <button
          onClick={onRecargar}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} />
          {loading ? "Cargando..." : "Actualizar"}
        </button>
      </div>

      {/* Mostrar error si existe */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Sección: Departamentos Actuales */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Departamentos Actualmente Asignados ({departamentos.length})
        </h2>
        
        {loading && departamentos.length === 0 ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando departamentos...</p>
          </div>
        ) : departamentos.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <p className="text-yellow-700">No tienes departamentos asignados actualmente.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departamentos.map((depto, idx) => (
              <div
                key={depto.departamento.idDepartamento}
                className="bg-white border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">
                      {depto.departamento.nombre}
                    </h3>
                    <p className="text-gray-600 text-sm">ID: {depto.departamento.idDepartamento}</p>
                  </div>
                  <button
                    onClick={() => onVerDetalle(depto)}
                    className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs hover:bg-indigo-700"
                    title="Ver detalle"
                  >
                    <FiEye />
                  </button>
                </div>
                
                <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                  {depto.departamento.descripcion}
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiCalendar size={14} />
                    <span>Asignado desde: {formatFecha(depto.fecha_asignacion)}</span>
                  </div>
                  {depto.observacion && (
                    <div className="bg-gray-50 p-2 rounded border border-gray-200">
                      <p className="text-gray-700 text-xs">
                        <span className="font-medium">Observación: </span>
                        {depto.observacion}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sección: Historial de Asignaciones */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Historial de Asignaciones ({historial.length})
        </h2>
        
        {historial.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <p className="text-gray-600">No hay historial de asignaciones.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Departamento</th>
                  <th className="px-4 py-3 text-left font-semibold">Fecha Asignación</th>
                  <th className="px-4 py-3 text-left font-semibold">Observación</th>
                  <th className="px-4 py-3 text-left font-semibold">Fecha Registro</th>
                </tr>
              </thead>
              <tbody>
                {historial.map((asignacion, idx) => (
                  <tr
                    key={`${asignacion.idDepartamento}-${asignacion.fecha}`}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{asignacion.departamento.nombre}</p>
                        <p className="text-gray-600 text-xs">ID: {asignacion.idDepartamento}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FiCalendar size={12} className="text-gray-500" />
                        {formatFecha(asignacion.fecha)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="max-w-xs truncate">{asignacion.observacion || "—"}</p>
                    </td>
                    <td className="px-4 py-3">
                      {formatFecha(asignacion.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Información adicional */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">Información</h3>
        <p className="text-blue-700 text-sm">
          • Los <strong>Departamentos Actuales</strong> son aquellos en los que actualmente estás asignado.<br/>
          • El <strong>Historial de Asignaciones</strong> muestra todas las asignaciones de departamento que has tenido.<br/>
          • Para cambios en tus asignaciones, contacta con el gerente o recursos humanos.
        </p>
      </div>
    </div>
  );
};

export default DepartamentosTable;