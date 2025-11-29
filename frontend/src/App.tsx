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

// ========================
// GERENTE - Inventarios
// ========================
import ProductosPage from "./pages/gerente/inventario/productos/pages/ProductosPage";
import CategoriasPage from "./pages/gerente/inventario/categorias/pages/CategoriasPage";
import MovimientosPage from "./pages/gerente/inventario/movimientos/pages/MovimientosPage";

/**
 * Dashboards temporales por rol
 * (Puedes reemplazarlos por tus propios componentes reales)
 */
const GerenteDashboard = () => (
  <div className="p-4">
    <h1 className="text-xl font-semibold">
      Dashboard GERENTE (reemplazar por tu componente real)
    </h1>
  </div>
);

const EmpleadoDashboard = () => (
  <div className="p-4">
    <h1 className="text-xl font-semibold">
      Dashboard EMPLEADO (reemplazar por tu componente real)
    </h1>
  </div>
);

const PropietarioDashboard = () => (
  <div className="p-4">
    <h1 className="text-xl font-semibold">
      Dashboard PROPIETARIO (reemplazar por tu componente real)
    </h1>
  </div>
);

// Componente para redirigir al dashboard según el rol
const NavigateToDashboard = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case "gerente":
      return <Navigate to="/gerente/dashboard" replace />;
    case "empleado":
      return <Navigate to="/empleado/dashboard" replace />;
    case "propietario":
      return <Navigate to="/propietario/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <Routes>
      {/* ================================================== */}
      {/* RUTAS PÚBLICAS (LOGIN / REGISTER / UNAUTHORIZED)   */}
      {/* ================================================== */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Ruta raíz - redirige al dashboard según el rol */}
      <Route path="/" element={<NavigateToDashboard />} />

      {/* ============================================================================ */}
      {/* RUTAS PROTEGIDAS envueltas en DashboardLayout                               */}
      {/* Todo lo que va dentro de path="/*" usa el mismo layout + ProtectedRoute     */}
      {/* ============================================================================ */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* =============================================== */}
        {/* RUTAS COMUNES A TODOS LOS ROLES (DENTRO LAYOUT) */}
        {/* =============================================== */}
        <Route path="perfil" element={<Perfil />} />

        {/* ============================== */}
        {/* RUTAS PARA ROL: GERENTE        */}
        {/* Prefix: /gerente/...           */}
        {/* ============================== */}
        <Route path="gerente/dashboard" element={<GerenteDashboard />} />

        {/* Inventarios - Gerente */}
        <Route
          path="gerente/inventarios/productos"
          element={<ProductosPage />}
        />
        <Route
          path="gerente/inventarios/categorias"
          element={<CategoriasPage />}
        />
        <Route
          path="gerente/inventarios/movimientos"
          element={<MovimientosPage />}
        />

        {/* Aquí luego puedes añadir más rutas del gerente, ej:
            <Route path="gerente/reportes" element={<ReportesGerente />} />
        */}

        {/* ============================== */}
        {/* RUTAS PARA ROL: EMPLEADO       */}
        {/* Prefix: /empleado/...          */}
        {/* ============================== */}
        <Route path="empleado/dashboard" element={<EmpleadoDashboard />} />
        {/* Ejemplos futuros:
            <Route path="empleado/ventas" element={<VentasEmpleado />} />
            <Route path="empleado/clientes" element={<ClientesEmpleado />} />
        */}

        {/* ============================== */}
        {/* RUTAS PARA ROL: PROPIETARIO    */}
        {/* Prefix: /propietario/...       */}
        {/* ============================== */}
        <Route
          path="propietario/dashboard"
          element={<PropietarioDashboard />}
        />
        {/* Ejemplos futuros:
            <Route path="propietario/reportes" element={<ReportesPropietario />} />
        */}

        {/* ===================================================== */}
        {/* Ruta por defecto dentro del layout protegido          */}
        {/* Si entras a /gerente, /empleado, etc sin path final,  */}
        {/* vuelve a decidir según el rol actual                  */}
        {/* ===================================================== */}
        <Route path="" element={<NavigateToDashboard />} />
      </Route>

      {/* ========================================= */}
      {/* RUTA 404 GLOBAL (TODO LO DEMÁS REDIRIGE)  */}
      {/* ========================================= */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
