import React from 'react';

const MiDepartamentoPageSimple: React.FC = () => {
  console.log("✅ MiDepartamentoPageSimple renderizado");
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green-600 mb-4">¡Funciona!</h1>
      <p>Página simple de departamentos del empleado</p>
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
        <p>Si ves esto, la ruta está funcionando correctamente.</p>
      </div>
    </div>
  );
};

export default MiDepartamentoPageSimple;