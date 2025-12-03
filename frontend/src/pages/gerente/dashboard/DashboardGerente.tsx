import dashboardService from "./dashboard.service";
import { useAuth } from "../../../hooks/useAuth";
import React, { useEffect, useState } from "react";
import { TrendingUp, Package, DollarSign, ShoppingCart, AlertCircle, Calendar, BarChart3, Users, Clock } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

// Interfaces
interface ProductoSinVenta {
  NombreProducto: string;
  Categoria: string;
  stock: number;
  stockMinimo: number;
}

interface TopProductoGerente {
  idProducto: number;
  nombre: string;
  Total: number;
  ProporcionVentas: number;
  NroVentas: number;
}

interface VentasPorDiaSemana {
  DiaSemana: string;
  NroVentas: number;
}

interface VentasPorHora {
  Hora: number;
  NroVentas: number;
}

interface VentasMensualesAnio {
  Anio: number;
  Mes: number;
  Total: number;
}

interface TopProductoVendidoMes {
  idProducto: number;
  nombre: string;
  Total: number;
  CantidadVendida: number;
}

interface TopCategoriaVendidaMes {
  idCategoria: number;
  nombre: string;
  Total: number;
  CantidadVendida: number;
}

interface ProductoStockMinimo {
  idProducto: number;
  nombre: string;
  stock: number;
  stockMinimo: number;
}

interface DashboardData {
  productosSinVenta: ProductoSinVenta[];
  nroComprasGerente: Array<{ NroCompras: number }>;
  productosSinStock: Array<{ NroProductosSinStock: number }>;
  nroProveedores: Array<{ NroProveedores: number }>;
  nroVentasMes: Array<{ NroVentas: number }>;
  totalVentasMes: Array<{ TotalVentas: number }>;
  topProductosGerente: TopProductoGerente[];
  ventasPorDiaSemana: VentasPorDiaSemana[];
  ventasPorHora: VentasPorHora[];
  ventasMensualesAnio: VentasMensualesAnio[];
  topProductosVendidosMes: TopProductoVendidoMes[];
  topCategoriasVendidasMes: TopCategoriaVendidaMes[];
  topProductosComprados: any[];
  topCategoriasCompradas: any[];
  comprasMensualesAnio: any[];
  productosStockMinimo: ProductoStockMinimo[];
  productosSinStockDetalle: any[];
}

export default function DashboardGerente() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [showFilters, setShowFilters] = useState(false);

  const loadDashboard = async () => {
    if (!user?.persona.idPersona) {
      setError("No se pudo obtener el ID del usuario");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const rawData = await dashboardService.getDashboard({ 
        iduser: user.persona.idPersona,
        anio, 
        mes 
      });
      
      console.log("📊 Dashboard Data RAW:", rawData);
      
      // Transformar snake_case a camelCase y convertir strings a números
      const transformedData: DashboardData = {
        productosSinVenta: (rawData as any).productos_sin_venta || [],
        nroComprasGerente: (rawData as any).nro_compras_gerente || [],
        productosSinStock: (rawData as any).productos_sin_stock || [],
        nroProveedores: (rawData as any).nro_proveedores || [],
        nroVentasMes: (rawData as any).nro_ventas_mes || [],
        totalVentasMes: (rawData as any).total_ventas_mes || [],
        topProductosGerente: (rawData as any).top_productos_gerente || [],
        ventasPorDiaSemana: (rawData as any).ventas_por_dia_semana || [],
        ventasPorHora: (rawData as any).ventas_por_hora || [],
        ventasMensualesAnio: ((rawData as any).ventas_mensuales_anio || []).map((v: any) => ({
          Anio: v.Anio,
          Mes: v.Mes,
          Total: parseFloat(v.Total) || 0
        })),
        topProductosVendidosMes: ((rawData as any).top_productos_vendidos_mes || []).map((p: any) => ({
          idProducto: p.idProducto,
          nombre: p.nombre,
          Total: parseFloat(p.Total) || 0,
          CantidadVendida: parseInt(p.CantidadVendida) || 0
        })),
        topCategoriasVendidasMes: ((rawData as any).top_categorias_vendidas_mes || []).map((c: any) => ({
          idCategoria: c.idCategoria,
          nombre: c.nombre,
          Total: parseFloat(c.Total) || 0,
          CantidadVendida: parseInt(c.CantidadVendida) || 0
        })),
        topProductosComprados: ((rawData as any).top_productos_comprados || []).map((p: any) => ({
          ...p,
          Total: parseFloat(p.Total) || 0,
          CantidadComprada: parseInt(p.CantidadComprada) || 0
        })),
        topCategoriasCompradas: ((rawData as any).top_categorias_compradas || []).map((c: any) => ({
          ...c,
          Total: parseFloat(c.Total) || 0,
          CantidadComprada: parseInt(c.CantidadComprada) || 0
        })),
        comprasMensualesAnio: ((rawData as any).compras_mensuales_anio || []).map((c: any) => ({
          ...c,
          Total: parseFloat(c.Total) || 0
        })),
        productosStockMinimo: (rawData as any).productos_stock_minimo || [],
        productosSinStockDetalle: (rawData as any).productos_sin_stock_detalle || []
      };
      
      console.log("✅ Dashboard Data TRANSFORMADO:", transformedData);
      console.log("📈 Top Productos:", transformedData.topProductosVendidosMes);
      
      setDashboardData(transformedData);
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

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-600 border-solid mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-200 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <AlertCircle className="text-red-600 mx-auto mb-4" size={48} />
          <p className="text-gray-700 text-lg">{error}</p>
          <button 
            onClick={loadDashboard}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-200 flex items-center justify-center">
        <p className="text-gray-700 text-lg">No hay datos disponibles</p>
      </div>
    );
  }

  // Valores por defecto seguros
  const totalVentas = dashboardData.totalVentasMes?.[0]?.TotalVentas || 0;
  const nroVentas = dashboardData.nroVentasMes?.[0]?.NroVentas || 0;
  const nroCompras = dashboardData.nroComprasGerente?.[0]?.NroCompras || 0;
  const nroProveedores = dashboardData.nroProveedores?.[0]?.NroProveedores || 0;
  const productosSinStock = dashboardData.productosSinStock?.[0]?.NroProductosSinStock || 0;

  // Transformación de datos para gráficos - YA ESTÁN CONVERTIDOS A NÚMEROS
  const topProductosData = Array.isArray(dashboardData.topProductosVendidosMes) 
    ? dashboardData.topProductosVendidosMes.slice(0, 10).map(p => ({
        nombre: p.nombre || 'Sin nombre',
        total: p.Total,
        cantidad: p.CantidadVendida
      }))
    : [];

  const topCategoriasData = Array.isArray(dashboardData.topCategoriasVendidasMes)
    ? dashboardData.topCategoriasVendidasMes.slice(0, 5).map(c => ({
        nombre: c.nombre || 'Sin nombre',
        total: c.Total,
        cantidad: c.CantidadVendida
      }))
    : [];

  const ventasPorDiaData = Array.isArray(dashboardData.ventasPorDiaSemana)
    ? dashboardData.ventasPorDiaSemana.map(v => {
        // El DiaSemana viene como 'Monday', 'Tuesday', etc.
        const diaMap: Record<string, string> = {
          'Monday': 'Lunes',
          'Tuesday': 'Martes',
          'Wednesday': 'Miércoles',
          'Thursday': 'Jueves',
          'Friday': 'Viernes',
          'Saturday': 'Sábado',
          'Sunday': 'Domingo'
        };
        return {
          dia: diaMap[v.DiaSemana] || v.DiaSemana,
          ventas: v.NroVentas
        };
      })
    : [];

  const ventasPorHoraData = Array.isArray(dashboardData.ventasPorHora)
    ? dashboardData.ventasPorHora.map(v => ({
        hora: `${v.Hora}:00`,
        ventas: v.NroVentas
      }))
    : [];

  const ventasMensualesData = Array.isArray(dashboardData.ventasMensualesAnio)
    ? dashboardData.ventasMensualesAnio.map(v => ({
        mes: meses[v.Mes - 1] || `Mes ${v.Mes}`,
        total: v.Total
      }))
    : [];

  const stockBajoData = Array.isArray(dashboardData.productosStockMinimo)
    ? dashboardData.productosStockMinimo.slice(0, 10).map(p => ({
        nombre: p.nombre || 'Sin nombre',
        stock: p.stock,
        minimo: p.stockMinimo
      }))
    : [];

  console.log("🔄 Datos para gráficos:");
  console.log("  - topProductosData:", topProductosData);
  console.log("  - topCategoriasData:", topCategoriasData);
  console.log("  - ventasPorDiaData:", ventasPorDiaData);
  console.log("  - stockBajoData:", stockBajoData);

  const COLORS = ['#C41E3A', '#DC2626', '#EF4444', '#F87171', '#FCA5A5', '#FEE2E2'];

  // Componente para mostrar mensaje cuando no hay datos
  const NoDataMessage = ({ message }: { message: string }) => (
    <div className="flex items-center justify-center h-64 text-gray-500">
      <div className="text-center">
        <AlertCircle className="mx-auto mb-2" size={48} />
        <p>{message}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-200 p-6 pl-8">
      {/* Header */}
      <div className="w-full mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard del Gerente</h1>
            <p className="text-gray-600 text-lg">Estadísticas de {meses[mes - 1]} {anio}</p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all transform hover:scale-105 shadow-md"
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
                  className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:border-transparent"
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
                  className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleFilter}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-all transform hover:scale-105"
                >
                  Aplicar Filtro
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Estadísticas Principales */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 shadow-lg transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="text-white" size={32} />
            <span className="text-red-100 text-sm font-medium">Total Ventas</span>
          </div>
          <div className="text-white">
            <div className="text-3xl font-bold mb-1">${totalVentas}</div>
            <div className="text-red-100 text-sm">{nroVentas} ventas</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-all border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <ShoppingCart className="text-gray-600" size={32} />
            <span className="text-gray-600 text-sm font-medium">Compras</span>
          </div>
          <div className="text-gray-900">
            <div className="text-3xl font-bold mb-1">{nroCompras}</div>
            <div className="text-gray-600 text-sm">Este mes</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-all border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Users className="text-blue-600" size={32} />
            <span className="text-gray-600 text-sm font-medium">Proveedores</span>
          </div>
          <div className="text-gray-900">
            <div className="text-3xl font-bold mb-1">{nroProveedores}</div>
            <div className="text-gray-600 text-sm">Activos</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-all border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Package className="text-green-600" size={32} />
            <span className="text-gray-600 text-sm font-medium">Stock Bajo</span>
          </div>
          <div className="text-gray-900">
            <div className="text-3xl font-bold mb-1">{stockBajoData.length}</div>
            <div className="text-gray-600 text-sm">Productos</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-all border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <AlertCircle className="text-red-600" size={32} />
            <span className="text-gray-600 text-sm font-medium">Sin Stock</span>
          </div>
          <div className="text-gray-900">
            <div className="text-3xl font-bold mb-1">{productosSinStock}</div>
            <div className="text-gray-600 text-sm">Productos</div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="w-full space-y-6">
        {/* Top Productos Vendidos */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="text-red-600" />
            Top 10 Productos Más Vendidos
          </h2>
          {topProductosData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={topProductosData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" stroke="#6B7280" />
                <YAxis dataKey="nombre" type="category" stroke="#6B7280" width={150} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                  labelStyle={{ color: '#111827' }}
                />
                <Legend />
                <Bar dataKey="total" fill="#C41E3A" name="Total ($)" />
                <Bar dataKey="cantidad" fill="#10B981" name="Cantidad" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <NoDataMessage message="No hay datos de productos vendidos para este período" />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ventas por Día de la Semana */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Ventas por Día de la Semana</h2>
            {ventasPorDiaData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ventasPorDiaData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="dia" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                  />
                  <Bar dataKey="ventas" fill="#3B82F6" name="Ventas" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <NoDataMessage message="No hay datos de ventas por día" />
            )}
          </div>

          {/* Top Categorías */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Categorías Vendidas</h2>
            {topCategoriasData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={topCategoriasData}
                    dataKey="total"
                    nameKey="nombre"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => `$${entry.total.toFixed(0)}`}
                  >
                    {topCategoriasData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <NoDataMessage message="No hay datos de categorías" />
            )}
          </div>
        </div>

        {/* Ventas por Hora */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Clock className="text-purple-600" />
            Ventas por Hora del Día
          </h2>
          {ventasPorHoraData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ventasPorHoraData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="hora" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                />
                <Legend />
                <Line type="monotone" dataKey="ventas" stroke="#8B5CF6" strokeWidth={2} name="Ventas" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <NoDataMessage message="No hay datos de ventas por hora" />
          )}
        </div>

        {/* Ventas Mensuales */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Evolución de Ventas por Mes</h2>
          {ventasMensualesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ventasMensualesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="mes" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#C41E3A" strokeWidth={3} name="Total ($)" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <NoDataMessage message="No hay datos de ventas mensuales" />
          )}
        </div>

        {/* Productos con Stock Bajo */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <AlertCircle className="text-yellow-600" />
            Productos con Stock Bajo
          </h2>
          {stockBajoData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={stockBajoData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" stroke="#6B7280" />
                <YAxis dataKey="nombre" type="category" stroke="#6B7280" width={150} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="stock" fill="#3B82F6" name="Stock Actual" />
                <Bar dataKey="minimo" fill="#EF4444" name="Stock Mínimo" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <NoDataMessage message="No hay productos con stock bajo" />
          )}
        </div>
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