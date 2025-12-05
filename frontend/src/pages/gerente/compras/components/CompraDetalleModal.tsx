import React from "react";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { useCompraDetalle } from "../hooks/useCompraDetalle";
import { DetalleCompra } from "../compras.service";

interface Props {
  compraId: number | null;
  open: boolean;
  onClose: () => void;
}

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

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
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
    textAlign: 'center',
    marginBottom: 5,
  },
  infoBox: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderStyle: 'solid',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 5,
    minWidth: 90,
  },
  value: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    color: '#374151',
  },
  table: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderStyle: 'solid',
    borderRadius: 5,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#d1d5db',
    padding: 10,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    borderBottomStyle: 'solid',
  },
  tableRowAlt: {
    backgroundColor: '#f9fafb',
  },
  col1: { width: '40%', paddingRight: 10 },
  col2: { width: '20%', textAlign: 'left' },
  col3: { width: '20%', textAlign: 'left' },
  col4: { width: '20%', textAlign: 'left' },
  summaryBox: {
    marginTop: 20,
    alignSelf: 'flex-end',
    width: '45%',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderStyle: 'solid',
  },
  summaryTitle: {
    fontWeight: 'bold',
    fontSize: 11,
    marginBottom: 10,
    color: '#374151',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#6b7280',
    borderTopStyle: 'solid',
    fontWeight: 'bold',
  },
});

// Componente PDF
const CompraPDF: React.FC<{ data: any }> = ({ data }) => {
  const detalles: DetalleCompra[] = data?.detalle_compras ?? [];
  const totalItems = detalles.length;
  const totalUnidades = detalles.reduce((acc, d) => acc + (d.cantidad || 0), 0);
  const totalPago = Number(data?.totalPago || 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            DETALLE DE COMPRA / {formatIdCompra(data.idCompra)}
          </Text>
        </View>

        {/* Información principal */}
        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Fecha:</Text>
            <Text style={styles.value}>{formatFecha(data.fecha)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Proveedor:</Text>
            <Text style={styles.value}>{data.empresa_proveedora?.nombre ?? "-"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Gerente:</Text>
            <Text style={styles.value}>
              {data.gerente?.persona
                ? `${data.gerente.persona.nombres} ${data.gerente.persona.paterno}`
                : "-"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Observación:</Text>
            <Text style={styles.value}>{data.observacion || "-"}</Text>
          </View>
        </View>

        {/* Detalle de compra */}
        <Text style={styles.sectionTitle}>Detalle de Compra</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>Producto</Text>
            <Text style={styles.col2}>Precio Unitario</Text>
            <Text style={styles.col3}>Cantidad</Text>
            <Text style={styles.col4}>Subtotal</Text>
          </View>
          {detalles.map((d, idx) => (
            <View
              key={d.idDetalleCompra}
              style={[styles.tableRow, idx % 2 === 1 && styles.tableRowAlt]}
            >
              <Text style={styles.col1}>{d.producto?.nombre ?? "-"}</Text>
              <Text style={styles.col2}>{formatBs(d.precioUnitario)}</Text>
              <Text style={styles.col3}>{d.cantidad}</Text>
              <Text style={styles.col4}>{formatBs(d.subTotal)}</Text>
            </View>
          ))}
        </View>

        {/* Resumen */}
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Resumen de Compra</Text>
          <View style={styles.summaryRow}>
            <Text>Total ítems:</Text>
            <Text>{totalItems}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Total unidades:</Text>
            <Text>{totalUnidades}</Text>
          </View>
          <View style={styles.summaryTotal}>
            <Text>Total pago:</Text>
            <Text>{formatBs(totalPago)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

const CompraDetalleModal: React.FC<Props> = ({ compraId, open, onClose }) => {
  const { data, loading, error } = useCompraDetalle(compraId, open);

  if (!open) return null;

  const detalles: DetalleCompra[] = data?.detalle_compras ?? [];

  const totalItems = detalles.length;
  const totalUnidades = detalles.reduce(
    (acc, d) => acc + (d.cantidad || 0),
    0
  );
  const totalPago = Number(data?.totalPago || 0);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-[#f5ede8] w-[95%] max-w-3xl rounded-md shadow-lg border border-gray-400 max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="bg-[#e5ddda] px-6 py-3 rounded-t-md">
          <h2 className="font-semibold text-lg text-gray-800 text-center">
            {data
              ? `DETALLE DE COMPRA / ${formatIdCompra(data.idCompra)}`
              : "DETALLE DE COMPRA"}
          </h2>
        </div>

        {/* BODY */}
        <div className="px-6 py-4 text-sm space-y-4">
          {loading && (
            <div className="text-center text-gray-600">
              Cargando detalle de la compra...
            </div>
          )}
          {!loading && error && (
            <div className="text-center text-red-600">{error}</div>
          )}

          {!loading && !error && data && (
            <>
              {/* Info superior */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border border-gray-300 bg-[#f0e7e2] rounded-md p-3">
                <div className="space-y-1">
                  <div>
                    <span className="font-semibold">Fecha: </span>
                    <span>{formatFecha(data.fecha)}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Proveedor: </span>
                    <span>{data.empresa_proveedora?.nombre ?? "-"}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Gerente: </span>
                    <span>
                      {data.gerente?.persona
                        ? `${data.gerente.persona.nombres} ${data.gerente.persona.paterno}`
                        : "-"}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Observación: </span>
                    <span>{data.observacion || "-"}</span>
                  </div>
                </div>
              </div>

              {/* Tabla de items */}
              <div className="mt-4">
                <h3 className="font-semibold mb-2 text-gray-800">
                  Detalle de Compra
                </h3>
                <div className="border border-gray-300 rounded-md overflow-hidden bg-[#f3ebe7]">
                  <table className="w-full text-xs md:text-sm">
                    <thead className="bg-gray-300">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold">
                          Producto
                        </th>
                        <th className="px-4 py-2 text-left font-semibold">
                          Precio Unitario
                        </th>
                        <th className="px-4 py-2 text-left font-semibold">
                          Cantidad
                        </th>
                        <th className="px-4 py-2 text-left font-semibold">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {detalles.length === 0 && (
                        <tr>
                          <td
                            colSpan={4}
                            className="py-4 text-center text-gray-600"
                          >
                            La compra no tiene ítems registrados.
                          </td>
                        </tr>
                      )}

                      {detalles.map((d, idx) => (
                        <tr
                          key={d.idDetalleCompra}
                          className={
                            idx % 2 === 0 ? "bg-[#f8f2ee]" : "bg-[#efe4dd]"
                          }
                        >
                          <td className="px-4 py-2">
                            {d.producto?.nombre ?? "-"}
                          </td>
                          <td className="px-4 py-2">
                            {formatBs(d.precioUnitario)}
                          </td>
                          <td className="px-4 py-2">{d.cantidad}</td>
                          <td className="px-4 py-2">
                            {formatBs(d.subTotal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Resumen */}
              <div className="mt-4 flex justify-end">
                <div className="border border-gray-300 bg-[#f0e7e2] rounded-md px-4 py-3 text-sm w-full md:w-72">
                  <h4 className="font-semibold mb-2 text-gray-800">
                    Resumen de Compra
                  </h4>
                  <div className="flex justify-between">
                    <span>Total ítems:</span>
                    <span>{totalItems}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total unidades:</span>
                    <span>{totalUnidades}</span>
                  </div>
                  <div className="flex justify-between font-semibold mt-2">
                    <span>Total pago:</span>
                    <span>{formatBs(totalPago)}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-3 flex justify-center gap-3">
          {!loading && !error && data && (
            <PDFDownloadLink
              document={<CompraPDF data={data} />}
              fileName={`compra-${formatIdCompra(data.idCompra)}.pdf`}
              className="px-6 py-2 rounded-sm bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
            >
              {({ loading }) => (loading ? 'Preparando PDF...' : 'Descargar PDF')}
            </PDFDownloadLink>
          )}
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-sm bg-gray-600 text-white text-sm hover:bg-gray-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompraDetalleModal;