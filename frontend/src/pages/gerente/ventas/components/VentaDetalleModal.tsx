import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

interface Venta {
  idVenta: number;
  fecha: string;
  montoTotal: number;
  metodoPago: string;
  cliente: {
    persona: {
      nombres: string;
      paterno: string;
      ci: string;
      telefono: string;
    };
  };
  empleado: {
    persona: {
      nombres: string;
      paterno: string;
    };
  };
  detalle_ventas: Array<{
    idDetalleVenta: number;
    idProducto: number;
    cantidad: number;
    precioUnitario: number;
    subTotal: number;
    descripcion?: string;
    producto?: {
      nombre: string;
    };
  }>;
}

interface Props {
  venta: Venta | null;
  open: boolean;
  onClose: () => void;
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
const VentaPDF: React.FC<{ venta: Venta }> = ({ venta }) => {
  const fechaObj = new Date(venta.fecha);
  const fechaStr = fechaObj.toLocaleDateString('es-ES');
  const horaStr = fechaObj.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const clientePersona = venta.cliente.persona;
  const empleadoPersona = venta.empleado.persona;

  const totalItems = venta.detalle_ventas.reduce((acc, det) => acc + det.cantidad, 0);

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
              <Text style={styles.value}>{fechaStr}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Hora:</Text>
              <Text style={styles.value}>{horaStr}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Cliente:</Text>
              <Text style={styles.value}>
                {clientePersona.nombres} {clientePersona.paterno}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>C.I.:</Text>
              <Text style={styles.value}>{clientePersona.ci}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Teléfono:</Text>
              <Text style={styles.value}>{clientePersona.telefono}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Atendido por:</Text>
              <Text style={styles.value}>
                {empleadoPersona.nombres} {empleadoPersona.paterno}
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

          {venta.detalle_ventas.map((det, idx) => {
            const nombreProd = det.producto?.nombre || det.descripcion || `Producto ${det.idProducto}`;
            return (
              <View key={det.idDetalleVenta} style={styles.itemRow}>
                <Text style={styles.itemName}>
                  {nombreProd}
                </Text>
                <View style={styles.itemDetails}>
                  <Text>Código: P-{det.idProducto.toString().padStart(3, '0')}</Text>
                  <Text>Precio Unit: Bs. {Number(det.precioUnitario).toFixed(2)}</Text>
                </View>
                <View style={styles.itemPrice}>
                  <Text>{det.cantidad} x Bs. {Number(det.precioUnitario).toFixed(2)}</Text>
                  <Text style={{ fontWeight: 'bold' }}>
                    Bs. {Number(det.subTotal).toFixed(2)}
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
              <Text>Bs. {Number(venta.montoTotal).toFixed(2)}</Text>
            </View>
            <View style={styles.grandTotal}>
              <Text>TOTAL A PAGAR:</Text>
              <Text>Bs. {Number(venta.montoTotal).toFixed(2)}</Text>
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
              {fechaStr} - {horaStr}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

// Componente Modal
export const VentaDetalleModal: React.FC<Props> = ({ venta, open, onClose }) => {
  if (!open || !venta) return null;

  const fechaObj = new Date(venta.fecha);
  const fechaStr = fechaObj.toLocaleDateString();
  const horaStr = fechaObj.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const clientePersona = venta.cliente.persona;
  const empleadoPersona = venta.empleado.persona;

  const clienteTexto = `${clientePersona.nombres} ${clientePersona.paterno} (C.I.: ${clientePersona.ci}, Tel. ${clientePersona.telefono})`;
  const vendedorTexto = `${empleadoPersona.nombres} ${empleadoPersona.paterno}`;

  const totalItems = venta.detalle_ventas.reduce((acc, det) => acc + det.cantidad, 0);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-[#f5ede8] w-full max-w-3xl rounded-md shadow-lg border border-gray-400">
        {/* Header */}
        <div className="bg-[#e5ddda] px-6 py-3 rounded-t-md text-left">
          <h2 className="font-semibold text-lg text-gray-800">
            DETALLE DE VENTA / V-{venta.idVenta.toString().padStart(4, '0')}
          </h2>
        </div>

        {/* Info principal */}
        <div className="px-6 py-4 text-sm">
          <div className="grid sm:grid-cols-2 gap-y-1 gap-x-4 mb-4">
            <div className="flex gap-2">
              <span className="font-semibold">Fecha:</span>
              <span>{fechaStr}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Hora:</span>
              <span>{horaStr}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Cliente:</span>
              <span>{clienteTexto}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Vendedor:</span>
              <span>{vendedorTexto}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Método de pago:</span>
              <span className="capitalize">{venta.metodoPago}</span>
            </div>
          </div>

          {/* Detalle de la venta */}
          <h3 className="font-semibold mb-2">Detalle de venta</h3>
          <div className="border border-gray-400 bg-[#f3ebe7] rounded-md overflow-hidden mb-4">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-gray-300">
                <tr>
                  <th className="px-2 py-1 text-left">Item</th>
                  <th className="px-2 py-1 text-left">Producto (id Producto)</th>
                  <th className="px-2 py-1 text-right">Precio Unitario</th>
                  <th className="px-2 py-1 text-right">Cantidad</th>
                  <th className="px-2 py-1 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {venta.detalle_ventas.map((det, idx) => {
                  const nombreProd = det.producto?.nombre || det.descripcion || `Producto ${det.idProducto}`;
                  return (
                    <tr
                      key={det.idDetalleVenta}
                      className={idx % 2 === 0 ? 'bg-[#f8f2ee]' : 'bg-[#efe4dd]'}
                    >
                      <td className="px-2 py-1">{idx + 1}</td>
                      <td className="px-2 py-1">
                        {nombreProd} (P-{det.idProducto.toString().padStart(3, '0')})
                      </td>
                      <td className="px-2 py-1 text-right">
                        Bs. {Number(det.precioUnitario).toFixed(2)}
                      </td>
                      <td className="px-2 py-1 text-right">{det.cantidad}</td>
                      <td className="px-2 py-1 text-right">
                        Bs. {Number(det.subTotal).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Resumen lateral */}
          <div className="flex flex-col sm:flex-row sm:justify-end">
            <div className="border border-gray-400 bg-[#ece5e0] rounded-md px-4 py-3 text-sm w-full sm:w-72">
              <h4 className="font-semibold mb-2">Resumen de venta</h4>
              <div className="flex justify-between mb-1">
                <span>Total ítems:</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span>Monto total:</span>
                <span className="font-semibold">Bs. {Number(venta.montoTotal).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 flex justify-center gap-3">
          <PDFDownloadLink
            document={<VentaPDF venta={venta} />}
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