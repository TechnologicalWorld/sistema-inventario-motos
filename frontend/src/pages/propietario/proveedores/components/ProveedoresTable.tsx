import React from "react";
import { FiEye, FiEdit2, FiTrash, FiDownload ,  FiChevronLeft,
  FiChevronRight,} from "react-icons/fi";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { Proveedor } from "../proveedores.service";

interface Props {
  proveedores: Proveedor[];
  loading: boolean;
  error: string | null;
  pagination: { currentPage: number; lastPage: number; total: number };
  onPageChange: (page: number) => void;
  onVerDetalle: (p: Proveedor) => void;
  onEditar: (p: Proveedor) => void;
  onEliminar: (p: Proveedor) => void;
}

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#333',
    borderBottomStyle: 'solid',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 11,
    color: '#555',
    marginBottom: 3,
  },
  table: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderStyle: 'solid',
    borderRadius: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#d1d5db',
    padding: 8,
    fontWeight: 'bold',
    fontSize: 9,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    borderBottomStyle: 'solid',
    fontSize: 9,
  },
  tableRowAlt: {
    backgroundColor: '#f9fafb',
  },
  col1: { width: '12%' },
  col2: { width: '20%' },
  col3: { width: '15%' },
  col4: { width: '12%' },
  col5: { width: '18%' },
  col6: { width: '10%', textAlign: 'center' },
  col7: { width: '13%', textAlign: 'right' },
  summarySection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderStyle: 'solid',
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    fontSize: 10,
  },
  statsSection: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  statCard: {
    width: '48%',
    padding: 10,
    backgroundColor: '#f0f7ff',
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#d1e9ff',
    borderStyle: 'solid',
  },
  statTitle: {
    fontSize: 9,
    color: '#555',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#666',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    borderTopStyle: 'solid',
    paddingTop: 10,
  },
});

// Componente PDF
const ProveedoresReportePDF: React.FC<{ proveedores: Proveedor[] }> = ({ proveedores }) => {
  const fechaGeneracion = new Date().toLocaleDateString('es-ES');
  const horaGeneracion = new Date().toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Calcular estadísticas
  const totalProveedores = proveedores.length;
  const proveedoresConCompras = proveedores.filter(p => (p.compras_count ?? 0) > 0).length;
  const totalCompradoGeneral = proveedores.reduce((acc, p) => {
    // si backend trae total_comprado úsalo, sino sumar sobre compras
    if (p.total_comprado != null) return acc + Number(p.total_comprado || 0);
    const comprasArr = Array.isArray(p.compras) ? p.compras : [];
    const sum = comprasArr.reduce((s, c: any) => {
      const v = parseFloat(c.totalPago ?? c.total_pago ?? c.total ?? 0);
      return s + (isNaN(v) ? 0 : v);
    }, 0);
    return acc + sum;
  }, 0);
  const totalComprasGeneral = proveedores.reduce(
    (acc, p) => {
      if (p.compras_count != null) return acc + (p.compras_count ?? 0);
      return acc + (Array.isArray(p.compras) ? p.compras.length : 0);
    },
    0
  );
  const comprasPromedioPorProveedor = totalProveedores > 0 ? totalComprasGeneral / totalProveedores : 0;
  const montoPromedioPorProveedor = totalProveedores > 0 ? totalCompradoGeneral / totalProveedores : 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>REPORTE DE PROVEEDORES</Text>
          <Text style={styles.subtitle}>
            Generado: {fechaGeneracion} a las {horaGeneracion}
          </Text>
          <Text style={styles.subtitle}>
            Total de proveedores: {totalProveedores}
          </Text>
        </View>

        {/* Tabla de proveedores */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>ID</Text>
            <Text style={styles.col2}>Nombre</Text>
            <Text style={styles.col3}>Contacto</Text>
            <Text style={styles.col4}>Teléfono</Text>
            <Text style={styles.col5}>Dirección</Text>
            <Text style={styles.col6}>Nº Compras</Text>
            <Text style={styles.col7}>Total Comprado</Text>
          </View>
          {proveedores.map((proveedor, idx) => {
            const idFormateado = `P-${proveedor.idEmpresaP.toString().padStart(3, "0")}`;
            const comprasArr = Array.isArray(proveedor.compras) ? proveedor.compras : [];
            const comprasCount = proveedor.compras_count != null ? proveedor.compras_count : comprasArr.length;
            const totalCompradoNum = proveedor.total_comprado != null
              ? Number(proveedor.total_comprado)
              : comprasArr.reduce((s: number, c: any) => {
                  const v = parseFloat(c.totalPago ?? c.total_pago ?? c.total ?? 0);
                  return s + (isNaN(v) ? 0 : v);
                }, 0);
            const totalComprado = Number(totalCompradoNum).toFixed(2);

            return (
              <View
                key={proveedor.idEmpresaP}
                style={[styles.tableRow, idx % 2 === 1 && styles.tableRowAlt]}
              >
                <Text style={styles.col1}>{idFormateado}</Text>
                <Text style={styles.col2}>{proveedor.nombre}</Text>
                <Text style={styles.col3}>{proveedor.contacto}</Text>
                <Text style={styles.col4}>{proveedor.telefono}</Text>
                <Text style={styles.col5}>{proveedor.direccion}</Text>
                <Text style={styles.col6}>{comprasCount}</Text>
                <Text style={styles.col7}>Bs. {totalComprado}</Text>
              </View>
            );
          })}
        </View>

        {/* Resumen */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Resumen General</Text>
          
          <View style={styles.summaryRow}>
            <Text>Total de proveedores registrados:</Text>
            <Text style={{ fontWeight: 'bold' }}>{totalProveedores}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text>Proveedores con compras registradas:</Text>
            <Text style={{ fontWeight: 'bold' }}>{proveedoresConCompras}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text>Total de compras realizadas:</Text>
            <Text style={{ fontWeight: 'bold' }}>{totalComprasGeneral}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text>Monto total comprado a proveedores:</Text>
            <Text style={{ fontWeight: 'bold' }}>
              Bs. {totalCompradoGeneral.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Estadísticas */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Compras promedio por proveedor</Text>
            <Text style={styles.statValue}>{comprasPromedioPorProveedor.toFixed(1)}</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Monto promedio por proveedor</Text>
            <Text style={styles.statValue}>Bs. {montoPromedioPorProveedor.toFixed(2)}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Reporte de Proveedores - Generado el {fechaGeneracion}</Text>
        </View>
      </Page>
    </Document>
  );
};

const ProveedoresTable: React.FC<Props> = ({
  proveedores,
  loading,
  error,
  pagination,
  onPageChange,
  onVerDetalle,
  onEditar,
  onEliminar,
}) => {
  return (
    <div>
      {/* Botón de descarga PDF */}
      {!loading && !error && proveedores.length > 0 && (
        <div className="mb-3 flex justify-end">
          <PDFDownloadLink
            document={<ProveedoresReportePDF proveedores={proveedores} />}
            fileName={`reporte-proveedores-${new Date().toISOString().split('T')[0]}.pdf`}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#c0163b] text-white text-sm hover:bg-[#a41333] transition-colors"
          >
            {({ loading: pdfLoading }) => (
              <>
                <FiDownload />
                {pdfLoading ? 'Preparando PDF...' : 'Descargar Reporte'}
              </>
            )}
          </PDFDownloadLink>
        </div>
      )}

      {/* Tabla */}
      <div className="bg-[#f3ebe7] border border-gray-300 rounded-md overflow-hidden">
        <table className="w-full text-xs md:text-sm">
          <thead className="bg-gray-300">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">id Proveedor</th>
              <th className="px-4 py-2 text-left font-semibold">Nombre</th>
              <th className="px-4 py-2 text-left font-semibold">Contacto</th>
              <th className="px-4 py-2 text-left font-semibold">Teléfono</th>
              <th className="px-4 py-2 text-left font-semibold">Dirección</th>
              <th className="px-4 py-2 text-left font-semibold">Nº compras</th>
              <th className="px-4 py-2 text-left font-semibold">
                Total Comprado
              </th>
              <th className="px-4 py-2 text-center font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-6 text-gray-600"
                >
                  Cargando proveedores...
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-6 text-red-600"
                >
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && proveedores.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-6 text-gray-600"
                >
                  No hay proveedores registrados.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              proveedores.map((p, idx) => (
                <tr
                  key={p.idEmpresaP}
                  className={idx % 2 === 0 ? "bg-[#f8f2ee]" : "bg-[#efe4dd]"}
                >
                  <td className="px-4 py-2">
                    P-{p.idEmpresaP.toString().padStart(3, "0")}
                  </td>
                  <td className="px-4 py-2">{p.nombre}</td>
                  <td className="px-4 py-2">{p.contacto}</td>
                  <td className="px-4 py-2">{p.telefono}</td>
                  <td className="px-4 py-2">{p.direccion}</td>
                  {(() => {
                    const comprasArr = Array.isArray(p.compras) ? p.compras : [];
                    const comprasCount = p.compras_count != null ? p.compras_count : comprasArr.length;
                    const totalCompradoNum = p.total_comprado != null
                      ? Number(p.total_comprado)
                      : comprasArr.reduce((s: number, c: any) => {
                          const v = parseFloat(c.totalPago ?? c.total_pago ?? c.total ?? 0);
                          return s + (isNaN(v) ? 0 : v);
                        }, 0);
                    return (
                      <>
                        <td className="px-4 py-2 text-center">{comprasCount}</td>
                        <td className="px-4 py-2">{totalCompradoNum > 0 ? `Bs. ${totalCompradoNum.toFixed(2)}` : "—"}</td>
                      </>
                    );
                  })()}
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onVerDetalle(p)}
                        className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs hover:bg-indigo-700"
                        title="Ver detalle"
                      >
                        <FiEye />
                      </button>
                  
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {/* Paginación */}
       <div className="mt-5 flex items-center justify-center gap-4">
          <button
            disabled={pagination.currentPage <= 1}
            onClick={() => onPageChange(pagination.currentPage - 1)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 text-sm ${
              pagination.currentPage <= 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white text-gray-800 hover:bg-gray-100"
            }`}
          >
            <FiChevronLeft />
            <span>Anterior</span>
          </button>

          <span className="text-sm text-gray-700">
            Página {pagination.currentPage} de {pagination.lastPage}
          </span>

          <button
            disabled={pagination.currentPage >= pagination.lastPage}
            onClick={() => onPageChange(pagination.currentPage + 1)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 text-sm ${
              pagination.currentPage >= pagination.lastPage
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white text-gray-800 hover:bg-gray-100"
            }`}
          >
            <span>Siguiente</span>
            <FiChevronRight />
          </button>
        </div>
    </div>
  );
};

export default ProveedoresTable;