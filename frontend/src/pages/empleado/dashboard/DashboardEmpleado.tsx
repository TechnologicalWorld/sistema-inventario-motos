import empleadoDashboardService, { EmpleadoDashboardData } from "./dashboard.service";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Calendar,
  AlertCircle,
  Award
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

export default function DashboardEmpleado() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<EmpleadoDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [showFilters, setShowFilters] = useState(false);

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const loadDashboard = async () => {
    if (!user?.persona.idPersona) {
      setError("No se pudo obtener el ID del usuario");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log("🔄 Cargando dashboard para empleado:", user.persona.idPersona, "Mes:", mes, "Año:", anio);
      const data = await empleadoDashboardService.getDashboard({
        iduser: user.persona.idPersona,
        anio,
        mes
      });
      
      console.log("✅ Datos del dashboard cargados:", data);
      setDashboardData(data);
    } catch (err) {
      console.error("❌ Error al cargar dashboard:", err);
      setError("Hubo un error al cargar los datos del dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.persona.idPersona) {
      loadDashboard();
    }
  }, [user?.persona.idPersona]);

  const handleFilter = () => {
    loadDashboard();
    setShowFilters(false);
  };

  const NoDataMessage = ({ message }: { message: string }) => (
    <div className="flex items-center justify-center h-64 text-gray-500">
      <div className="text-center">
        <AlertCircle className="mx-auto mb-2" size={48} />
        <p>{message}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#C1121F] border-solid mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <AlertCircle className="text-[#C1121F] mx-auto mb-4" size={48} />
          <p className="text-gray-700 text-lg mb-4">{error}</p>
          <button 
            onClick={loadDashboard}
            className="bg-[#C1121F] hover:bg-[#A00F1A] text-white px-6 py-2 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <p className="text-gray-700 text-lg">No hay datos disponibles</p>
      </div>
    );
  }

  console.log("📊 Preparando datos para gráficos...");
  console.log("ventas_por_producto:", dashboardData.ventas_por_producto);
  console.log("ventas_por_mes:", dashboardData.ventas_por_mes);
  console.log("ventas_2024_con_cantidades:", dashboardData.ventas_2024_con_cantidades);

  const ventasPorProductoData = (dashboardData.ventas_por_producto || [])
    .slice(0, 10)
    .map((p: any) => ({
      nombre: p.nombre || 'Sin nombre',
      cantidad: parseFloat(p.CantidadVendida?.toString() || '0'), // ⚠️ CantidadVendida con mayúscula
      total: parseFloat(p.totalVendido?.toString() || '0') // ⚠️ totalVendido con minúscula
    }));

  const ventasPorMesData = (dashboardData.ventas_por_mes || [])
    .map((v: any) => ({
      mes: meses[(v.mes || 1) - 1] || `Mes ${v.mes}`,
      ventas: 1, 
      monto: parseFloat(v['sum(v.montoTotal)']?.toString() || '0') 
    }));

  const ventas2024Data = (dashboardData.ventas_2024_con_cantidades || [])
    .map((v: any) => ({
      mes: meses[(v.mes || 1) - 1] || `Mes ${v.mes}`,
      ventas: 1, 
      monto: parseFloat(v.TotalVendido?.toString() || '0'), 
      cantidad: parseFloat(v.CantidadVendida?.toString() || '0') 
    }));

  console.log("✅ Datos transformados:");
  console.log("ventasPorProductoData:", ventasPorProductoData);
  console.log("ventasPorMesData:", ventasPorMesData);
  console.log("ventas2024Data:", ventas2024Data);

  const COLORS = ['#C1121F', '#780000', '#FDF0D5', '#669BBC', '#003049', '#780116'];

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-6 pl-8">
      {/* Header */}
      <div className="w-full mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Mi Dashboard</h1>
            <p className="text-gray-600 text-lg">
              Rendimiento de {meses[mes - 1]} {anio}
            </p>
            {user?.persona?.nombres && (
              <p className="text-gray-500 mt-1">
                👤 {user.persona.nombres} {user.persona.paterno} {user.persona.materno}
              </p>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-[#C1121F] hover:bg-[#A00F1A] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all transform hover:scale-105 shadow-md"
          >
            <Calendar size={20} />
            Filtrar Período
          </button>
        </div>

        {/* Filtros */}
        {showFilters && (
          <div className="mt-6 bg-white rounded-xl p-6 shadow-lg border border-gray-200 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Mes</label>
                <select
                  value={mes}
                  onChange={(e) => setMes(parseInt(e.target.value))}
                  className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#C1121F] focus:border-transparent"
                >
                  {meses.map((m, i) => (
                    <option key={i} value={i + 1}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Año</label>
                <input
                  type="number"
                  value={anio}
                  onChange={(e) => setAnio(parseInt(e.target.value))}
                  className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#C1121F] focus:border-transparent"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleFilter}
                  className="w-full bg-[#C1121F] hover:bg-[#A00F1A] text-white px-6 py-2 rounded-lg transition-all transform hover:scale-105"
                >
                  Aplicar Filtro
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Ventas */}
        <div className="bg-gradient-to-br from-[#C1121F] to-[#780000] rounded-xl p-6 shadow-lg transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <ShoppingCart className="text-white" size={32} />
            <span className="text-red-100 text-sm font-medium">Ventas</span>
          </div>
          <div className="text-white">
            <div className="text-3xl font-bold mb-1">{dashboardData.ventas}</div>
            <div className="text-red-100 text-sm">Este período</div>
          </div>
        </div>

        {/* Total Vendido */}
        <div className="bg-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-all border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="text-[#669BBC]" size={32} />
            <span className="text-gray-600 text-sm font-medium">Total Vendido</span>
          </div>
          <div className="text-gray-900">
            <div className="text-3xl font-bold mb-1">
              ${parseFloat(dashboardData.total_vendido?.toString() || '0').toFixed(2)}
            </div>
            <div className="text-gray-600 text-sm">Ingresos generados</div>
          </div>
        </div>

        {/* Clientes Atendidos */}
        <div className="bg-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-all border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Users className="text-[#003049]" size={32} />
            <span className="text-gray-600 text-sm font-medium">Clientes</span>
          </div>
          <div className="text-gray-900">
            <div className="text-3xl font-bold mb-1">{dashboardData.clientes}</div>
            <div className="text-gray-600 text-sm">Atendidos</div>
          </div>
        </div>

        {/* Producto Más Vendido */}
        <div className="bg-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-all border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Award className="text-[#C1121F]" size={32} />
            <span className="text-gray-600 text-sm font-medium">Top Producto</span>
          </div>
          <div className="text-gray-900">
            <div className="text-lg font-bold mb-1 truncate">
              {dashboardData.producto_mas_vendido?.nombre || 'N/A'}
            </div>
            <div className="text-gray-600 text-sm">
              {dashboardData.producto_mas_vendido?.cantidad_vendida || 0} vendidos
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="space-y-6">
        {/* Top Productos Vendidos */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Package className="text-[#C1121F]" />
            Top 10 Productos Más Vendidos
          </h2>
          {ventasPorProductoData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={ventasPorProductoData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" stroke="#6B7280" />
                <YAxis dataKey="nombre" type="category" stroke="#6B7280" width={150} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #E5E7EB', 
                    borderRadius: '8px' 
                  }}
                />
                <Legend />
                <Bar dataKey="cantidad" fill="#669BBC" name="Cantidad" />
                <Bar dataKey="total" fill="#C1121F" name="Total ($)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <NoDataMessage message="No hay datos de productos vendidos" />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ventas por Mes */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Ventas por Mes
            </h2>
            {ventasPorMesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={ventasPorMesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="mes" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      border: '1px solid #E5E7EB', 
                      borderRadius: '8px' 
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="ventas" 
                    stroke="#669BBC" 
                    strokeWidth={2} 
                    name="Número de Ventas" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="monto" 
                    stroke="#C1121F" 
                    strokeWidth={2} 
                    name="Monto Total ($)" 
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <NoDataMessage message="No hay datos de ventas mensuales" />
            )}
          </div>

          {/* Distribución de Ventas 2024 */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Rendimiento 2024
            </h2>
            {ventas2024Data.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ventas2024Data}
                    dataKey="monto"
                    nameKey="mes"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => `${entry.mes.substring(0, 3)}: $${entry.monto.toFixed(0)}`}
                  >
                    {ventas2024Data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      border: '1px solid #E5E7EB', 
                      borderRadius: '8px' 
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <NoDataMessage message="No hay datos de 2024" />
            )}
          </div>
        </div>

        {/* Evolución Anual con Cantidades */}
        {ventas2024Data.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="text-[#669BBC]" />
              Evolución Anual 2024
            </h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={ventas2024Data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="mes" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #E5E7EB', 
                    borderRadius: '8px' 
                  }}
                />
                <Legend />
                <Bar dataKey="ventas" fill="#669BBC" name="Nº Ventas" />
                <Bar dataKey="cantidad" fill="#003049" name="Cantidad" />
                <Bar dataKey="monto" fill="#C1121F" name="Monto ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}