import React from "react";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { VentaHistorial } from "../clientes.service";

interface Props {
  venta: VentaHistorial | null;
  open: boolean;
  onClose: () => void;
}

function formatFecha(fechaIso: string) {
  const d = new Date(fechaIso);
  if (Number.isNaN(d.getTime())) return { fecha: fechaIso, hora: "" };
  const dia = d.getDate().toString().padStart(2, "0");
  const mes = (d.getMonth() + 1).toString().padStart(2, "0");
  const anio = d.getFullYear();
  const horas = d.getHours().toString().padStart(2, "0");
  const mins = d.getMinutes().toString().padStart(2, "0");
  return { fecha: `${dia}/${mes}/${anio}`, hora: `${horas}:${mins}` };
}

// Estilos para el PDF (formato recibo)
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: 'Helvetica',
  },
  receipt: {
    maxWidth: 300,
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'dashed',
  },
  storeName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  storeInfo: {
    fontSize: 8,
    marginBottom: 2,
  },
  receiptTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 3,
  },
  receiptNumber: {
    fontSize: 10,
    marginBottom: 2,
  },
  infoSection: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'dashed',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
    fontSize: 9,
  },
  label: {
    fontWeight: 'bold',
  },
  value: {
    textAlign: 'right',
  },
  itemsHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  itemRow: {
    marginBottom: 8,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderBottomStyle: 'dotted',
  },
  itemName: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
  },
  itemPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 9,
    marginTop: 2,
  },
  totalsSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#000',
    borderTopStyle: 'solid',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    fontSize: 9,
  },
  grandTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#000',
    borderTopStyle: 'double',
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#000',
    borderTopStyle: 'dashed',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 8,
    marginBottom: 3,
  },
  thankYou: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 8,
  },
});

// Componente PDF (formato recibo)
const VentaReciboPDF: React.FC<{ venta: VentaHistorial }> = ({ venta }) => {
  const { fecha, hora } = formatFecha(venta.fecha);
  const totalItems = venta.detalle_ventas.reduce((acc, item) => acc + item.cantidad, 0);
  const montoTotal = Number(venta.montoTotal || 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.receipt}>
          {/* Header del recibo */}
          <View style={styles.header}>
            <Text style={styles.storeName}>MI TIENDA</Text>
            <Text style={styles.storeInfo}>Dirección de la tienda</Text>
            <Text style={styles.storeInfo}>Tel: (123) 456-7890</Text>
            <Text style={styles.storeInfo}>NIT: 123456789</Text>
            <Text style={styles.receiptTitle}>RECIBO DE VENTA</Text>
            <Text style={styles.receiptNumber}>
              N° {venta.idVenta.toString().padStart(6, '0')}
            </Text>
          </View>

          {/* Información de la venta */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Fecha:</Text>
              <Text style={styles.value}>{fecha}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Hora:</Text>
              <Text style={styles.value}>{hora}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Cliente:</Text>
              <Text style={styles.value}>{venta.descripcion}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Atendido por:</Text>
              <Text style={styles.value}>
                {venta.empleado.persona.nombres} {venta.empleado.persona.paterno}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Método de pago:</Text>
              <Text style={[styles.value, { textTransform: 'capitalize' }]}>
                {venta.metodoPago}
              </Text>
            </View>
          </View>

          {/* Items */}
          <Text style={styles.itemsHeader}>DETALLE DE COMPRA</Text>

          {venta.detalle_ventas.map((item) => {
            const nombreProd = item.producto?.nombre || item.descripcion || `Producto`;
            const codigoProd = item.producto?.codigoProducto || '';
            
            return (
              <View key={item.idDetalleVenta} style={styles.itemRow}>
                <Text style={styles.itemName}>{nombreProd}</Text>
                {codigoProd && (
                  <View style={styles.itemDetails}>
                    <Text>Código: {codigoProd}</Text>
                    <Text>Precio Unit: Bs. {Number(item.precioUnitario).toFixed(2)}</Text>
                  </View>
                )}
                <View style={styles.itemPrice}>
                  <Text>{item.cantidad} x Bs. {Number(item.precioUnitario).toFixed(2)}</Text>
                  <Text style={{ fontWeight: 'bold' }}>
                    Bs. {Number(item.subTotal).toFixed(2)}
                  </Text>
                </View>
              </View>
            );
          })}

          {/* Totales */}
          <View style={styles.totalsSection}>
            <View style={styles.totalRow}>
              <Text>Total de artículos:</Text>
              <Text style={{ fontWeight: 'bold' }}>{totalItems}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text>Subtotal:</Text>
              <Text>Bs. {montoTotal.toFixed(2)}</Text>
            </View>
            <View style={styles.grandTotal}>
              <Text>TOTAL A PAGAR:</Text>
              <Text>Bs. {montoTotal.toFixed(2)}</Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Este documento es válido como comprobante de compra
            </Text>
            <Text style={styles.footerText}>
              Gracias por su preferencia
            </Text>
            <Text style={styles.thankYou}>¡VUELVA PRONTO!</Text>
            <Text style={[styles.footerText, { marginTop: 10 }]}>
              {fecha} - {hora}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

const VentaDetalleModal: React.FC<Props> = ({ venta, open, onClose }) => {
  if (!open || !venta) return null;

  const { fecha, hora } = formatFecha(venta.fecha);
  const totalItems = venta.detalle_ventas.reduce(
    (acc, item) => acc + item.cantidad,
    0
  );
  const montoTotal = Number(venta.montoTotal || 0);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-[#f5ede8] w-full max-w-3xl rounded-md shadow-lg border border-gray-400 max-h-[90vh] overflow-y-auto">
        {/* CABECERA */}
        <div className="bg-[#e5ddda] px-6 py-3 rounded-t-md text-left">
          <h2 className="font-semibold text-lg text-gray-800">
            DETALLE DE VENTA / V-{venta.idVenta.toString().padStart(4, "0")}
          </h2>
        </div>

        {/* INFO GENERAL */}
        <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm bg-[#f0e7e2] border-b border-gray-300">
          <div>
            <div className="flex justify-between mb-1">
              <span className="font-semibold">Fecha:</span>
              <span>{fecha}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="font-semibold">Hora:</span>
              <span>{hora}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="font-semibold">Cliente:</span>
              <span>{venta.descripcion}</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="font-semibold">Vendedor:</span>
              <span>
                {venta.empleado.persona.nombres}{" "}
                {venta.empleado.persona.paterno}
              </span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="font-semibold">Método de pago:</span>
              <span className="capitalize">{venta.metodoPago}</span>
            </div>
          </div>
        </div>

        {/* TABLA ITEMS */}
        <div className="px-6 pt-4 pb-2">
          <h3 className="font-semibold text-sm mb-2">
            Tabla de items
          </h3>
          <div className="border border-gray-300 bg-[#f3ebe7] rounded-md overflow-hidden">
            <table className="w-full text-xs md:text-sm">
              <thead className="bg-gray-300">
                <tr>
                  <th className="px-2 py-2 text-left font-semibold">
                    Item
                  </th>
                  <th className="px-2 py-2 text-left font-semibold">
                    Producto (Id Producto)
                  </th>
                  <th className="px-2 py-2 text-left font-semibold">
                    Precio Unitario
                  </th>
                  <th className="px-2 py-2 text-left font-semibold">
                    Cantidad
                  </th>
                  <th className="px-2 py-2 text-left font-semibold">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody>
                {venta.detalle_ventas.map((item, idx) => (
                  <tr
                    key={item.idDetalleVenta}
                    className={
                      idx % 2 === 0
                        ? "bg-[#f8f2ee]"
                        : "bg-[#efe4dd]"
                    }
                  >
                    <td className="px-2 py-1 text-center">
                      {idx + 1}
                    </td>
                    <td className="px-2 py-1">
                      {item.producto?.nombre ?? item.descripcion}{" "}
                      {item.producto &&
                        `(${item.producto.codigoProducto})`}
                    </td>
                    <td className="px-2 py-1">
                      Bs. {Number(item.precioUnitario).toFixed(2)}
                    </td>
                    <td className="px-2 py-1 text-center">
                      {item.cantidad}
                    </td>
                    <td className="px-2 py-1">
                      Bs. {Number(item.subTotal).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RESUMEN */}
        <div className="px-6 pb-4 flex justify-end">
          <div className="bg-[#f0e7e2] border border-gray-300 rounded-md px-4 py-3 text-sm w-full md:w-64">
            <h4 className="font-semibold mb-2">Resumen de Venta</h4>
            <div className="flex justify-between mb-1">
              <span>Total ítems:</span>
              <span>{totalItems}</span>
            </div>
            <div className="flex justify-between">
              <span>Monto total:</span>
              <span>Bs. {montoTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-3 flex justify-center gap-3">
          <PDFDownloadLink
            document={<VentaReciboPDF venta={venta} />}
            fileName={`recibo-${venta.idVenta.toString().padStart(6, '0')}.pdf`}
            className="px-6 py-2 rounded-sm bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
          >
            {({ loading }) => (loading ? 'Preparando recibo...' : 'Descargar Recibo PDF')}
          </PDFDownloadLink>
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

export default VentaDetalleModal;