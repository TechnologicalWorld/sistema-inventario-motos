// ReportePDF.tsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

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

interface ReportePDFProps {
  reportes: RespuestaReportes;
  mes: string;
  anio: number;
  idGerente: number;
}

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
    borderBottomStyle: 'solid',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 3,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    backgroundColor: '#f3f4f6',
    padding: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#2563eb',
    borderLeftStyle: 'solid',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  summaryCard: {
    width: '30%',
    padding: 10,
    backgroundColor: '#f0f9ff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderStyle: 'solid',
  },
  summaryLabel: {
    fontSize: 9,
    color: '#1e40af',
    marginBottom: 3,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    borderBottomStyle: 'solid',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
    borderBottomStyle: 'solid',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableRowEven: {
    backgroundColor: '#f9fafb',
  },
  tableCell: {
    fontSize: 8,
  },
  tableCellBold: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  alertBox: {
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 5,
    borderLeftWidth: 3,
    borderLeftColor: '#eab308',
    borderLeftStyle: 'solid',
    marginTop: 10,
  },
  alertText: {
    fontSize: 10,
    color: '#78350f',
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    borderTopStyle: 'solid',
    paddingTop: 10,
  },
});

const ReportePDF: React.FC<ReportePDFProps> = ({ reportes, mes, anio, idGerente }) => {
  const resumen = reportes.data.resumen_ganancias[0] || {};
  const totalVentas = Number(resumen.VentasTotales || resumen.total_ventas || 0);
  const gananciaNeta = Number(resumen.GananciaTotal || resumen.ganancia_neta || 0);
  const porcentajeGanancia = totalVentas > 0 ? (gananciaNeta / totalVentas) * 100 : 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>REPORTE GERENCIAL</Text>
          <Text style={styles.subtitle}>Período: {mes} {anio}</Text>
          <Text style={styles.subtitle}>Gerente ID: {idGerente}</Text>
          <Text style={styles.subtitle}>Generado: {new Date().toLocaleDateString()}</Text>
        </View>

        {/* Resumen Financiero */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RESUMEN FINANCIERO</Text>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Ventas</Text>
              <Text style={styles.summaryValue}>${totalVentas.toFixed(2)}</Text>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: '#d1fae5', borderColor: '#6ee7b7' }]}>
              <Text style={[styles.summaryLabel, { color: '#065f46' }]}>Ganancia Neta</Text>
              <Text style={[styles.summaryValue, { color: '#064e3b' }]}>${gananciaNeta.toFixed(2)}</Text>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: '#e9d5ff', borderColor: '#c084fc' }]}>
              <Text style={[styles.summaryLabel, { color: '#6b21a8' }]}>% Ganancia</Text>
              <Text style={[styles.summaryValue, { color: '#581c87' }]}>{porcentajeGanancia.toFixed(2)}%</Text>
            </View>
          </View>
        </View>

        {/* Ventas por Empleado */}
        {reportes.data.ventas_empleados.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>VENTAS POR EMPLEADO</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableCellBold, { width: '40%' }]}>Empleado</Text>
                <Text style={[styles.tableCellBold, { width: '25%', textAlign: 'right' }]}>Total</Text>
                <Text style={[styles.tableCellBold, { width: '15%', textAlign: 'center' }]}>Ventas</Text>
                <Text style={[styles.tableCellBold, { width: '20%', textAlign: 'right' }]}>Promedio</Text>
              </View>
              {reportes.data.ventas_empleados.map((venta, idx) => (
                <View key={venta.idPersona} style={[styles.tableRow, idx % 2 === 0 && styles.tableRowEven]}>
                  <Text style={[styles.tableCell, { width: '40%' }]}>{venta.NombreCompleto}</Text>
                  <Text style={[styles.tableCellBold, { width: '25%', textAlign: 'right' }]}>
                    ${Number(venta.TotalVendido).toFixed(2)}
                  </Text>
                  <Text style={[styles.tableCell, { width: '15%', textAlign: 'center' }]}>
                    {venta.NroVentas}
                  </Text>
                  <Text style={[styles.tableCell, { width: '20%', textAlign: 'right' }]}>
                    ${Number(venta.PromedioVenta).toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Compras por Producto */}
        {reportes.data.compras_gerente.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>COMPRAS POR PRODUCTO</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableCellBold, { width: '35%' }]}>Producto</Text>
                <Text style={[styles.tableCellBold, { width: '25%', textAlign: 'right' }]}>Total</Text>
                <Text style={[styles.tableCellBold, { width: '20%', textAlign: 'center' }]}>Unidades</Text>
                <Text style={[styles.tableCellBold, { width: '20%', textAlign: 'left' }]}>Gerente</Text>
              </View>
              {reportes.data.compras_gerente.slice(0, 10).map((compra, idx) => (
                <View key={compra.idProducto} style={[styles.tableRow, idx % 2 === 0 && styles.tableRowEven]}>
                  <View style={{ width: '35%' }}>
                    <Text style={styles.tableCellBold}>{compra.nombre}</Text>
                    <Text style={[styles.tableCell, { fontSize: 7, color: '#6b7280' }]}>
                      {compra.codigoProducto}
                    </Text>
                  </View>
                  <Text style={[styles.tableCellBold, { width: '25%', textAlign: 'right' }]}>
                    ${Number(compra.TotalPago).toFixed(2)}
                  </Text>
                  <Text style={[styles.tableCell, { width: '20%', textAlign: 'center' }]}>
                    {compra.UnitCompradas}
                  </Text>
                  <Text style={[styles.tableCell, { width: '20%' }]}>
                    {compra.NombreGerente || 'N/A'}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Alerta de Stock */}
        {reportes.data.conteo_stock_critico.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ALERTA DE STOCK</Text>
            {reportes.data.conteo_stock_critico.map((stock, idx) => {
              const totalCriticos = stock.total_productos_criticos || stock.NroProd;
              return (
                <View key={idx} style={styles.alertBox}>
                  <Text style={styles.alertText}>
                    ⚠ {totalCriticos} productos con stock crítico
                  </Text>
                  <Text style={{ fontSize: 8, color: '#a16207', marginTop: 3 }}>
                    Se recomienda realizar pedidos de reposición inmediatamente
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Reporte Gerencial - Sistema de Gestión - Página 1</Text>
        </View>
      </Page>

      {/* Segunda página - Ganancias por Producto */}
      {reportes.data.ganancias_producto.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>REPORTE GERENCIAL (Continuación)</Text>
            <Text style={styles.subtitle}>Período: {mes} {anio}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>GANANCIAS POR PRODUCTO</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableCellBold, { width: '35%' }]}>Producto</Text>
                <Text style={[styles.tableCellBold, { width: '25%', textAlign: 'right' }]}>Ganancias</Text>
                <Text style={[styles.tableCellBold, { width: '25%', textAlign: 'right' }]}>Ventas</Text>
                <Text style={[styles.tableCellBold, { width: '15%', textAlign: 'center' }]}>Margen</Text>
              </View>
              {reportes.data.ganancias_producto.map((ganancia, idx) => {
                const gananciasTotal = Number(ganancia.Ganancia || ganancia.total_ganancias || 0);
                const ventasTotal = Number(ganancia.VentasTotales || 0);
                const margen = ventasTotal > 0 ? (gananciasTotal / ventasTotal) * 100 : 0;

                return (
                  <View key={ganancia.idProducto} style={[styles.tableRow, idx % 2 === 0 && styles.tableRowEven]}>
                    <View style={{ width: '35%' }}>
                      <Text style={styles.tableCellBold}>{ganancia.nombre}</Text>
                      <Text style={[styles.tableCell, { fontSize: 7, color: '#6b7280' }]}>
                        {ganancia.codigoProducto}
                      </Text>
                    </View>
                    <Text style={[styles.tableCellBold, { 
                      width: '25%', 
                      textAlign: 'right',
                      color: gananciasTotal >= 0 ? '#059669' : '#dc2626'
                    }]}>
                      ${gananciasTotal.toFixed(2)}
                    </Text>
                    <Text style={[styles.tableCell, { width: '25%', textAlign: 'right' }]}>
                      ${ventasTotal.toFixed(2)}
                    </Text>
                    <Text style={[styles.tableCell, { 
                      width: '15%', 
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: margen >= 30 ? '#059669' : margen >= 15 ? '#ca8a04' : '#dc2626'
                    }]}>
                      {margen.toFixed(1)}%
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Productos con Stock Crítico o Bajo */}
          {reportes.data.productos_stock.filter(p => p.estado_stock !== 'NORMAL').length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>PRODUCTOS CON STOCK BAJO/CRÍTICO</Text>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableCellBold, { width: '40%' }]}>Producto</Text>
                  <Text style={[styles.tableCellBold, { width: '20%', textAlign: 'center' }]}>Stock</Text>
                  <Text style={[styles.tableCellBold, { width: '20%', textAlign: 'center' }]}>Mínimo</Text>
                  <Text style={[styles.tableCellBold, { width: '20%', textAlign: 'center' }]}>Estado</Text>
                </View>
                {reportes.data.productos_stock
                  .filter(p => p.estado_stock !== 'NORMAL')
                  .slice(0, 15)
                  .map((producto, idx) => (
                    <View key={idx} style={[styles.tableRow, idx % 2 === 0 && styles.tableRowEven]}>
                      <View style={{ width: '40%' }}>
                        <Text style={styles.tableCellBold}>{producto.nombre}</Text>
                        <Text style={[styles.tableCell, { fontSize: 7, color: '#6b7280' }]}>
                          {producto.codigoProducto}
                        </Text>
                      </View>
                      <Text style={[styles.tableCellBold, { width: '20%', textAlign: 'center' }]}>
                        {producto.stock}
                      </Text>
                      <Text style={[styles.tableCell, { width: '20%', textAlign: 'center' }]}>
                        {producto.stockMinimo}
                      </Text>
                      <Text style={[styles.tableCellBold, { 
                        width: '20%', 
                        textAlign: 'center',
                        color: producto.estado_stock === 'CRÍTICO' ? '#dc2626' : '#ca8a04'
                      }]}>
                        {producto.estado_stock}
                      </Text>
                    </View>
                  ))}
              </View>
            </View>
          )}

          <View style={styles.footer}>
            <Text>Reporte Gerencial - Sistema de Gestión - Página 2</Text>
          </View>
        </Page>
      )}
    </Document>
  );
};

export default ReportePDF;