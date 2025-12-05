import { FiEye, FiDownload } from "react-icons/fi";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { Venta } from "../ventas.service";

interface Props {
  ventas: Venta[];
  loading: boolean;
  filteredSearch: (v: Venta) => boolean;
  onVerDetalle: (venta: Venta) => void;
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
  col2: { width: '12%' },
  col3: { width: '22%' },
  col4: { width: '22%' },
  col5: { width: '16%' },
  col6: { width: '16%', textAlign: 'right' },
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
const VentasReportePDF: React.FC<{ ventas: Venta[] }> = ({ ventas }) => {
  const fechaGeneracion = new Date().toLocaleDateString('es-ES');
  const horaGeneracion = new Date().toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const totalVentas = ventas.length;
  const montoTotalGeneral = ventas.reduce(
    (acc, v) => acc + Number(v.montoTotal),
    0
  );
  const ticketPromedio = totalVentas > 0 ? montoTotalGeneral / totalVentas : 0;

  const formatFecha = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleDateString('es-ES');
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>REPORTE DE VENTAS</Text>
          <Text style={styles.subtitle}>
            Generado: {fechaGeneracion} a las {horaGeneracion}
          </Text>
          <Text style={styles.subtitle}>
            Total de ventas: {totalVentas}
          </Text>
        </View>

        {/* Tabla de ventas */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>ID Venta</Text>
            <Text style={styles.col2}>Fecha</Text>
            <Text style={styles.col3}>Cliente</Text>
            <Text style={styles.col4}>Vendedor</Text>
            <Text style={styles.col5}>Método Pago</Text>
            <Text style={styles.col6}>Monto Total</Text>
          </View>
          {ventas.map((venta, idx) => {
            const clienteNombre = `${venta.cliente.persona.nombres} ${venta.cliente.persona.paterno}`;
            const empPersona = venta.empleado.persona;
            const empleadoNombre = `${empPersona.nombres} ${empPersona.paterno}`;

            return (
              <View
                key={venta.idVenta}
                style={[styles.tableRow, idx % 2 === 1 && styles.tableRowAlt]}
              >
                <Text style={styles.col1}>
                  V-{venta.idVenta.toString().padStart(4, "0")}
                </Text>
                <Text style={styles.col2}>{formatFecha(venta.fecha)}</Text>
                <Text style={styles.col3}>{clienteNombre}</Text>
                <Text style={styles.col4}>{empleadoNombre}</Text>
                <Text style={[styles.col5, { textTransform: 'capitalize' }]}>
                  {venta.metodoPago}
                </Text>
                <Text style={styles.col6}>
                  Bs. {Number(venta.montoTotal).toFixed(2)}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Resumen */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Resumen General</Text>
          <View style={styles.summaryRow}>
            <Text>Total de ventas registradas:</Text>
            <Text style={{ fontWeight: 'bold' }}>{totalVentas}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Monto total de ventas:</Text>
            <Text style={{ fontWeight: 'bold' }}>
              Bs. {montoTotalGeneral.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Ticket promedio:</Text>
            <Text style={{ fontWeight: 'bold' }}>
              Bs. {ticketPromedio.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Reporte de Ventas - Generado el {fechaGeneracion}</Text>
        </View>
      </Page>
    </Document>
  );
};

export const VentasTable: React.FC<Props> = ({
  ventas,
  loading,
  filteredSearch,
  onVerDetalle,
}) => {
  const formatFecha = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleDateString();
  };

  const formatHora = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const ventasFiltradas = ventas.filter(filteredSearch);

  return (
    <div>
      {/* Botón de descarga */}
      {!loading && ventasFiltradas.length > 0 && (
        <div className="mb-3 flex justify-end">
          <PDFDownloadLink
            document={<VentasReportePDF ventas={ventasFiltradas} />}
            fileName={`reporte-ventas-${new Date().toISOString().split('T')[0]}.pdf`}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#c0163b] text-white text-sm hover:bg-[#a41333] transition-colors"
          >
            {({ loading }) => (
              <>
                <FiDownload />
                {loading ? 'Preparando PDF...' : 'Descargar Reporte'}
              </>
            )}
          </PDFDownloadLink>
        </div>
      )}

      {/* Tabla */}
      <div className="bg-[#f3ebe7] border border-gray-300 rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-300">
            <tr className="text-left">
              <th className="px-4 py-2 font-semibold">id Venta</th>
              <th className="px-4 py-2 font-semibold">Fecha</th>
              <th className="px-4 py-2 font-semibold">Cliente</th>
              <th className="px-4 py-2 font-semibold">
                Empleado (Vendedor)
              </th>
              <th className="px-4 py-2 font-semibold">Método de pago</th>
              <th className="px-4 py-2 font-semibold">Monto Total</th>
              <th className="px-4 py-2 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-6 text-gray-600"
                >
                  Cargando ventas...
                </td>
              </tr>
            )}

            {!loading && ventasFiltradas.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-6 text-gray-600"
                >
                  No se encontraron ventas.
                </td>
              </tr>
            )}

            {!loading &&
              ventasFiltradas.map((venta, idx) => {
                const clienteNombre = `${venta.cliente.persona.nombres} ${venta.cliente.persona.paterno}`;
                const empPersona = venta.empleado.persona;
                const empleadoNombre = `${empPersona.nombres} ${empPersona.paterno}`;

                return (
                  <tr
                    key={venta.idVenta}
                    className={
                      idx % 2 === 0
                        ? "bg-[#f8f2ee]"
                        : "bg-[#efe4dd]"
                    }
                  >
                    <td className="px-4 py-2">V-{venta.idVenta.toString().padStart(4, "0")}</td>
                    <td className="px-4 py-2">
                      {formatFecha(venta.fecha)}
                    </td>
                    <td className="px-4 py-2">{clienteNombre}</td>
                    <td className="px-4 py-2">{empleadoNombre}</td>
                    <td className="px-4 py-2 capitalize">
                      {venta.metodoPago}
                    </td>
                    <td className="px-4 py-2">
                      Bs. {Number(venta.montoTotal).toFixed(2)}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onVerDetalle(venta)}
                          className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs hover:bg-indigo-700"
                          title="Ver detalle"
                        >
                          <FiEye />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};