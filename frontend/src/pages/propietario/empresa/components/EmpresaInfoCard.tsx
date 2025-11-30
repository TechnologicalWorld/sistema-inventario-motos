import React from "react";
import { Empresa } from "../empresa.service";
import { FaPhoneAlt, FaRegEnvelope, FaBuilding } from "react-icons/fa";

interface Props {
  empresa: Empresa;
  onEditClick: () => void;
}

const EmpresaInfoCard: React.FC<Props> = ({ empresa, onEditClick }) => {
  return (
    <div className="flex justify-center px-4 py-8 overflow-y-auto">
      <div className="bg-[#f5ede8] rounded-md shadow-md border border-gray-300 p-6 max-w-4xl w-full">
        {/* Títuloooooooo */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Perfil de la Empresa — Información general
        </h2>

        <div className="flex flex-col md:flex-row gap-6">

          <div className="bg-white p-4 rounded-md shadow-sm w-full md:w-1/3">
            <div className="text-center mb-4">
              <FaBuilding className="text-7xl text-blue-600 mx-auto mb-2" />
              <div className="font-bold text-lg">{empresa.nombre}</div>
              <div className="text-sm text-gray-600">EMPRESA</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FaPhoneAlt className="text-gray-500" />
                <span>{empresa.telefono}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaRegEnvelope className="text-gray-500" />
                <span>{empresa.logo || "LOGOEMPRESARIAL"}</span>
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Información</h3>
              <div className="mb-4">
                <p className="text-sm text-gray-700">
                  <strong>Misión:</strong> {empresa.mision}
                </p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-700">
                  <strong>Visión:</strong> {empresa.vision}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-700">
                  <strong>Logo:</strong> {empresa.logo || "LOGOEMPRESARIAL"}
                </p>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-center">
              <button
                onClick={onEditClick}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm transition"
              >
                Editar Datos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpresaInfoCard;
