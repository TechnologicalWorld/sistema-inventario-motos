// src/components/layout/Sidebar.tsx
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiChevronDown,
  FiChevronUp,
  FiHome,
  FiUsers,
  FiBox,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiUser,
  FiBriefcase,
  FiPackage,
  FiBarChart2,
  FiShoppingBag,
  FiTruck
} from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";

// Definición de tipos para los props
interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
}

interface SidebarDropdownProps {
  icon: React.ReactNode;
  label: string;
  open: boolean;
  onClick: () => void;
  items: Array<{
    label: string;
    to: string;
    icon?: React.ReactNode;
  }>;
}

interface DropdownItemProps {
  item: {
    label: string;
    to: string;
    icon?: React.ReactNode;
  };
}

// Componente para items del dropdown
function DropdownItem({ item }: DropdownItemProps) {
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) => {
        const baseClasses = "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 group";
        const activeClasses = "bg-white/20 text-white shadow-md border border-white/10";
        const inactiveClasses = "hover:bg-white/10 text-white/80 hover:text-white border border-transparent";
        
        return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
      }}
    >
      {({ isActive }) => (
        <>
          {item.icon && (
            <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
              {item.icon}
            </span>
          )}
          <span>{item.label}</span>
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar() {
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleName = (role: string) => {
    const roles: { [key: string]: string } = {
      'gerente': 'Gerente',
      'empleado': 'Empleado',
      'propietario': 'Propietario'
    };
    return roles[role] || role;
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-[#95051F] to-[#875260] text-white h-screen flex flex-col shadow-2xl">
      
      {/* Header con información del usuario */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#95051F] font-bold text-lg">
              SG
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-lg truncate">
              {user?.persona?.nombres} {user?.persona?.paterno}
            </h2>
            <p className="text-white/70 text-sm capitalize">
              {getRoleName(user?.role || '')}
            </p>
          </div>
        </div>
      </div>

      {/* Menú de Navegación */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <SidebarItem 
          icon={<FiHome className="text-lg" />} 
          label="Dashboard" 
          to="/dashboard" 
        />

        <SidebarItem 
          icon={<FiBriefcase className="text-lg" />} 
          label="Empresa" 
          to="/empresa" 
        />

        {/* GESTIÓN GENERAL */}
        <SidebarDropdown
          label="Gestión General"
          icon={<FiSettings className="text-lg" />}
          open={openMenus['gestion']}
          onClick={() => toggleMenu('gestion')}
          items={[
            { 
              label: "Proveedores", 
              to: "/proveedores", 
              icon: <FiTruck className="text-sm" />
            },
            { 
              label: "Clientes", 
              to: "/clientes", 
              icon: <FiUsers className="text-sm" />
            },
          ]}
        />

        {/* INVENTARIO */}
        <SidebarDropdown
          label="Inventario"
          icon={<FiPackage className="text-lg" />}
          open={openMenus['inventario']}
          onClick={() => toggleMenu('inventario')}
          items={[
            { 
              label: "Productos", 
              to: "/productos", 
              icon: <FiBox className="text-sm" />
            },
            { 
              label: "Categorías", 
              to: "/categorias", 
              icon: <FiPackage className="text-sm" />
            },
          ]}
        />

        {/* TRANSACCIONES */}
        <SidebarDropdown
          label="Transacciones"
          icon={<FiShoppingBag className="text-lg" />}
          open={openMenus['transacciones']}
          onClick={() => toggleMenu('transacciones')}
          items={[
            { 
              label: "Ventas", 
              to: "/ventas", 
              icon: <FiBarChart2 className="text-sm" />
            },
            { 
              label: "Compras", 
              to: "/compras", 
              icon: <FiShoppingBag className="text-sm" />
            },
          ]}
        />

        {/* REPORTES */}
        <SidebarDropdown
          label="Reportes"
          icon={<FiBarChart2 className="text-lg" />}
          open={openMenus['reportes']}
          onClick={() => toggleMenu('reportes')}
          items={[
            { 
              label: "Ventas", 
              to: "/reportes/ventas", 
              icon: <FiBarChart2 className="text-sm" />
            },
            { 
              label: "Compras", 
              to: "/reportes/compras", 
              icon: <FiShoppingBag className="text-sm" />
            },
          ]}
        />
      </nav>

      {/* Footer - Perfil y Cerrar Sesión */}
      <div className="p-4 border-t border-white/10 space-y-1 bg-white/5">
        <SidebarItem 
          icon={<FiUser className="text-lg" />} 
          label="Mi Perfil" 
          to="/perfil" 
        />
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-3 rounded-xl hover:bg-white/10 transition-all duration-200 text-white group"
        >
          <FiLogOut className="text-lg group-hover:scale-110 transition-transform" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}

// --------------------------------------------------------------------------------------

function SidebarItem({ icon, label, to }: SidebarItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => {
        const baseClasses = "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group";
        const activeClasses = "bg-white/20 text-white shadow-lg shadow-black/10 border border-white/10";
        const inactiveClasses = "hover:bg-white/10 text-white/90 hover:text-white border border-transparent";
        
        return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
      }}
    >
      {({ isActive }) => (
        <>
          <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
            {icon}
          </span>
          <span className="font-medium">{label}</span>
        </>
      )}
    </NavLink>
  );
}

function SidebarDropdown({ icon, label, open, onClick, items }: SidebarDropdownProps) {
  return (
    <div className="space-y-1">
      <button
        onClick={onClick}
        className="flex items-center justify-between w-full px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-200 text-white/90 hover:text-white border border-transparent hover:border-white/5 group"
      >
        <div className="flex items-center gap-3">
          <span className="transition-transform duration-200 group-hover:scale-105">
            {icon}
          </span>
          <span className="font-medium">{label}</span>
        </div>
        {open ? 
          <FiChevronUp className="transition-transform duration-200" /> : 
          <FiChevronDown className="transition-transform duration-200" />
        }
      </button>

      {open && (
        <div className="ml-4 space-y-1 border-l-2 border-white/20 pl-3 py-1">
          {items.map((item, index) => (
            <DropdownItem key={index} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}