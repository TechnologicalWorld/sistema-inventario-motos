import React from "react";
import { FiX, FiCalendar, FiFileText, FiUsers } from "react-icons/fi";
import { DepartamentoAsignado } from "../services/empleado.departamento.service";

interface Props {
  departamento: DepartamentoAsignado | null;
  open: boolean;
  onClose: () => void;
}

function formatFecha(fechaIso: string) {
  const d = new Date(fechaIso);
  if (Number.isNaN(d.getTime())) return "-";
  const dia = d.getDate().toString().padStart(2, "0");
  const mes = (d.getMonth() + 1).toString().padStart(2, "0");
  const anio = d.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

const DepartamentoDetalleModal: React.FC<Props> = ({ departamento, open, onClose }) => {
  if (!open || !departamento) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
        {/* CABECERA */}
        <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">
              {departamento.departamento.nombre}
            </h2>
            <p className="text-blue-100 text-sm mt-1">Detalle del Departamento</p>
          </div>
          <button onClick={onClose} className="text-white hover:text-blue-200">
            <FiX size={24} />
          </button>
        </div>

        {/* CONTENIDO */}
        <div className="p-6 space-y-6">
          {/* Información del Departamento */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FiFileText className="text-blue-600" />
              Información del Departamento
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Nombre:</span>
                <span className="font-medium">{departamento.departamento.nombre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ID:</span>
                <span className="font-mono">{departamento.departamento.idDepartamento}</span>
              </div>
              <div>
                <span className="text-gray-600 block mb-1">Descripción:</span>
                <p className="text-gray-800 bg-white p-3 rounded border">
                  {departamento.departamento.descripcion}
                </p>
              </div>
            </div>
          </div>

          {/* Información de Asignación */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FiCalendar className="text-green-600" />
              Información de Asignación
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Fecha de Asignación:</span>
                <span className="font-medium">{formatFecha(departamento.fecha_asignacion)}</span>
              </div>
              <div>
                <span className="text-gray-600 block mb-1">Observación:</span>
                <p className="text-gray-800 bg-white p-3 rounded border">
                  {departamento.observacion || "Sin observación"}
                </p>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fecha de creación:</span>
                <span>{formatFecha(departamento.departamento.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Última actualización:</span>
                <span>{formatFecha(departamento.departamento.updated_at)}</span>
              </div>
            </div>
          </div>

          {/* Responsabilidades (puedes personalizar esto) */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FiUsers className="text-purple-600" />
              Responsabilidades Típicas
            </h3>
            <ul className="space-y-2">
              {departamento.departamento.nombre.includes("Venta") && (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Atención al cliente y ventas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Gestión de pedidos y facturación</span>
                  </li>
                </>
              )}
              {departamento.departamento.nombre.includes("Almacén") && (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Control de inventario</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Gestión de stock y almacenamiento</span>
                  </li>
                </>
              )}
              {departamento.departamento.nombre.includes("Marketing") && (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Desarrollo de campañas publicitarias</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Gestión de redes sociales</span>
                  </li>
                </>
              )}
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Colaboración con otros departamentos según sea necesario</span>
              </li>
            </ul>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartamentoDetalleModal;