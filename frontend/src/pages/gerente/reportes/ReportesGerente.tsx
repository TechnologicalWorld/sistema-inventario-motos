import React, { useEffect, useState } from "react";
import { FileText, TrendingUp, Users, Package, AlertTriangle, Download } from "lucide-react";
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import ReportesService from "./reporte.service";
import ReportePDF from "./ReportePDF";

interface VentaPorEmpleado {
  idPersona: number;
  NombreCompleto: string;
  TotalVendido: string;
  NroVentas: number;
  PromedioVenta: string;
  PrimeraVenta: string;
  UltimaVenta: string;
}

interface CompraPorProducto {
  idProducto: number;
  nombre: string;
  codigoProducto: string;
  descripcion: string;
  TotalPago: string;
  UnitCompradas: number;
  PrecioPromedioCompra: string;
  NroCompras: number;
  UltimaCompra: string;
  PrimeraCompra: string;
  idGerente: number | null;
  NombreGerente: string;
}

interface ProductoStock {
  nombre: string;
  codigoProducto: string;
  descripcion: string;
  stock: number;
  stockMinimo: number;
  estado_stock: string;
}

interface StockCritico {
  NroProd: number;
  total_productos_criticos: number;
}

interface GananciasProducto {
  idProducto: number;
  nombre: string;
  codigoProducto: string;
  Ganancia: string;
  VentasTotales: string;
  total_ganancias?: string;
}

interface ResumenGanancias {
  GananciaTotal: string;
  VentasTotales: string;
  total_ventas?: string;
  ganancia_neta?: string;
}

interface RespuestaReportes {
  success: boolean;
  data: {
    ventas_empleados: VentaPorEmpleado[];
    compras_gerente: CompraPorProducto[];
    productos_stock: ProductoStock[];
    conteo_stock_critico: StockCritico[];
    ganancias_producto: GananciasProducto[];
    resumen_ganancias: ResumenGanancias[];
  };
  error?: string;
}

const useAuth = () => ({
  user: { persona: { idPersona: 1 } }
});

export default function ReporteGerente() {
  const [reportes, setReportes] = useState<RespuestaReportes | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  const { user } = useAuth();
  const idGerente = user?.persona?.idPersona || 1;

  const fechaActual = new Date();
  const [anio, setAnio] = useState<number>(fechaActual.getFullYear());
  const [mes, setMes] = useState<number>(fechaActual.getMonth() + 1);

  const meses = [
    { valor: 1, nombre: "Enero" }, { valor: 2, nombre: "Febrero" },
    { valor: 3, nombre: "Marzo" }, { valor: 4, nombre: "Abril" },
    { valor: 5, nombre: "Mayo" }, { valor: 6, nombre: "Junio" },
    { valor: 7, nombre: "Julio" }, { valor: 8, nombre: "Agosto" },
    { valor: 9, nombre: "Septiembre" }, { valor: 10, nombre: "Octubre" },
    { valor: 11, nombre: "Noviembre" }, { valor: 12, nombre: "Diciembre" }
  ];

  const aniosDisponibles = [];
  const anioActual = new Date().getFullYear();
  for (let i = anioActual; i >= anioActual - 5; i--) {
    aniosDisponibles.push(i);
  }

  useEffect(() => {
    const fetchReportes = async () => {
      if (!idGerente) {
        setError("No se pudo identificar al gerente");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await ReportesService.obtenerReportes(anio, mes, idGerente);
        console.log("Datos de reportes recibidos:", data);
        if (data.success) {
          setReportes(data);
          setError(null);
        } else {
          setError(data.error || "Error al obtener reportes");
        }
      } catch (err) {
        console.error("Error al obtener los reportes:", err);
        setError("Error de conexión con el servidor");
      } finally {
        setLoading(false);
      }
    };

    fetchReportes();
  }, [anio, mes, idGerente]);

  const handleDownloadPDF = async () => {
    if (!reportes) return;

    try {
      setGeneratingPDF(true);

      const mesNombre = meses.find(m => m.valor === mes)?.nombre || '';
      
      // Generar el PDF usando @react-pdf/renderer
      const blob = await pdf(
        <ReportePDF 
          reportes={reportes}
          mes={mesNombre}
          anio={anio}
          idGerente={idGerente}
        />
      ).toBlob();

      // Descargar el archivo
      saveAs(blob, `Reporte_Gerencial_${mesNombre}_${anio}.pdf`);
    } catch (err) {
      console.error('Error al generar PDF:', err);
      alert('Error al generar el PDF. Por favor, intenta nuevamente.');
    } finally {
      setGeneratingPDF(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-lg text-gray-600">Cargando reportes...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 shadow-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-red-800">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!reportes) return null;

  // Extraer datos del resumen con los nombres correctos del backend
  const resumen = reportes.data.resumen_ganancias[0] || {};
  const totalVentas = Number(resumen.VentasTotales || resumen.total_ventas || 0);
  const gananciaNeta = Number(resumen.GananciaTotal || resumen.ganancia_neta || 0);
  
  // Calcular porcentaje de ganancia
  const porcentajeGanancia = totalVentas > 0 ? (gananciaNeta / totalVentas) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Reportes Gerenciales</h1>
                <p className="text-gray-500">Análisis detallado del período</p>
              </div>
            </div>

            <div className="flex flex-wrap items-end gap-3">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Mes</label>
                <select
                  value={mes}
                  onChange={(e) => setMes(Number(e.target.value))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  {meses.map((m) => (
                    <option key={m.valor} value={m.valor}>{m.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Año</label>
                <select
                  value={anio}
                  onChange={(e) => setAnio(Number(e.target.value))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  {aniosDisponibles.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleDownloadPDF}
                disabled={generatingPDF || !reportes}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generatingPDF ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generando PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5" />
                    <span>Descargar PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Contenido del reporte */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="border-b border-gray-200 pb-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Reporte del Período</h2>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span><strong>Gerente ID:</strong> {idGerente}</span>
              <span><strong>Período:</strong> {meses.find(m => m.valor === mes)?.nombre} {anio}</span>
              <span><strong>Generado:</strong> {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {/* Resumen Financiero */}
          {reportes.data.resumen_ganancias.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
                <h3 className="text-xl font-bold text-gray-800">Resumen Financiero</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <p className="text-sm font-medium text-blue-800 mb-1">Total Ventas</p>
                  <p className="text-3xl font-bold text-blue-900">${totalVentas.toFixed(2)}</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
                  <p className="text-sm font-medium text-emerald-800 mb-1">Ganancia Neta</p>
                  <p className="text-3xl font-bold text-emerald-900">${gananciaNeta.toFixed(2)}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <p className="text-sm font-medium text-purple-800 mb-1">% Ganancia</p>
                  <p className="text-3xl font-bold text-purple-900">{porcentajeGanancia.toFixed(2)}%</p>
                </div>
              </div>
            </div>
          )}

          {/* Ventas por Empleado */}
          {reportes.data.ventas_empleados.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-6 w-6 text-indigo-600" />
                <h3 className="text-xl font-bold text-gray-800">Ventas por Empleado</h3>
              </div>
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Empleado</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Total Vendido</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">N° Ventas</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Promedio</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportes.data.ventas_empleados.map((venta, idx) => (
                      <tr key={venta.idPersona} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{venta.NombreCompleto}</div>
                        </td>
                        <td className="px-6 py-4 text-right text-gray-900 font-semibold">
                          ${Number(venta.TotalVendido).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 inline-block">
                            {venta.NroVentas}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-gray-700">
                          ${Number(venta.PromedioVenta).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Compras por Producto */}
          {reportes.data.compras_gerente.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Package className="h-6 w-6 text-orange-600" />
                <h3 className="text-xl font-bold text-gray-800">Compras por Producto</h3>
              </div>
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Producto</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Total Comprado</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Unidades</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Gerente</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportes.data.compras_gerente.map((compra, idx) => (
                      <tr key={compra.idProducto} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{compra.nombre}</div>
                          <div className="text-sm text-gray-500">{compra.codigoProducto}</div>
                        </td>
                        <td className="px-6 py-4 text-right text-gray-900 font-semibold">
                          ${Number(compra.TotalPago).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 inline-block">
                            {compra.UnitCompradas}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {compra.NombreGerente || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Alerta de Stock Crítico */}
          {reportes.data.conteo_stock_critico.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
                <h3 className="text-xl font-bold text-gray-800">Alerta de Stock</h3>
              </div>
              {reportes.data.conteo_stock_critico.map((stock, index) => {
                const totalCriticos = stock.total_productos_criticos || stock.NroProd;
                return (
                  <div key={index} className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-500 rounded-lg p-6">
                    <div className="flex items-center">
                      <AlertTriangle className="h-8 w-8 text-yellow-600 mr-4" />
                      <div>
                        <p className="text-lg font-bold text-yellow-900">
                          {totalCriticos} productos con stock crítico
                        </p>
                        <p className="text-sm text-yellow-800 mt-1">
                          Se recomienda realizar pedidos de reposición inmediatamente
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Productos con Stock Bajo/Crítico */}
          {reportes.data.productos_stock.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Package className="h-6 w-6 text-red-600" />
                <h3 className="text-xl font-bold text-gray-800">Estado de Stock de Productos</h3>
              </div>
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Producto</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Stock Actual</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Stock Mínimo</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportes.data.productos_stock
                      .filter(p => p.estado_stock !== 'NORMAL')
                      .slice(0, 10)
                      .map((producto, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{producto.nombre}</div>
                            <div className="text-sm text-gray-500">{producto.codigoProducto}</div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-gray-900 font-semibold">{producto.stock}</span>
                          </td>
                          <td className="px-6 py-4 text-center text-gray-700">
                            {producto.stockMinimo}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full inline-block ${
                              producto.estado_stock === 'CRÍTICO' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {producto.estado_stock}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Ganancias por Producto */}
          {reportes.data.ganancias_producto.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
                <h3 className="text-xl font-bold text-gray-800">Ganancias por Producto</h3>
              </div>
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Producto</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Ganancias</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Ventas Totales</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">% Margen</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportes.data.ganancias_producto.map((ganancia, idx) => {
                      const gananciasTotal = Number(ganancia.Ganancia || ganancia.total_ganancias || 0);
                      const ventasTotal = Number(ganancia.VentasTotales || 0);
                      const margen = ventasTotal > 0 ? (gananciasTotal / ventasTotal) * 100 : 0;
                      
                      return (
                        <tr key={ganancia.idProducto} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{ganancia.nombre}</div>
                            <div className="text-sm text-gray-500">{ganancia.codigoProducto}</div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className={`text-lg font-bold ${
                              gananciasTotal >= 0 ? 'text-emerald-600' : 'text-red-600'
                            }`}>
                              ${gananciasTotal.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-gray-700 font-medium">
                            ${ventasTotal.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full inline-block ${
                              margen >= 30 ? 'bg-emerald-100 text-emerald-800' :
                              margen >= 15 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {margen.toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}