// src/components/common/LoadingSpinner.tsx
import React from "react";

const LoadingSpinner: React.FC<{ mensaje?: string }> = ({ mensaje }) => {
  return (
    <div className="w-full flex items-center justify-center py-10">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800 mx-auto" />
        <p className="mt-3 text-sm text-gray-700">
          {mensaje || "Cargando..."}
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
