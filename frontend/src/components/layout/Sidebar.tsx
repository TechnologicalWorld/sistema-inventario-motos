// src/components/layout/Sidebar.tsx
import { useState, useRef } from "react";
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
  FiTruck,
} from "react-icons/fi";

import { useAuth } from "../../hooks/useAuth";
import type { UserRole } from "../../types/auth";
import marcaRuedas from "../../assets/marca_ruedas.png";

// -------------------- Tipos --------------------

interface SidebarProps {
  collapsed: boolean;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  to?: string;
  children?: Array<{
    label: string;
    to: string;
    icon?: React.ReactNode;
  }>;
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

// -------------------- Items para sidebar expandido --------------------

function DropdownItem({ item }: DropdownItemProps) {
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) => {
        const baseClasses =
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 group";
        const activeClasses =
          "bg-white/20 text-white shadow-md border border-white/10";
        const inactiveClasses =
          "hover:bg-white/10 text-white/80 hover:text-white border border-transparent";

        return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
      }}
    >
      {({ isActive }) => (
        <>
          {item.icon && (
            <span
              className={`transition-transform duration-200 ${
                isActive ? "scale-110" : "group-hover:scale-105"
              }`}
            >
              {item.icon}
            </span>
          )}
          <span>{item.label}</span>
        </>
      )}
    </NavLink>
  );
}

function SidebarItem({ icon, label, to }: SidebarItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => {
        const baseClasses =
          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group";
        const activeClasses =
          "bg-white/20 text-white shadow-lg shadow-black/10 border border-white/10";
        const inactiveClasses =
          "hover:bg-white/10 text-white/90 hover:text-white border border-transparent";

        return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
      }}
    >
      {({ isActive }) => (
        <>
          <span
            className={`transition-transform duration-200 ${
              isActive ? "scale-110" : "group-hover:scale-105"
            }`}
          >
            {icon}
          </span>
          <span className="font-medium">{label}</span>
        </>
      )}
    </NavLink>
  );
}

function SidebarDropdown({
  icon,
  label,
  open,
  onClick,
  items,
}: SidebarDropdownProps) {
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
        {open ? (
          <FiChevronUp className="transition-transform duration-200" />
        ) : (
          <FiChevronDown className="transition-transform duration-200" />
        )}
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

// -------------------- Menús por rol --------------------

const propietarioMenu: MenuItem[] = [
  {
    id: "prop-dashboard",
    label: "Dashboard",
    icon: <FiHome className="text-lg" />,
    to: "/dashboard",
  },
  {
    id: "prop-empresa",
    label: "Empresa",
    icon: <FiBriefcase className="text-lg" />,
    to: "/propietario/empresa",
  },
  {
    id: "prop-gestion",
    label: "Gestión General",
    icon: <FiSettings className="text-lg" />,
    children: [
      {
        label: "Proveedores",
        to: "/propietario/proveedores",
        icon: <FiTruck className="text-sm" />,
      },
      {
        label: "Clientes",
        to: "/propietario/clientes",
        icon: <FiUsers className="text-sm" />,
      },
    ],
  },
  {
    id: "prop-inventario",
    label: "Inventario",
    icon: <FiPackage className="text-lg" />,
    children: [
      {
        label: "Productos",
        to: "/productos",
        icon: <FiBox className="text-sm" />,
      },
      {
        label: "Categorías",
        to: "/categorias",
        icon: <FiPackage className="text-sm" />,
      },
    ],
  },
  {
    id: "prop-transacciones",
    label: "Transacciones",
    icon: <FiShoppingBag className="text-lg" />,
    children: [
      {
        label: "Ventas",
        to: "/ventas",
        icon: <FiBarChart2 className="text-sm" />,
      },
      {
        label: "Compras",
        to: "/compras",
        icon: <FiShoppingBag className="text-sm" />,
      },
    ],
  },
  {
    id: "prop-reportes",
    label: "Reportes",
    icon: <FiBarChart2 className="text-lg" />,
    children: [
      {
        label: "Ventas",
        to: "/reportes/ventas",
        icon: <FiBarChart2 className="text-sm" />,
      },
      {
        label: "Compras",
        to: "/reportes/compras",
        icon: <FiShoppingBag className="text-sm" />,
      },
    ],
  },
];

const gerenteMenu: MenuItem[] = [
  {
    id: "ger-dashboard",
    label: "Dashboard",
    icon: <FiHome className="text-lg" />,
    to: "/gerente/dashboard",
  },
  {
    id: "ger-inventarios",
    label: "Inventarios",
    icon: <FiPackage className="text-lg" />,
    children: [
      {
        label: "Productos",
        to: "/gerente/inventarios/productos",
        icon: <FiBox className="text-sm" />,
      },
      {
        label: "Categorías",
        to: "/gerente/inventarios/categorias",
        icon: <FiPackage className="text-sm" />,
      },
      {
        label: "Movimientos",
        to: "/gerente/inventarios/movimientos",
        icon: <FiPackage className="text-sm" />,
      },
    ],
  },
  {
    id: "ger-ventas",
    label: "Ventas",
    icon: <FiBarChart2 className="text-lg" />,
    to: "/gerente/ventas",
  },
  {
    id: "ger-clientes",
    label: "Clientes",
    icon: <FiUsers className="text-lg" />,
    to: "/gerente/clientes",
  },
  {
    id: "ger-compras",
    label: "Compras",
    icon: <FiShoppingBag className="text-lg" />,
    to: "/gerente/compras",
  },
  {
    id: "ger-proveedores",
    label: "Proveedores",
    icon: <FiTruck className="text-lg" />,
    to: "/gerente/proveedores",
  },
  {
    id: "ger-empleados",
    label: "Empleados",
    icon: <FiUsers className="text-lg" />,
    to: "/gerente/empleados",
  },
  {
    id: "ger-departamentos",
    label: "Departamentos",
    icon: <FiBriefcase className="text-lg" />,
    to: "/gerente/departamentos",
  },
  {
    id: "ger-reportes",
    label: "Reportes",
    icon: <FiFileText className="text-lg" />,
    children: [
      {
        label: "Ventas",
        to: "/gerente/reportes/ventas",
        icon: <FiBarChart2 className="text-sm" />,
      },
      {
        label: "Compras",
        to: "/gerente/reportes/compras",
        icon: <FiShoppingBag className="text-sm" />,
      },
      {
        label: "Inventario",
        to: "/gerente/reportes/inventario",
        icon: <FiPackage className="text-sm" />,
      },
    ],
  },
];

const empleadoMenu: MenuItem[] = [
  {
    id: "emp-dashboard",
    label: "Dashboard",
    icon: <FiHome className="text-lg" />,
    to: "/empleado/dashboard",
  },
  {
    id: "emp-inventario",
    label: "Inventario",
    icon: <FiPackage className="text-lg" />,
    to: "/empleado/inventario",
  },
  {
    id: "emp-ventas",
    label: "Ventas",
    icon: <FiBarChart2 className="text-lg" />,
    to: "/empleado/ventas",
  },
  {
    id: "emp-clientes",
    label: "Clientes",
    icon: <FiUsers className="text-lg" />,
    to: "/empleado/clientes",
  },
  
  {
    id: "emp-movimientos",
    label: "Movimientos",
    icon: <FiPackage className="text-lg" />,
    to: "/empleado/movimientos",
  },
  {
    id: "emp-departamento",
    label: "Departamento",
    icon: <FiBriefcase className="text-lg" />,
    to: "/empleado/mi-departamento",
  },
];

// ------------- Componentes para sidebar colapsado -------------

function CollapsedSimpleItem({ item }: { item: MenuItem }) {
  return (
    <NavLink
      to={item.to!}
      className={({ isActive }) =>
        `w-10 h-10 flex items-center justify-center rounded-xl border transition-all duration-200 ${
          isActive
            ? "bg-white/20 border-white/80 text-white"
            : "border-white/20 text-white/90 hover:bg-white/10"
        }`
      }
    >
      {item.icon}
      <span className="sr-only">{item.label}</span>
    </NavLink>
  );
}

function CollapsedParentItem({ item }: { item: MenuItem }) {
  const [open, setOpen] = useState(false);
  const [top, setTop] = useState(0);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const handleToggle = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();

      const OFFSET = 65; 
      const newTop = Math.max(8, rect.top - OFFSET);

      setTop(newTop);
    }
    setOpen((prev) => !prev);
  };

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleToggle}
        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/10"
      >
        {item.icon}
      </button>

      {open && (
        <div
          className="fixed left-16 bg-[#202129] rounded-xl shadow-xl border border-[#875260] z-50 min-w-[190px]"
          style={{ top }}
          onMouseLeave={() => setOpen(false)}
        >
          <p className="px-3 pt-2 pb-1 text-xs font-semibold text-gray-200">
            {item.label}
          </p>
          <div className="py-1">
            {item.children?.map((child, idx) => (
              <NavLink
                key={idx}
                to={child.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors duration-150 ${
                    isActive
                      ? "bg-[#95051F] text-white"
                      : "text-gray-200 hover:bg-[#333444]"
                  }`
                }
              >
                {child.icon && <span>{child.icon}</span>}
                <span>{child.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </>
  );
}


// -------------------- Sidebar principal --------------------

export default function Sidebar({ collapsed }: SidebarProps) {
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const { user, logout, getRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const roleFromContext = user?.role ?? getRole();
  const role: UserRole = (roleFromContext as UserRole) || "propietario";

  let currentMenu: MenuItem[] = propietarioMenu;
  if (role === "gerente") currentMenu = gerenteMenu;
  if (role === "empleado") currentMenu = empleadoMenu;

  // ---------- Sidebar EXPANDIDO ----------
  const renderExpanded = () => (
    <>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar">
        {currentMenu.map((item) =>
          item.children ? (
            <SidebarDropdown
              key={item.id}
              label={item.label}
              icon={item.icon}
              open={!!openMenus[item.id]}
              onClick={() =>
                setOpenMenus((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
              }
              items={item.children}
            />
          ) : (
            item.to && (
              <SidebarItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                to={item.to}
              />
            )
          )
        )}
      </nav>

      {/* Footer - Mi Perfil & Cerrar Sesión */}
      <div className="p-4 border-t border-white/10 space-y-2 bg-white/5">
        <SidebarItem
          icon={<FiUser className="text-lg" />}
          label="Mi Perfil"
          to="/perfil"
        />
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-200 text-white group border border-transparent hover:border-white/10"
        >
          <FiLogOut className="text-lg group-hover:scale-110 transition-transform" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </>
  );

  // ---------- Sidebar COLAPSADO ----------
  const renderCollapsed = () => (
    <>
      <nav className="flex-1 py-4 flex flex-col items-center gap-3 overflow-y-auto no-scrollbar">
        {currentMenu.map((item) =>
          item.children ? (
            <CollapsedParentItem key={item.id} item={item} />
          ) : (
            item.to && <CollapsedSimpleItem key={item.id} item={item} />
          )
        )}
      </nav>

      {/* Footer colapsado: iconos redondos */}
      <div className="p-3 border-t border-white/10 bg-white/5 flex flex-col items-center gap-3">
        <NavLink
          to="/perfil"
          className={({ isActive }) =>
            `w-10 h-10 flex items-center justify-center rounded-full border transition-all duration-200 ${
              isActive
                ? "bg-white text-[#95051F] border-white"
                : "border-white/40 text-white hover:bg-white/20"
            }`
          }
        >
          <FiUser className="text-lg" />
          <span className="sr-only">Mi Perfil</span>
        </NavLink>

        <button
          onClick={handleLogout}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-white/40 text-white hover:bg-white/20 transition-all duration-200"
        >
          <FiLogOut className="text-lg" />
          <span className="sr-only">Cerrar Sesión</span>
        </button>
      </div>
    </>
  );

  return (
    <aside
      className={`
        h-full bg-gradient-to-b from-[#CE0621] to-[#5E0017]
        text-white flex flex-col shadow-2xl
        transition-all duration-300
        ${collapsed ? "w-16" : "w-64"}
      `}
    >
      {/* Fondo con marca de ruedas */}
      <div
        className="pointer-events-none absolute bottom-25 left-0 w-full h-60 opacity-80"
        style={{
          backgroundImage: `url(${marcaRuedas})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Contenido del sidebar por encima de la imagen */}
      <div className="relative z-10 flex flex-col h-full">
        {collapsed ? renderCollapsed() : renderExpanded()}
      </div>
    </aside>
  );
}
