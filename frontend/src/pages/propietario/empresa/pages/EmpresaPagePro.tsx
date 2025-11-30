// empresa/pages/EmpresaPagePro.tsx
import React, { useState } from "react";
import { useEmpresa } from "../hooks/useEmpresa";
import EmpresaInfoCard from "../components/EmpresaInfoCard";
import EmpresaEditModal from "../components/EmpresaEditModal";

const EmpresaPagePro: React.FC = () => {
  const { empresa, loading, error, updateEmpresa } = useEmpresa();
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async (data: any) => {
    const result = await updateEmpresa(data);
    if (result.success) {
      alert(result.message); // O usa un toast si tienes uno
    }
    return result;
  };

  if (loading) return <div className="p-6 text-center">Cargando...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!empresa) return <div className="p-6 text-center">No se encontró la empresa.</div>;

  return (
    <div className="p-6">
      <EmpresaInfoCard
        empresa={empresa}
        onEditClick={() => setIsEditing(true)}
      />

      <EmpresaEditModal
        empresa={empresa}
        open={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default EmpresaPagePro;