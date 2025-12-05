import React from "react";
import { useMiDepartamento } from "../hooks/useMiDepartamento";
import {
  FiHome,
  FiCalendar,
  FiFileText,
  FiRefreshCw,
  FiUsers,
  FiBriefcase
} from "react-icons/fi";

const MiDepartamentoPage: React.FC = () => {
  const {
    departamentoActual,
    historialAsignaciones,
    loading,
    error,
    reload
  } = useMiDepartamento();

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando información del departamento...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button 
            onClick={reload}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            <FiRefreshCw />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Mi Departamento
          </h1>
          <p className="text-gray-600 mt-1">
            Información del departamento asignado y historial
          </p>
        </div>
        <button
          onClick={reload}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <FiRefreshCw />
          Actualizar
        </button>
      </div>

      {/* Historial de Asignaciones */}
      {historialAsignaciones.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Historial de Asignaciones
            </h2>
          </div>

          <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Fecha
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Departamento
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Observación
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {historialAsignaciones.map((asignacion, index) => (
                  <tr 
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-4 py-3 text-gray-700">
                      {new Date(asignacion.fecha).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">
                        {asignacion.departamento?.nombre || "Desconocido"}
                      </div>
                      <div className="text-sm text-gray-600">
                        {asignacion.departamento?.descripcion || ""}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {asignacion.observacion || "Sin observación"}
                    </td>
                    <td className="px-4 py-3">
                      {asignacion.departamento?.idDepartamento === departamentoActual?.idDepartamento ? (
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          Actual
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                          Histórico
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {historialAsignaciones.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No hay historial de asignaciones disponible
              </div>
            )}
          </div>

          {/* Resumen del historial */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              <strong>Nota:</strong> Este historial muestra todas las asignaciones de departamento 
              que has tenido durante tu tiempo en la empresa.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiDepartamentoPage;