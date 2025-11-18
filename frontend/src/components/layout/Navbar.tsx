// src/components/layout/Navbar.tsx
import { FiMenu, FiX, FiUser } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";

interface NavbarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function Navbar({ sidebarOpen, toggleSidebar }: NavbarProps) {
  const { user, logout } = useAuth();
  
  const getRoleName = (role: string) => {
    const roles: { [key: string]: string } = {
      'gerente': 'Gerente',
      'empleado': 'Empleado',
      'propietario': 'Propietario'
    };
    return roles[role] || role;
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#202129] text-white flex items-center justify-between px-6 shadow-lg border-b border-[#95051F] z-50">
      
      {/* Left Section - Sidebar Toggle */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-[#95051F] transition-colors duration-200"
          aria-label={sidebarOpen ? "Ocultar menú" : "Mostrar menú"}
        >
          {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>

        {/* Logo visible cuando sidebar está cerrado */}
        <div className="flex items-center gap-3 ml-4">
            <div className="w-10 h-10 bg-[#95051F] rounded-lg flex items-center justify-center font-bold text-white">
              SG
            </div>
            <span className="font-semibold text-lg">Sistema Gestión</span>
          </div>

      </div>


      {/* Right Section - User Info & Actions */}
      <div className="flex items-center gap-4">
        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-[#875260]">
          <div className="text-right">
            <p className="font-semibold text-sm">
              {user?.persona?.nombres} {user?.persona?.paterno}
            </p>
            <p className="text-xs text-gray-300">
              {getRoleName(user?.role || '')}
            </p>
          </div>
          
          <div className="relative group">
            <button className="w-10 h-10 bg-[#95051F] rounded-full flex items-center justify-center text-white font-semibold hover:bg-[#875260] transition-colors duration-200">
              {user?.persona?.nombres?.charAt(0)}{user?.persona?.paterno?.charAt(0)}
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 top-12 w-48 bg-[#2a2b33] rounded-xl shadow-lg border border-[#875260] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="p-2">
                <a 
                  href="/perfil" 
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#95051F] transition-colors duration-200"
                >
                  <FiUser size={16} />
                  <span>Mi Perfil</span>
                </a>
                <button 
                  onClick={logout}
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 text-red-200 hover:text-white"
                >
                  <FiUser size={16} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}