import React from "react";
import { FiChevronLeft } from "react-icons/fi";
import { ClienteConResumen } from "../hooks/useClientesList";

interface Props {
  cliente: ClienteConResumen;
  onVolver: () => void;
}

const ClienteDetailView: React.FC<Props> = ({ cliente, onVolver }) => {
  const persona = cliente.persona;
  const nombreCompleto = `${persona.nombres} ${persona.paterno} ${persona.materno}`;
  const fechaNacimiento = new Date(persona.fecha_naci).toLocaleDateString();
  const fechaRegistro = new Date(cliente.created_at).toLocaleDateString();

  return (
    <div className="w-full">
      {/* Encabezado principal */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          Detalle de Cliente - {nombreCompleto}
        </h1>
      </div>

      {/* Información del cliente */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-gray-300 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Información Personal</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Nombre completo:</span>
              <span>{nombreCompleto}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">CI:</span>
              <span>{persona.ci}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">NIT:</span>
              <span>{cliente.nit || "No registrado"}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Teléfono:</span>
              <span>{persona.telefono}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Información Adicional</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Fecha de nacimiento:</span>
              <span>{fechaNacimiento}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Género:</span>
              <span className="capitalize">
                {persona.genero === 'M' ? 'Masculino' : persona.genero === 'F' ? 'Femenino' : 'Otro'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Fecha de registro:</span>
              <span>{fechaRegistro}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nota para el empleado */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-800 text-sm">
          <strong>Nota:</strong> Como empleado, solo puedes ver la información básica del cliente. 
          El historial de compras y estadísticas avanzadas están disponibles para gerentes.
        </p>
      </div>

      {/* Botón volver */}
      <div className="flex justify-start">
        <button
          onClick={onVolver}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-700 text-white text-sm hover:bg-gray-800"
        >
          <FiChevronLeft />
          Volver a la lista
        </button>
      </div>
    </div>
  );
};

export default ClienteDetailView;