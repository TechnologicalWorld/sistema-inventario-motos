// src/pages/auth/Unauthorized.tsx
import { useAuth } from "../../hooks/useAuth";

export const Unauthorized = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso No Autorizado</h1>
        <p className="text-gray-600 mb-4">
          No tienes permisos para acceder a esta página.
        </p>
        <p className="text-gray-500 mb-6">
          Tu rol actual es: <strong>{user?.role}</strong>
        </p>
        <button
          onClick={logout}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};