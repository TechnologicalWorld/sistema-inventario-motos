// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// Pages de Auth
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { Unauthorized } from "./pages/auth/Unauthorized";

// Layout
import DashboardLayout from "./components/layout/Layout";
import { Perfil } from "./services/shared/Perfil";

// Pages dentro del dashboard
// Importa otras páginas que necesites...
// import { Dashboard } from "./pages/dashboard/Dashboard";
// import { Productos } from "./pages/inventario/Productos";

// Componente para redirigir al dashboard según el rol
const NavigateToDashboard = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;
  
  switch (user.role) {
    case 'gerente':
      return <Navigate to="/gerente/dashboard" replace />;
    case 'empleado':
      return <Navigate to="/empleado/dashboard" replace />;
    case 'propietario':
      return <Navigate to="/propietario/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* Ruta raíz - redirige al dashboard según el rol */}
      <Route path="/" element={<NavigateToDashboard />} />
      
      {/* ============================================================================ */}
      {/* RUTAS PROTEGIDAS CON DASHBOARD LAYOUT */}
      {/* ============================================================================ */}
      <Route path="/*" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        {/* Rutas específicas dentro del dashboard layout */}
        <Route path="perfil" element={<Perfil />} />
        
        {/* Aquí puedes agregar más rutas que usen el mismo layout */}
        {/* <Route path="dashboard" element={<Dashboard />} /> */}
        {/* <Route path="productos" element={<Productos />} /> */}
        {/* <Route path="clientes" element={<Clientes />} /> */}
        
        {/* Ruta por defecto dentro del layout */}
        <Route path="" element={<NavigateToDashboard />} />
      </Route>
      
      {/* Ruta 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;