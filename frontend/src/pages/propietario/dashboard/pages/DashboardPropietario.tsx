import dashboardPropietarioService from '../dashboard.service';
import { useEffect, useState } from 'react';
import { TrendingUp, Package, DollarSign, ShoppingCart, AlertCircle, Calendar, BarChart3 } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface VentaPorCategoria {
  Categoria: string;
  TotalVendido: string;
  NroVendidos: number;
  Ganancia: string;
  ProporcionNroVenta: string;
}

interface ProductoSinVenta {
  NombreProducto: string;
  Categoria: string;
  stock: number;
  stockMinimo: number;
}

interface MovimientoInventario {
  nombre: string;
  tipo: string;
  TotalMov: string;
}

interface CompraPorProducto {
  nombre: string;
  TotalGastado: string;
  CantidadComprada: string;
  ProporcionComprada: string;
}

interface PropietarioDashboardData {
  ventas_por_categoria: VentaPorCategoria[];
  productos_sin_venta: ProductoSinVenta[];
  movimientos_inventario: MovimientoInventario[];
  compras_por_producto: CompraPorProducto[];
  gasto_total_mes: Array<{ GastoTotal: string }>;
  total_ventas_mes: Array<{ TotalVentas: string }>;
  nro_ventas_mes: Array<{ NroVentas: number }>;
  nro_empresas_provedoras: Array<{ NroEmpresasProvedoras: number }>;
  cantidad_productos_activos: Array<{ CantidadProductosActivos: number }>;
  cantidad_productos_inactivos: Array<{ CantidadProductosInactivos: number }>;
}

function PropietarioDashboardComponent() {
  const [dashboardData, setDashboardData] = useState<PropietarioDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [showFilters, setShowFilters] = useState(false);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const data = await dashboardPropietarioService.getDashboard({ anio, mes });
      setDashboardData(data);
    } catch (error) {
      console.error('Error cargando dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleFilter = () => {
    loadDashboard();
    setShowFilters(false);
  };

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-600 border-solid mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-700 text-lg">No hay datos disponibles</p>
      </div>
    );
  }

  const totalVentas = parseFloat(dashboardData.total_ventas_mes[0]?.TotalVentas || '0');
  const gastoTotal = parseFloat(dashboardData.gasto_total_mes[0]?.GastoTotal || '0');
  const nroVentas = dashboardData.nro_ventas_mes[0]?.NroVentas || 0;
  const productosActivos = dashboardData.cantidad_productos_activos[0]?.CantidadProductosActivos || 0;
  const productosInactivos = dashboardData.cantidad_productos_inactivos[0]?.CantidadProductosInactivos || 0;
  const empresasProvedoras = dashboardData.nro_empresas_provedoras[0]?.NroEmpresasProvedoras || 0;

  const ventasChartData = dashboardData.ventas_por_categoria.map(v => ({
    categoria: v.Categoria,
    ventas: parseFloat(v.TotalVendido),
    ganancia: parseFloat(v.Ganancia),
    cantidad: v.NroVendidos
  }));

  const comprasChartData = dashboardData.compras_por_producto.map(c => ({
    nombre: c.nombre,
    gasto: parseFloat(c.TotalGastado),
    cantidad: parseInt(c.CantidadComprada)
  }));

  const productosChartData = [
    { name: 'Activos', value: productosActivos, color: '#10B981' },
    { name: 'Inactivos', value: productosInactivos, color: '#EF4444' }
  ];

  const stockChartData = dashboardData.productos_sin_venta.map(p => ({
    producto: p.NombreProducto,
    stock: p.stock,
    minimo: p.stockMinimo
  }));

  const movimientosChartData = dashboardData.movimientos_inventario.map(m => ({
    producto: m.nombre,
    cantidad: parseInt(m.TotalMov),
    tipo: m.tipo
  }));

  const COLORS = ['#C41E3A', '#DC2626', '#EF4444', '#F87171', '#FCA5A5'];

  return (
    <div className="min-h-screen bg-gray-200 p-6 pl-8">
      {/* Header */}
      <div className="w-full mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard del Propietario</h1>
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
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 shadow-lg transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="text-white" size={32} />
            <span className="text-red-100 text-sm font-medium">Total Ventas</span>
          </div>
          <div className="text-white">
            <div className="text-3xl font-bold mb-1">${totalVentas.toFixed(2)}</div>
            <div className="text-red-100 text-sm">{nroVentas} ventas realizadas</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-all border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <ShoppingCart className="text-gray-600" size={32} />
            <span className="text-gray-600 text-sm font-medium">Gastos</span>
          </div>
          <div className="text-gray-900">
            <div className="text-3xl font-bold mb-1">${gastoTotal.toFixed(2)}</div>
            <div className="text-gray-600 text-sm">Total del mes</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-all border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Package className="text-green-600" size={32} />
            <span className="text-gray-600 text-sm font-medium">Productos</span>
          </div>
          <div className="text-gray-900">
            <div className="text-3xl font-bold mb-1">{productosActivos}</div>
            <div className="text-gray-600 text-sm">{productosInactivos} inactivos</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-all border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="text-blue-600" size={32} />
            <span className="text-gray-600 text-sm font-medium">Proveedores</span>
          </div>
          <div className="text-gray-900">
            <div className="text-3xl font-bold mb-1">{empresasProvedoras}</div>
            <div className="text-gray-600 text-sm">Empresas activas</div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="w-full space-y-6">
        {/* Ventas por Categoría - Gráfico de Barras */}
        {ventasChartData.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart3 className="text-red-600" />
              Ventas y Ganancias por Categoría
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ventasChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="categoria" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                  labelStyle={{ color: '#111827' }}
                />
                <Legend />
                <Bar dataKey="ventas" fill="#C41E3A" name="Ventas ($)" />
                <Bar dataKey="ganancia" fill="#10B981" name="Ganancia ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Compras por Producto - Gráfico de Pastel */}
          {comprasChartData.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Distribución de Compras</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={comprasChartData}
                    dataKey="gasto"
                    nameKey="nombre"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => `$${entry.gasto.toFixed(0)}`}
                  >
                    {comprasChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Estado de Productos - Gráfico de Pastel */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Estado de Productos</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productosChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.value}`}
                >
                  {productosChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stock de Productos - Gráfico de Barras */}
        {stockChartData.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <AlertCircle className="text-yellow-600" />
              Nivel de Stock - Productos sin Venta
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="producto" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                  labelStyle={{ color: '#111827' }}
                />
                <Legend />
                <Bar dataKey="stock" fill="#3B82F6" name="Stock Actual" />
                <Bar dataKey="minimo" fill="#EF4444" name="Stock Mínimo" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Movimientos de Inventario */}
        {movimientosChartData.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Movimientos de Inventario</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={movimientosChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="producto" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                  labelStyle={{ color: '#111827' }}
                />
                <Legend />
                <Bar 
                  dataKey="cantidad" 
                  fill="#8B5CF6" 
                  name="Cantidad"
                />
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

export default PropietarioDashboardComponent;