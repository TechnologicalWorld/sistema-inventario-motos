// src/components/layout/DashboardLayout.tsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen bg-[#E7E1E0]">
      {/* Navbar fijo arriba */}
      <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Sidebar - debajo del navbar */}
      <div
        className={`
          fixed left-0 top-16 h-[calc(100vh-4rem)] z-40
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* En desktop: sidebar siempre visible, solo cambia ancho
            En mobile: se usa translate-x para mostrar/ocultar */}
        <Sidebar collapsed={!sidebarOpen} />
      </div>

      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Contenido principal */}
      <div
        className={`
          flex-1 min-w-0 transition-all duration-300 mt-16
          ${sidebarOpen ? "lg:ml-64" : "lg:ml-16"}
        `}
      >
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
