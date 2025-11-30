import { useEffect, useState } from "react";
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer
} from "recharts";
import dashboardService, { DashboardData } from "../dashboard.service";

export default function DashboardPropietario() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarDashboard = async () => {
      try {
        setLoading(true);
        const resp = await dashboardService.getDashboard();
        setData(resp);
      } catch (err) {
        console.error(err);
        setError("Error al cargar el dashboard");
      } finally {
        setLoading(false);
      }
    };

    cargarDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Cargando dashboard...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }
  
  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Sin datos</div>
      </div>
    );
  }

  // Transformar datos para los gráficos
  const ventasComprasData = Object.entries(data.ventas_compras).map(([fecha, valores]) => ({
    fecha: fecha.slice(5),
    ventas: valores.ventas,
    compras: valores.compras
  }));

  const topProductosData = data.top_productos.map(prod => ({
    nombre: prod.nombre.length > 15 ? prod.nombre.slice(0, 15) + "..." : prod.nombre,
    cantidad: parseInt(prod.total_vendido)
  }));

  const clientesData = data.clientes_frecuentes.map(cliente => ({
    nombre: `${cliente.nombres} ${cliente.paterno}`,
    compras: cliente.total_compras,
    monto: parseFloat(cliente.monto_total)
  }));

  const stockData = data.stock_minimo.map(prod => ({
    nombre: prod.nombre.length > 12 ? prod.nombre.slice(0, 12) + "..." : prod.nombre,
    stock: prod.stock,
    minimo: prod.stockMinimo,
    faltante: prod.stockMinimo - prod.stock
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Propietario Gozu</h1>

        {/* Tarjetas de Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Ventas Hoy</div>
            <div className="text-3xl font-bold text-blue-600">{data.estadisticas.ventas_hoy}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Ventas del Mes</div>
            <div className="text-3xl font-bold text-green-600">{data.estadisticas.ventas_mes}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Compras del Mes</div>
            <div className="text-3xl font-bold text-purple-600">{data.estadisticas.compras_mes}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Clientes Totales</div>
            <div className="text-3xl font-bold text-indigo-600">{data.estadisticas.clientes_totales}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Stock Bajo</div>
            <div className="text-3xl font-bold text-red-600">{data.estadisticas.productos_stock_bajo}</div>
          </div>
        </div>

        {/* Gráficos Principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Ventas vs Compras */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Ventas vs Compras</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ventasComprasData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="ventas" stroke="#3b82f6" strokeWidth={2} name="Ventas" />
                <Line type="monotone" dataKey="compras" stroke="#8b5cf6" strokeWidth={2} name="Compras" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Productos */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Top Productos Vendidos</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProductosData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="nombre" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="cantidad" fill="#10b981" name="Cantidad" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fila de Gráficos Adicionales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Clientes Frecuentes */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Clientes Frecuentes</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={clientesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" angle={-15} textAnchor="end" height={80} />
                <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                <YAxis yAxisId="right" orientation="right" stroke="#ec4899" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="compras" fill="#3b82f6" name="Compras" />
                <Bar yAxisId="right" dataKey="monto" fill="#ec4899" name="Monto (Bs)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Stock Mínimo */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Productos con Stock Bajo</h2>
            {stockData.length === 0 ? (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                No hay productos con stock bajo
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nombre" angle={-15} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="stock" fill="#10b981" name="Stock Actual" />
                  <Bar dataKey="minimo" fill="#f59e0b" name="Stock Mínimo" />
                  <Bar dataKey="faltante" fill="#ef4444" name="Faltante" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Tabla de Stock Mínimo Detallado */}
        {data.stock_minimo.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Detalle de Productos con Stock Bajo</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Stock</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Mínimo</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Faltante</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">P. Venta</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.stock_minimo.map((prod) => (
                    <tr key={prod.idProducto}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prod.codigoProducto}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{prod.nombre}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prod.categoria.nombre}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{prod.stock}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{prod.stockMinimo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <span className="text-red-600 font-semibold">{prod.stockMinimo - prod.stock}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                        Bs {parseFloat(prod.precioVenta).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}