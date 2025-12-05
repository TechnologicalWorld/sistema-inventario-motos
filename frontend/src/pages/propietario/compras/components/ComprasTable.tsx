import React from "react";
import { FiEye, FiChevronLeft, FiChevronRight, FiDownload } from "react-icons/fi";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { CompraListItem } from "../compras.service";

interface Props {
  items: CompraListItem[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onVerDetalle: (idCompra: number) => void;
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
  col1: { width: '15%' },
  col2: { width: '15%' },
  col3: { width: '20%' },
  col4: { width: '15%', textAlign: 'right' },
  col5: { width: '20%' },
  col6: { width: '15%' },
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
const ComprasReportePDF: React.FC<{ compras: CompraListItem[] }> = ({ compras }) => {
  const fechaGeneracion = new Date().toLocaleDateString('es-ES');
  const horaGeneracion = new Date().toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const totalCompras = compras.length;
  const montoTotalGeneral = compras.reduce(
    (acc, c) => acc + Number(c.totalPago || 0),
    0
  );
  const promedioCompra = totalCompras > 0 ? montoTotalGeneral / totalCompras : 0;

  const formatFecha = (iso: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleDateString('es-ES');
  };

  const formatIdCompra = (id: number) => {
    return `C-${id.toString().padStart(4, "0")}`;
  };

  const formatBs = (value: string | number) => {
    const num = Number(value || 0);
    return `Bs. ${num.toFixed(2)}`;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>REPORTE DE COMPRAS</Text>
          <Text style={styles.subtitle}>
            Generado: {fechaGeneracion} a las {horaGeneracion}
          </Text>
          <Text style={styles.subtitle}>
            Total de compras: {totalCompras}
          </Text>
        </View>

        {/* Tabla de compras */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>ID Compra</Text>
            <Text style={styles.col2}>Fecha</Text>
            <Text style={styles.col3}>Proveedor</Text>
            <Text style={styles.col4}>Total Pago</Text>
            <Text style={styles.col5}>Gerente</Text>
            <Text style={styles.col6}>Observación</Text>
          </View>
          {compras.map((compra, idx) => {
            const nombreProveedor = compra.empresa_proveedora?.nombre ?? "-";
            const nombreGerente = compra.gerente?.persona
              ? `${compra.gerente.persona.nombres} ${compra.gerente.persona.paterno}`
              : "-";
            const observacion = compra.observacion || "-";

            return (
              <View
                key={compra.idCompra}
                style={[styles.tableRow, idx % 2 === 1 && styles.tableRowAlt]}
              >
                <Text style={styles.col1}>
                  {formatIdCompra(compra.idCompra)}
                </Text>
                <Text style={styles.col2}>{formatFecha(compra.fecha)}</Text>
                <Text style={styles.col3}>{nombreProveedor}</Text>
                <Text style={styles.col4}>
                  {formatBs(compra.totalPago ?? 0)}
                </Text>
                <Text style={styles.col5}>{nombreGerente}</Text>
                <Text style={styles.col6}>{observacion}</Text>
              </View>
            );
          })}
        </View>

        {/* Resumen */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Resumen General</Text>
          <View style={styles.summaryRow}>
            <Text>Total de compras registradas:</Text>
            <Text style={{ fontWeight: 'bold' }}>{totalCompras}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Monto total de compras:</Text>
            <Text style={{ fontWeight: 'bold' }}>
              {formatBs(montoTotalGeneral)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Compra promedio:</Text>
            <Text style={{ fontWeight: 'bold' }}>
              {formatBs(promedioCompra)}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Reporte de Compras - Generado el {fechaGeneracion}</Text>
        </View>
      </Page>
    </Document>
  );
};

// Funciones de formato para la tabla HTML
function formatFecha(fechaIso: string) {
  if (!fechaIso) return "-";
  const d = new Date(fechaIso);
  if (Number.isNaN(d.getTime())) return "-";
  const dia = d.getDate().toString().padStart(2, "0");
  const mes = (d.getMonth() + 1).toString().padStart(2, "0");
  const anio = d.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

function formatIdCompra(id: number) {
  return `C-${id.toString().padStart(4, "0")}`;
}

function formatBs(value: string | number) {
  const num = Number(value || 0);
  return `Bs. ${num.toFixed(2)}`;
}

const ComprasTable: React.FC<Props> = ({
  items,
  loading,
  error,
  page,
  totalPages,
  onPageChange,
  onVerDetalle,
}) => {
  return (
    <div>
      {/* Botón de descarga PDF */}
      {!loading && !error && items.length > 0 && (
        <div className="mb-3 flex justify-end">
          <PDFDownloadLink
            document={<ComprasReportePDF compras={items} />}
            fileName={`reporte-compras-${new Date().toISOString().split('T')[0]}.pdf`}
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
              <th className="px-4 py-2 text-left font-semibold">id Compra</th>
              <th className="px-4 py-2 text-left font-semibold">Fecha</th>
              <th className="px-4 py-2 text-left font-semibold">Proveedor</th>
              <th className="px-4 py-2 text-left font-semibold">
                Total pago (Bs.)
              </th>
              <th className="px-4 py-2 text-left font-semibold">Gerente</th>
              <th className="px-4 py-2 text-left font-semibold">Observación</th>
              <th className="px-4 py-2 text-left font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-gray-600">
                  Cargando compras...
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-red-600">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && items.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-gray-600">
                  No hay compras registradas.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              items.map((c, idx) => (
                <tr
                  key={c.idCompra}
                  className={idx % 2 === 0 ? "bg-[#f8f2ee]" : "bg-[#efe4dd]"}
                >
                  <td className="px-4 py-2">{formatIdCompra(c.idCompra)}</td>
                  <td className="px-4 py-2">{formatFecha(c.fecha)}</td>
                  <td className="px-4 py-2">
                    {c.empresa_proveedora?.nombre ?? "-"}
                  </td>
                  <td className="px-4 py-2">
                    {formatBs(c.totalPago ?? 0)}
                  </td>
                  <td className="px-4 py-2">
                    {c.gerente?.persona
                      ? `${c.gerente.persona.nombres} ${c.gerente.persona.paterno}`
                      : "-"}
                  </td>
                  <td className="px-4 py-2 truncate max-w-[220px]">
                    {c.observacion || "-"}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex justify-center">
                      <button
                        onClick={() => onVerDetalle(c.idCompra)}
                        className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs hover:bg-indigo-700"
                        title="Ver detalle de compra"
                      >
                        <FiEye />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Paginación */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <button
            disabled={page <= 1}
            onClick={() => page > 1 && onPageChange(page - 1)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm border ${
              page <= 1
                ? "border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
                : "border-gray-400 text-gray-700 bg-white hover:bg-gray-100"
            }`}
          >
            <FiChevronLeft />
            Anterior
          </button>

          <span className="text-sm text-gray-700">
            Página {page} de {totalPages || 1}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => page < totalPages && onPageChange(page + 1)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm border ${
              page >= totalPages
                ? "border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
                : "border-gray-400 text-gray-700 bg-white hover:bg-gray-100"
            }`}
          >
            Siguiente
            <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComprasTable;