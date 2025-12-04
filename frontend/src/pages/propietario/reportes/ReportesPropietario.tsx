import React, { useEffect, useState } from 'react';
import { Download, FileText, TrendingUp, TrendingDown, Package, AlertTriangle } from 'lucide-react';
import ReportesService from './reportes.service';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  header: {
    textAlign: 'center',
    borderBottom: '3px solid #2563eb',
    paddingBottom: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    color: '#1e40af',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 3,
  },
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 30,
    gap: 10,
  },
  card: {
    width: '48%',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#f8fafc',
    marginBottom: 10,
  },
  cardSuccess: {
    borderLeft: '4px solid #10b981',
  },
  cardWarning: {
    borderLeft: '4px solid #f59e0b',
  },
  cardDanger: {
    borderLeft: '4px solid #ef4444',
  },
  cardTitle: {
    fontSize: 10,
    color: '#475569',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#1e40af',
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: 8,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    padding: 10,
    fontWeight: 'bold',
    borderBottom: '1px solid #e2e8f0',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottom: '1px solid #e2e8f0',
  },
  tableCell: {
    fontSize: 9,
  },
  col1: {
    width: '20%',
  },
  col2: {
    width: '35%',
  },
  col3: {
    width: '22.5%',
    textAlign: 'right',
  },
  col4: {
    width: '22.5%',
    textAlign: 'right',
  },
  colStock1: {
    width: '20%',
  },
  colStock2: {
    width: '30%',
  },
  colStock3: {
    width: '16.66%',
    textAlign: 'right',
  },
  colStock4: {
    width: '16.66%',
    textAlign: 'right',
  },
  colStock5: {
    width: '16.66%',
  },
  badge: {
    padding: '3 6',
    borderRadius: 4,
    fontSize: 8,
    fontWeight: 'bold',
  },
  badgeSuccess: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
  },
  badgeDanger: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  footer: {
    marginTop: 40,
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 8,
    borderTop: '1px solid #e2e8f0',
    paddingTop: 15,
  },
});

// Componente del documento PDF
const ReportePDF = ({ data, selectedMonth, selectedYear, getMonthName }) => {
  const { resumen_ganancias, resumen_compras, conteo_stock_critico, ganancias_producto, productos_stock } = data.data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Reporte Mensual de Inventario y Ventas</Text>
          <Text style={styles.subtitle}>Período: {getMonthName(selectedMonth)} {selectedYear}</Text>
          <Text style={styles.subtitle}>Fecha de generación: {new Date().toLocaleDateString()}</Text>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={[styles.card, styles.cardSuccess]}>
            <Text style={styles.cardTitle}>Ganancia Total</Text>
            <Text style={styles.cardValue}>
              Bs. {parseFloat(resumen_ganancias[0]?.GananciaTotal || 0).toFixed(2)}
            </Text>
          </View>

          <View style={[styles.card, styles.cardSuccess]}>
            <Text style={styles.cardTitle}>Ventas Totales</Text>
            <Text style={styles.cardValue}>
              Bs. {parseFloat(resumen_ganancias[0]?.VentasTotales || 0).toFixed(2)}
            </Text>
          </View>

          <View style={[styles.card, styles.cardWarning]}>
            <Text style={styles.cardTitle}>Gasto en Compras</Text>
            <Text style={styles.cardValue}>
              Bs. {parseFloat(resumen_compras[0]?.TotalGasto || 0).toFixed(2)}
            </Text>
          </View>

          <View style={[styles.card, styles.cardDanger]}>
            <Text style={styles.cardTitle}>Productos en Stock Crítico</Text>
            <Text style={styles.cardValue}>
              {conteo_stock_critico[0]?.NroProd || 0}
            </Text>
          </View>
        </View>

        {/* Productos con Mayor Ganancia */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Productos que Generan mas Ganancia</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, styles.col1]}>Código</Text>
              <Text style={[styles.tableCell, styles.col2]}>Producto</Text>
              <Text style={[styles.tableCell, styles.col3]}>Ventas Totales</Text>
              <Text style={[styles.tableCell, styles.col4]}>Ganancia</Text>
            </View>
            {ganancias_producto.map((p, idx) => (
              <View key={idx} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.col1]}>{p.codigoProducto}</Text>
                <Text style={[styles.tableCell, styles.col2]}>{p.nombre}</Text>
                <Text style={[styles.tableCell, styles.col3]}>
                  Bs. {parseFloat(p.VentasTotales).toFixed(2)}
                </Text>
                <Text style={[styles.tableCell, styles.col4]}>
                  Bs. {parseFloat(p.Ganancia).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Productos con Stock Crítico */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Productos con Stock Crítico</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, styles.colStock1]}>Código</Text>
              <Text style={[styles.tableCell, styles.colStock2]}>Producto</Text>
              <Text style={[styles.tableCell, styles.colStock3]}>Stock Actual</Text>
              <Text style={[styles.tableCell, styles.colStock4]}>Stock Mínimo</Text>
              <Text style={[styles.tableCell, styles.colStock5]}>Estado</Text>
            </View>
            {productos_stock.filter(p => p.estado_stock === 'CRÍTICO').map((p, idx) => (
              <View key={idx} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.colStock1]}>{p.codigoProducto}</Text>
                <Text style={[styles.tableCell, styles.colStock2]}>{p.nombre}</Text>
                <Text style={[styles.tableCell, styles.colStock3]}>{p.stock}</Text>
                <Text style={[styles.tableCell, styles.colStock4]}>{p.stockMinimo}</Text>
                <Text style={[styles.tableCell, styles.colStock5]}>{p.estado_stock}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Reporte generado automáticamente - Sistema de Gestión de Inventario</Text>
        </View>
      </Page>
    </Document>
  );
};

export default function ReportesPropietario() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    fetchData();
  }, [selectedYear, selectedMonth]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await ReportesService.obtenerReportes(selectedYear, selectedMonth);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (month) => {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return months[month - 1];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-red-600" size={24} />
            <div>
              <h3 className="font-semibold text-red-900">Error al cargar datos</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { resumen_ganancias, resumen_compras, conteo_stock_critico, ganancias_producto, productos_stock } = data.data;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reportes Mensuales</h1>
              <p className="text-gray-600 mt-1">
                {getMonthName(selectedMonth)} {selectedYear}
              </p>
            </div>
            <PDFDownloadLink
              document={
                <ReportePDF 
                  data={data} 
                  selectedMonth={selectedMonth} 
                  selectedYear={selectedYear}
                  getMonthName={getMonthName}
                />
              }
              fileName={`reporte_${selectedYear}_${selectedMonth}.pdf`}
            >
              {({ loading }) => (
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  <Download size={20} />
                  {loading ? 'Generando PDF...' : 'Descargar PDF'}
                </button>
              )}
            </PDFDownloadLink>
          </div>

          {/* Filtros */}
          <div className="flex gap-4 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Año</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[2022, 2023, 2024, 2025].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mes</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                  <option key={month} value={month}>{getMonthName(month)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ganancia Total</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  Bs. {parseFloat(resumen_ganancias[0]?.GananciaTotal || 0).toFixed(2)}
                </p>
              </div>
              <TrendingUp className="text-green-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ventas Totales</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  Bs. {parseFloat(resumen_ganancias[0]?.VentasTotales || 0).toFixed(2)}
                </p>
              </div>
              <FileText className="text-blue-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gasto en Compras</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  Bs. {parseFloat(resumen_compras[0]?.TotalGasto || 0).toFixed(2)}
                </p>
              </div>
              <TrendingDown className="text-yellow-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Stock Crítico</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {conteo_stock_critico[0]?.NroProd || 0}
                </p>
              </div>
              <AlertTriangle className="text-red-500" size={32} />
            </div>
          </div>
        </div>

        {/* Productos con Mayor Ganancia */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="text-green-600" />
            Productos que Generan mas Ganancia
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ventas Totales
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ganancia
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ganancias_producto.map((producto) => (
                  <tr key={producto.idProducto} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {producto.codigoProducto}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {producto.nombre}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      Bs. {parseFloat(producto.VentasTotales).toFixed(2)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        parseFloat(producto.Ganancia) >= 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        Bs. {parseFloat(producto.Ganancia).toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Productos con Stock Crítico */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="text-red-600" />
            Productos con Stock Crítico
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock Actual
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock Mínimo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productos_stock.filter(p => p.estado_stock === 'CRÍTICO').map((producto, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {producto.codigoProducto}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {producto.nombre}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">
                      {producto.stock}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {producto.stockMinimo}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        {producto.estado_stock}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}