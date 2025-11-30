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
import DashboardPropietario from "./pages/propietario/dashboard/pages/DashboardPropietario";
// ========================
// GERENTE - Inventarios
// ========================
import ProductosPage from "./pages/gerente/inventario/productos/pages/ProductosPage";
import CategoriasPage from "./pages/gerente/inventario/categorias/pages/CategoriasPage";
import MovimientosPage from "./pages/gerente/inventario/movimientos/pages/MovimientosPage";
import VentasPage from "./pages/gerente/ventas/pages/VentasPage";
import ClientesPage from "./pages/gerente/clientes/pages/ClientesPage";
import ComprasPage from "./pages/gerente/compras/pages/ComprasPage";
import ProveedoresPage from "./pages/gerente/proveedores/pages/ProveedoresPage";
import EmpleadosPage from "./pages/gerente/empleados/pages/EmpleadosPage";
import DepartamentosPage from "./pages/gerente/departamentos/pages/DepartamentosPage";
import ClientesPagePro from "./pages/propietario/clientes/pages/ClientesPagePro";
import EmpresaPagePro from "./pages/propietario/empresa/pages/EmpresaPagePro";
import ProveedoresPagePro from "./pages/propietario/proveedores/pages/ProveedoresPagePro";
/**
 * Dashboards temporales por rol
 */
const GerenteDashboard = () => (
  <div className="p-4">
    <h1 className="text-xl font-semibold">Dashboard GERENTE</h1>
  </div>
);

const EmpleadoDashboard = () => (
  <div className="p-4">
    <h1 className="text-xl font-semibold">Dashboard EMPLEADO</h1>
  </div>
);

const PropietarioDashboard = () => (
  <div className="p-4">
    <h1 className="text-xl font-semibold">Dashboard PROPIETARIO</h1>
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
        <Route path="gerente/inventarios/productos" element={<ProductosPage />}/>
        <Route path="gerente/inventarios/categorias" element={<CategoriasPage />}/>
        <Route path="gerente/inventarios/movimientos" element={<MovimientosPage />}/>

        {/* Ventas - Gerente */}
        <Route path="gerente/ventas" element={<VentasPage />} />

        {/* Clientes - Gerente */}
        <Route path="gerente/clientes" element={<ClientesPage />} />

        {/* Compras - Gerente */}
        <Route path="gerente/compras" element={<ComprasPage />} />

        {/* Proveedores - Gerente */}
        <Route path="gerente/proveedores" element={<ProveedoresPage />} />

        {/* Empleados - Gerente */}
        <Route path="gerente/empleados" element={<EmpleadosPage />} />

        {/* Departamentos - Gerente */}
        <Route path="gerente/departamentos" element={<DepartamentosPage />} />

        {/* ============================== */}
        {/* RUTAS PARA ROL: EMPLEADO       */}
        {/* Prefix: /empleado/...          */}
        {/* ============================== */}
        <Route path="empleado/dashboard" element={<EmpleadoDashboard />} />

        {/* ============================== */}
        {/* RUTAS PARA ROL: PROPIETARIO    */}
        {/* Prefix: /propietario/...       */}
        {/* ============================== */}
        <Route path="propietario/dashboard" element={<DashboardPropietario />}/>
        <Route path="propietario/empresa" element={<EmpresaPagePro />}/>
        <Route path="propietario/proveedores" element={<ProveedoresPagePro/>}/>
        <Route path="propietario/clientes" element={<ClientesPagePro/>}/>
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
