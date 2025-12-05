import React, { useRef } from "react";
import { FiX, FiDownload, FiPrinter } from "react-icons/fi";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { Venta } from "../services/empleado.ventas.service";

interface Props {
  venta: Venta | null;
  open: boolean;
  onClose: () => void;
}

// Estilos para el PDF (recibo)
const styles = StyleSheet.create({
  page: {
    padding: 25,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#fff',
  },
  receiptContainer: {
    borderWidth: 2,
    borderColor: '#000',
    borderStyle: 'solid',
    borderRadius: 8,
    padding: 20,
    backgroundColor: '#fff',
    minHeight: '95%',
  },
  header: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#333',
    borderBottomStyle: 'solid',
    textAlign: 'center',
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#c0163b',
  },
  companyInfo: {
    fontSize: 8,
    color: '#666',
    marginBottom: 3,
    textAlign: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 10,
    color: '#555',
    marginBottom: 8,
    textAlign: 'center',
  },
  receiptInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderBottomStyle: 'dashed',
  },
  infoColumn: {
    width: '48%',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  infoLabel: {
    fontWeight: 'bold',
    fontSize: 9,
  },
  infoValue: {
    fontSize: 9,
  },
  table: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'solid',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 5,
    fontWeight: 'bold',
    fontSize: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderBottomStyle: 'solid',
    fontSize: 8,
  },
  col1: { width: '8%', textAlign: 'center' },
  col2: { width: '32%' },
  col3: { width: '15%' },
  col4: { width: '15%', textAlign: 'right' },
  col5: { width: '15%', textAlign: 'center' },
  col6: { width: '15%', textAlign: 'right' },
  totals: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    alignSelf: 'flex-end',
    width: '60%',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    fontSize: 10,
  },
  grandTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#333',
    borderTopStyle: 'solid',
    fontSize: 11,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    borderTopStyle: 'solid',
    textAlign: 'center',
    fontSize: 8,
    color: '#666',
  },
  thankYou: {
    fontSize: 9,
    fontStyle: 'italic',
    marginTop: 15,
    textAlign: 'center',
    color: '#333',
  },
  qrPlaceholder: {
    marginTop: 10,
    alignItems: 'center',
  },
  qrText: {
    fontSize: 7,
    color: '#999',
    marginTop: 5,
  },
});

// Componente PDF para el recibo
const ReciboVentaPDF: React.FC<{ venta: Venta }> = ({ venta }) => {
  const fechaGeneracion = new Date().toLocaleDateString('es-ES');
  const horaGeneracion = new Date().toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  const fechaVenta = new Date(venta.fecha);
  const fechaFormateada = fechaVenta.toLocaleDateString('es-ES');
  const horaFormateada = fechaVenta.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const detalles = venta.detalle_ventas || [];
  const totalItems = detalles.reduce((acc, item) => acc + (item.cantidad || 0), 0);

  const parseToNumber = (value: any): number => {
    if (value === null || value === undefined) return 0;
    const num = typeof value === 'string' ? parseFloat(value) : Number(value);
    return isNaN(num) ? 0 : num;
  };

  const montoTotal = parseToNumber(venta.montoTotal);

  const nombreCliente = venta.cliente 
    ? `${venta.cliente.persona.nombres} ${venta.cliente.persona.paterno} ${venta.cliente.persona.materno}`
    : "Cliente no registrado";

  const ciCliente = venta.cliente?.persona.ci || "—";
  const nitCliente = venta.cliente?.nit || "—";

  return (
    <Document>
      <Page size="A6" style={styles.page}>
        <View style={styles.receiptContainer}>
          {/* Encabezado del recibo */}
          <View style={styles.header}>
            <Text style={styles.companyName}>TIENDA COMERCIAL</Text>
            <Text style={styles.companyInfo}>Av. Principal #123, Ciudad</Text>
            <Text style={styles.companyInfo}>Tel: (591) 1234-5678 | NIT: 123456789</Text>
            <Text style={styles.companyInfo}>Facturación Electrónica</Text>
            
            <Text style={styles.title}>RECIBO DE VENTA</Text>
            <Text style={styles.subtitle}>N° V-{venta.idVenta.toString().padStart(4, "0")}</Text>
            <Text style={{ fontSize: 8, textAlign: 'center', color: '#666' }}>
              Generado: {fechaGeneracion} {horaGeneracion}
            </Text>
          </View>

          {/* Información de la venta */}
          <View style={styles.receiptInfo}>
            <View style={styles.infoColumn}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Fecha:</Text>
                <Text style={styles.infoValue}>{fechaFormateada}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Hora:</Text>
                <Text style={styles.infoValue}>{horaFormateada}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Cliente:</Text>
                <Text style={styles.infoValue}>{nombreCliente}</Text>
              </View>
            </View>

            <View style={styles.infoColumn}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>CI/NIT:</Text>
                <Text style={styles.infoValue}>{ciCliente} / {nitCliente}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Método Pago:</Text>
                <Text style={styles.infoValue}>{venta.metodoPago}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Vendedor:</Text>
                <Text style={styles.infoValue}>
                  {venta.empleado?.persona?.nombres || "—"}
                </Text>
              </View>
            </View>
          </View>

          {/* Tabla de productos */}
          <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 5 }}>
            DETALLE DE PRODUCTOS:
          </Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.col1}>#</Text>
              <Text style={styles.col2}>PRODUCTO</Text>
              <Text style={styles.col3}>CÓDIGO</Text>
              <Text style={styles.col4}>PRECIO</Text>
              <Text style={styles.col5}>CANT</Text>
              <Text style={styles.col6}>SUBTOTAL</Text>
            </View>
            {detalles.map((item, idx) => {
              const precioUnitario = parseToNumber(item.precioUnitario);
              const subTotal = parseToNumber(item.subTotal);
              const productoNombre = item.producto?.nombre || item.descripcion || "Producto";
              const productoCodigo = item.producto?.codigoProducto || "—";

              return (
                <View key={item.idDetalleVenta} style={styles.tableRow}>
                  <Text style={styles.col1}>{idx + 1}</Text>
                  <Text style={styles.col2}>{productoNombre}</Text>
                  <Text style={styles.col3}>{productoCodigo}</Text>
                  <Text style={styles.col4}>{precioUnitario.toFixed(2)}</Text>
                  <Text style={styles.col5}>{item.cantidad || 0}</Text>
                  <Text style={styles.col6}>{subTotal.toFixed(2)}</Text>
                </View>
              );
            })}
          </View>

          {/* Totales */}
          <View style={styles.totals}>
            <View style={styles.totalRow}>
              <Text>Total Ítems:</Text>
              <Text>{totalItems}</Text>
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

          {/* Información adicional */}
          {venta.descripcion && (
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontSize: 8, fontStyle: 'italic' }}>
                Obs: {venta.descripcion}
              </Text>
            </View>
          )}

          {/* Mensaje de agradecimiento */}
          <View style={styles.thankYou}>
            <Text>¡Gracias por su compra!</Text>
            <Text>Vuelva pronto</Text>
          </View>

          {/* QR Placeholder (para código QR en implementación real) */}
          <View style={styles.qrPlaceholder}>
            <View style={{ width: 60, height: 60, backgroundColor: '#f0f0f0', borderWidth: 1, borderColor: '#ddd' }} />
            <Text style={styles.qrText}>Código QR para validación</Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text>Recibo válido como comprobante de venta</Text>
            <Text>Original - Conservar este comprobante</Text>
            <Text>Autorización SAR N°: 123456789</Text>
            <Text>CUF: {venta.idVenta.toString().padStart(20, "0")}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

// Funciones de formato para el modal
function formatFecha(fechaIso: string) {
  const d = new Date(fechaIso);
  if (Number.isNaN(d.getTime())) return { fecha: "-", hora: "-" };
  const dia = d.getDate().toString().padStart(2, "0");
  const mes = (d.getMonth() + 1).toString().padStart(2, "0");
  const anio = d.getFullYear();
  const horas = d.getHours().toString().padStart(2, "0");
  const mins = d.getMinutes().toString().padStart(2, "0");
  return { fecha: `${dia}/${mes}/${anio}`, hora: `${horas}:${mins}` };
}

function parseToNumber(value: any): number {
  if (value === null || value === undefined) return 0;
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  return isNaN(num) ? 0 : num;
}

const VentaDetalleModal: React.FC<Props> = ({ venta, open, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  if (!open || !venta) return null;

  const { fecha, hora } = formatFecha(venta.fecha);
  const detalles = venta.detalle_ventas || [];
  const totalItems = detalles.reduce((acc, item) => acc + (item.cantidad || 0), 0);
  const montoTotal = parseToNumber(venta.montoTotal);

  const nombreCliente = venta.cliente 
    ? `${venta.cliente.persona.nombres} ${venta.cliente.persona.paterno} ${venta.cliente.persona.materno}`
    : "Cliente no registrado";

  // Función para imprimir el recibo
  const handlePrint = () => {
    if (modalRef.current) {
      const printContent = modalRef.current.innerHTML;
      const originalContent = document.body.innerHTML;
      
      // Crear ventana de impresión
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Recibo de Venta V-${venta.idVenta.toString().padStart(4, "0")}</title>
              <style>
                body { 
                  font-family: 'Courier New', monospace; 
                  margin: 20px; 
                  font-size: 12px;
                  color: #000;
                }
                .receipt-print {
                  border: 2px solid #000;
                  padding: 20px;
                  max-width: 300px;
                  margin: 0 auto;
                  background: white;
                }
                .company-header {
                  text-align: center;
                  margin-bottom: 15px;
                  border-bottom: 2px solid #000;
                  padding-bottom: 10px;
                }
                .company-name {
                  font-size: 18px;
                  font-weight: bold;
                  color: #c0163b;
                  margin-bottom: 5px;
                }
                .company-info {
                  font-size: 9px;
                  color: #666;
                  margin-bottom: 2px;
                }
                .receipt-title {
                  font-size: 14px;
                  font-weight: bold;
                  text-align: center;
                  margin: 10px 0;
                }
                .receipt-number {
                  font-size: 11px;
                  text-align: center;
                  margin-bottom: 10px;
                }
                .info-section {
                  margin-bottom: 15px;
                  padding-bottom: 10px;
                  border-bottom: 1px dashed #000;
                }
                .info-row {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 4px;
                }
                .info-label {
                  font-weight: bold;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 10px 0;
                  font-size: 10px;
                }
                th {
                  background: #f0f0f0;
                  padding: 5px;
                  border: 1px solid #ddd;
                  text-align: left;
                  font-weight: bold;
                }
                td {
                  padding: 5px;
                  border: 1px solid #ddd;
                }
                .totals {
                  margin-top: 15px;
                  padding: 10px;
                  background: #f9f9f9;
                  border: 1px solid #ddd;
                  width: 60%;
                  float: right;
                }
                .total-row {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 5px;
                }
                .grand-total {
                  display: flex;
                  justify-content: space-between;
                  margin-top: 8px;
                  padding-top: 8px;
                  border-top: 2px solid #000;
                  font-weight: bold;
                  font-size: 11px;
                }
                .footer {
                  margin-top: 20px;
                  padding-top: 10px;
                  border-top: 1px solid #ddd;
                  text-align: center;
                  font-size: 8px;
                  color: #666;
                  clear: both;
                }
                .thank-you {
                  font-style: italic;
                  text-align: center;
                  margin: 15px 0;
                  font-size: 9px;
                }
                @media print {
                  body { margin: 0; padding: 10px; }
                  .no-print { display: none !important; }
                }
                .no-print { 
                  text-align: center; 
                  margin: 20px 0; 
                  padding: 10px;
                  background: #f0f0f0;
                  border: 1px dashed #ccc;
                }
              </style>
            </head>
            <body>
              <div class="receipt-print">
                <div class="company-header">
                  <div class="company-name">TIENDA COMERCIAL</div>
                  <div class="company-info">Av. Principal #123, Ciudad</div>
                  <div class="company-info">Tel: (591) 1234-5678 | NIT: 123456789</div>
                  <div class="company-info">Facturación Electrónica</div>
                </div>
                
                <div class="receipt-title">RECIBO DE VENTA</div>
                <div class="receipt-number">N° V-${venta.idVenta.toString().padStart(4, "0")}</div>
                
                <div class="info-section">
                  <div class="info-row">
                    <span class="info-label">Fecha:</span>
                    <span>${fecha}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Hora:</span>
                    <span>${hora}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Cliente:</span>
                    <span>${nombreCliente}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">CI/NIT:</span>
                    <span>${venta.cliente?.persona.ci || "—"} / ${venta.cliente?.nit || "—"}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Método Pago:</span>
                    <span>${venta.metodoPago}</span>
                  </div>
                </div>
                
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>PRODUCTO</th>
                      <th>CÓDIGO</th>
                      <th>PRECIO</th>
                      <th>CANT</th>
                      <th>SUBTOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${detalles.map((item, idx) => {
                      const precioUnitario = parseToNumber(item.precioUnitario);
                      const subTotal = parseToNumber(item.subTotal);
                      return `
                        <tr>
                          <td>${idx + 1}</td>
                          <td>${item.producto?.nombre || item.descripcion}</td>
                          <td>${item.producto?.codigoProducto || "—"}</td>
                          <td>${precioUnitario.toFixed(2)}</td>
                          <td>${item.cantidad}</td>
                          <td>${subTotal.toFixed(2)}</td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
                
                <div class="totals">
                  <div class="total-row">
                    <span>Total Ítems:</span>
                    <span>${totalItems}</span>
                  </div>
                  <div class="total-row">
                    <span>Subtotal:</span>
                    <span>Bs. ${montoTotal.toFixed(2)}</span>
                  </div>
                  <div class="grand-total">
                    <span>TOTAL A PAGAR:</span>
                    <span>Bs. ${montoTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                ${venta.descripcion ? `
                  <div style="margin-top: 10px; font-size: 9px; font-style: italic;">
                    Obs: ${venta.descripcion}
                  </div>
                ` : ''}
                
                <div class="thank-you">
                  <div>¡Gracias por su compra!</div>
                  <div>Vuelva pronto</div>
                </div>
                
                <div class="footer">
                  <div>Recibo válido como comprobante de venta</div>
                  <div>Original - Conservar este comprobante</div>
                  <div>Autorización SAR N°: 123456789</div>
                  <div>CUF: ${venta.idVenta.toString().padStart(20, "0")}</div>
                </div>
                
                <div class="no-print">
                  <p>Este recibo está listo para imprimir. Use Ctrl+P para imprimir.</p>
                  <p>Tamaño recomendado: 80mm (tickets) o A6</p>
                </div>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        
        // Esperar a que cargue el contenido antes de imprimir
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-[#f5ede8] w-full max-w-4xl rounded-md shadow-lg border border-gray-400 max-h-[90vh] overflow-y-auto">
        {/* CABECERA */}
        <div className="bg-[#e5ddda] px-6 py-3 rounded-t-md flex justify-between items-center">
          <h2 className="font-semibold text-lg text-gray-800">
            <span className="text-[#c0163b]">RECIBO DE VENTA</span> / V-{venta.idVenta.toString().padStart(4, "0")}
          </h2>
          <div className="flex items-center gap-2">
            {/* Botón para imprimir */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-600 text-white text-xs hover:bg-blue-700 transition-colors"
              title="Imprimir recibo"
            >
              <FiPrinter size={14} />
              Imprimir
            </button>
            
            {/* Botón para descargar PDF */}
            <PDFDownloadLink
              document={<ReciboVentaPDF venta={venta} />}
              fileName={`recibo-venta-${venta.idVenta}.pdf`}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#c0163b] text-white text-xs hover:bg-[#a41333] transition-colors"
            >
              {({ loading }) => (
                <>
                  <FiDownload size={14} />
                  {loading ? '...' : 'PDF'}
                </>
              )}
            </PDFDownloadLink>
            
            <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* PREVIEW DEL RECIBO (para impresión) */}
        <div className="hidden print:block print:mx-auto print:max-w-xs">
          {/* Este contenido solo se muestra al imprimir */}
        </div>

        {/* INFO GENERAL */}
        <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-[#f0e7e2] border-b border-gray-300">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-semibold">Fecha:</span>
              <span>{fecha}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Hora:</span>
              <span>{hora}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Cliente:</span>
              <span className="text-right">{nombreCliente}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-semibold">CI/NIT Cliente:</span>
              <span>{venta.cliente?.persona.ci} / {venta.cliente?.nit || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Método de pago:</span>
              <span className="capitalize">{venta.metodoPago}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Descripción:</span>
              <span>{venta.descripcion || "—"}</span>
            </div>
          </div>
        </div>

        {/* TABLA ITEMS */}
        <div className="px-6 pt-4 pb-2">
          <h3 className="font-semibold text-sm mb-2">Productos Vendidos</h3>
          <div className="border border-gray-300 bg-[#f3ebe7] rounded-md overflow-hidden">
            <table className="w-full text-xs md:text-sm">
              <thead className="bg-gray-300">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">#</th>
                  <th className="px-3 py-2 text-left font-semibold">Producto</th>
                  <th className="px-3 py-2 text-left font-semibold">Código</th>
                  <th className="px-3 py-2 text-left font-semibold">Precio Unitario</th>
                  <th className="px-3 py-2 text-left font-semibold">Cantidad</th>
                  <th className="px-3 py-2 text-left font-semibold">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {detalles.map((item, idx) => {
                  const precioUnitario = parseToNumber(item.precioUnitario);
                  const subTotal = parseToNumber(item.subTotal);
                  
                  return (
                    <tr
                      key={item.idDetalleVenta}
                      className={idx % 2 === 0 ? "bg-[#f8f2ee]" : "bg-[#efe4dd]"}
                    >
                      <td className="px-3 py-2 text-center">{idx + 1}</td>
                      <td className="px-3 py-2">
                        {item.producto?.nombre || item.descripcion}
                      </td>
                      <td className="px-3 py-2">
                        {item.producto?.codigoProducto || "—"}
                      </td>
                      <td className="px-3 py-2">
                        Bs. {precioUnitario.toFixed(2)}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {item.cantidad}
                      </td>
                      <td className="px-3 py-2 font-medium">
                        Bs. {subTotal.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
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
            <div className="flex justify-between mb-1">
              <span>Subtotal:</span>
              <span>Bs. {montoTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-1 mt-1 font-semibold">
              <span>Monto total:</span>
              <span>Bs. {montoTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-3 flex justify-center gap-3 border-t border-gray-300">
          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-sm bg-blue-600 text-white text-sm hover:bg-blue-700 flex items-center gap-2"
          >
            <FiPrinter size={16} />
            Imprimir Recibo
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-sm bg-gray-600 text-white text-sm hover:bg-gray-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default VentaDetalleModal;