import React, { useEffect, useState, useRef } from "react";
import { FileText, Download, TrendingUp, Users, Package, AlertTriangle } from "lucide-react";
import ReportesService from "./reporte.service";

interface VentaPorEmpleado {
  idPersona: number;
  NombreCompleto: string;
  TotalVendido: number;
  NroVentas: number;
  PromedioVenta: number;
  PrimeraVenta: string;
  UltimaVenta: string;
}

interface CompraPorProducto {
  idProducto: number;
  nombre: string;
  codigoProducto: string;
  descripcion: string;
  TotalPago: number;
  UnitCompradas: number;
  PrecioPromedioCompra: number;
  NroCompras: number;
  UltimaCompra: string;
  PrimeraCompra: string;
  idGerente: number | null;
  NombreGerente: string;
}

interface ProductoStock {
  idProducto: number;
  codigoProducto: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  stock_minimo: number;
  estado_stock: string;
}

interface StockCritico {
  total_productos_criticos: number;
}

interface GananciasProducto {
  idProducto: number;
  nombre: string;
  codigoProducto: string;
  total_ganancias: number;
  total_unidades_vendidas: number;
  ganancia_promedio_unidad: number;
}

interface ResumenGanancias {
  GananciaTotal?: string;
  VentasTotales?: string;
  total_ventas?: string | number;
  total_compras?: string | number;
  ganancia_neta?: string | number;
  porcentaje_ganancia?: string | number;
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

  const contentRef = useRef<HTMLDivElement>(null);

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
  setGeneratingPDF(true);
  
  try {
    if (!(window as any).jspdf) {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    }

    const { jsPDF } = (window as any).jspdf;
    
    if (!jsPDF) {
      throw new Error("No se pudo cargar la librería jsPDF");
    }

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    let yPos = margin;
    
    // Configuración de fuentes y estilos
    pdf.setFont("helvetica", "normal");
    
    // Encabezado del PDF
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.text("REPORTE GERENCIAL", pageWidth / 2, yPos, { align: "center" });
    yPos += 10;
    
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Período: ${meses.find(m => m.valor === mes)?.nombre} ${anio}`, pageWidth / 2, yPos, { align: "center" });
    pdf.text(`Gerente ID: ${idGerente}`, pageWidth / 2, yPos + 5, { align: "center" });
    pdf.text(`Generado: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPos + 10, { align: "center" });
    yPos += 25;
    
    // Función para verificar si necesitamos nueva página
    const checkPageBreak = (neededSpace: number) => {
      if (yPos + neededSpace > pageHeight - margin) {
        pdf.addPage();
        yPos = margin;
        return true;
      }
      return false;
    };
    
    // Resumen Financiero
    if (reportes?.data.resumen_ganancias.length > 0) {
      checkPageBreak(25);
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("RESUMEN FINANCIERO", margin, yPos);
      yPos += 10;
      
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      
      // Crear 2 columnas para el resumen
      const colWidth = (pageWidth - 2 * margin) / 2;
      const leftX = margin;
      const rightX = margin + colWidth;
      
      // Columna izquierda
      pdf.setFont("helvetica", "bold");
      pdf.text("Total Ventas:", leftX, yPos);
      pdf.setFont("helvetica", "normal");
      pdf.text(`$${totalVentas.toFixed(2)}`, leftX + 40, yPos);
      
      pdf.setFont("helvetica", "bold");
      pdf.text("Total Compras:", leftX, yPos + 8);
      pdf.setFont("helvetica", "normal");
      pdf.text(`$${totalCompras.toFixed(2)}`, leftX + 40, yPos + 8);
      
      // Columna derecha
      pdf.setFont("helvetica", "bold");
      pdf.text("Ganancia Neta:", rightX, yPos);
      pdf.setFont("helvetica", "normal");
      pdf.text(`$${gananciaNeta.toFixed(2)}`, rightX + 40, yPos);
      
      pdf.setFont("helvetica", "bold");
      pdf.text("% Ganancia:", rightX, yPos + 8);
      pdf.setFont("helvetica", "normal");
      pdf.text(`${porcentajeGanancia.toFixed(2)}%`, rightX + 40, yPos + 8);
      
      yPos += 20;
    }
    
    // Ventas por Empleado
    if (reportes?.data.ventas_empleados.length > 0) {
      checkPageBreak(30);
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("VENTAS POR EMPLEADO", margin, yPos);
      yPos += 10;
      
      // Encabezados de tabla
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      const colWidths = [80, 40, 30, 40]; // Anchos de columnas
      let xPos = margin;
      
      // Dibujar encabezados
      pdf.text("Empleado", xPos, yPos);
      xPos += colWidths[0];
      pdf.text("Total", xPos, yPos);
      xPos += colWidths[1];
      pdf.text("Ventas", xPos, yPos);
      xPos += colWidths[2];
      pdf.text("Promedio", xPos, yPos);
      
      yPos += 8;
      
      // Línea separadora
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 5;
      
      // Datos de la tabla
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      
      reportes.data.ventas_empleados.forEach((venta, index) => {
        checkPageBreak(10);
        
        // Alternar color de fondo
        if (index % 2 === 0) {
          pdf.setFillColor(249, 250, 251); // Color gris claro
          pdf.rect(margin, yPos - 4, pageWidth - 2 * margin, 8, 'F');
        }
        
        xPos = margin;
        
        // Nombre (con wrap text si es muy largo)
        const nombre = venta.NombreCompleto.length > 30 
          ? venta.NombreCompleto.substring(0, 27) + "..." 
          : venta.NombreCompleto;
        pdf.text(nombre, xPos, yPos);
        xPos += colWidths[0];
        
        // Total
        pdf.text(`$${Number(venta.TotalVendido).toFixed(2)}`, xPos, yPos);
        xPos += colWidths[1];
        
        // Número de ventas
        pdf.text(venta.NroVentas, xPos, yPos);
        xPos += colWidths[2];
        
        // Promedio
        pdf.text(`$${Number(venta.PromedioVenta).toFixed(2)}`, xPos, yPos);
        
        yPos += 8;
      });
      
      yPos += 10;
    }
    
    // Compras por Producto
    if (reportes?.data.compras_gerente.length > 0) {
      checkPageBreak(30);
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("COMPRAS POR PRODUCTO", margin, yPos);
      yPos += 10;
      
      // Encabezados
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      const colWidths = [60, 40, 30, 60];
      let xPos = margin;
      
      pdf.text("Producto", xPos, yPos);
      xPos += colWidths[0];
      pdf.text("Total", xPos, yPos);
      xPos += colWidths[1];
      pdf.text("Unidades", xPos, yPos);
      xPos += colWidths[2];
      pdf.text("Gerente", xPos, yPos);
      
      yPos += 8;
      
      // Línea separadora
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 5;
      
      // Datos
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      
      reportes.data.compras_gerente.forEach((compra, index) => {
        checkPageBreak(12);
        
        if (index % 2 === 0) {
          pdf.setFillColor(249, 250, 251);
          pdf.rect(margin, yPos - 4, pageWidth - 2 * margin, 10, 'F');
        }
        
        xPos = margin;
        
        // Producto (con salto de línea si es necesario)
        const nombre = compra.nombre.length > 25 
          ? compra.nombre.substring(0, 22) + "..." 
          : compra.nombre;
        pdf.text(nombre, xPos, yPos);
        pdf.setFontSize(8);
        pdf.text(`Código: ${compra.codigoProducto}`, xPos, yPos + 4);
        pdf.setFontSize(9);
        xPos += colWidths[0];
        
        // Total
        pdf.text(`$${Number(compra.TotalPago).toFixed(2)}`, xPos, yPos);
        xPos += colWidths[1];
        
        // Unidades
        pdf.text(compra.UnitCompradas, xPos, yPos);
        xPos += colWidths[2];
        
        // Gerente
        const gerente = compra.NombreGerente || "N/A";
        const gerenteText = gerente.length > 20 
          ? gerente.substring(0, 17) + "..." 
          : gerente;
        pdf.text(gerenteText, xPos, yPos);
        
        yPos += 10;
      });
      
      yPos += 10;
    }
    
    // Stock Crítico
    if (reportes?.data.conteo_stock_critico.length > 0) {
      checkPageBreak(20);
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("ALERTA DE STOCK", margin, yPos);
      yPos += 10;
      
      reportes.data.conteo_stock_critico.forEach((stock, index) => {
        checkPageBreak(15);
        
        pdf.setFillColor(254, 252, 232); // Color amarillo claro
        pdf.roundedRect(margin, yPos - 5, pageWidth - 2 * margin, 12, 3, 3, 'F');
        
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.text(`${stock.total_productos_criticos} productos con stock crítico`, margin + 5, yPos + 3);
        
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "normal");
        pdf.text("Se recomienda realizar pedidos de reposición inmediatamente", margin + 5, yPos + 8);
        
        yPos += 15;
      });
      
      yPos += 5;
    }
    
    // Ganancias por Producto
    if (reportes?.data.ganancias_producto.length > 0) {
      checkPageBreak(30);
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("GANANCIAS POR PRODUCTO", margin, yPos);
      yPos += 10;
      
      // Encabezados
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      const colWidths = [60, 45, 35, 50];
      let xPos = margin;
      
      pdf.text("Producto", xPos, yPos);
      xPos += colWidths[0];
      pdf.text("Ganancias", xPos, yPos);
      xPos += colWidths[1];
      pdf.text("Unidades", xPos, yPos);
      xPos += colWidths[2];
      pdf.text("Ganancia/Unidad", xPos, yPos);
      
      yPos += 8;
      
      // Línea separadora
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 5;
      
      // Datos
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      
      reportes.data.ganancias_producto.forEach((ganancia, index) => {
        checkPageBreak(12);
        
        if (index % 2 === 0) {
          pdf.setFillColor(249, 250, 251);
          pdf.rect(margin, yPos - 4, pageWidth - 2 * margin, 10, 'F');
        }
        
        xPos = margin;
        
        // Producto
        const nombre = ganancia.nombre.length > 25 
          ? ganancia.nombre.substring(0, 22) + "..." 
          : ganancia.nombre;
        pdf.text(nombre, xPos, yPos);
        pdf.setFontSize(8);
        pdf.text(`Código: ${ganancia.codigoProducto}`, xPos, yPos + 4);
        pdf.setFontSize(9);
        xPos += colWidths[0];
        
        // Ganancias (en verde)
        pdf.setTextColor(5, 150, 105); // Color verde
        pdf.text(`$${Number(ganancia.total_ganancias).toFixed(2)}`, xPos, yPos);
        pdf.setTextColor(0, 0, 0); // Volver a negro
        xPos += colWidths[1];
        
        // Unidades
        pdf.text(ganancia.total_unidades_vendidas, xPos, yPos);
        xPos += colWidths[2];
        
        // Ganancia por unidad
        pdf.text(`$${Number(ganancia.ganancia_promedio_unidad).toFixed(2)}`, xPos, yPos);
        
        yPos += 10;
      });
    }
    
    // Pie de página
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text(`Página ${i} de ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: "center" });
      pdf.text("Reporte Gerencial - Sistema de Gestión", pageWidth / 2, pageHeight - 5, { align: "center" });
    }
    
    // Guardar el PDF
    const nombreArchivo = `Reporte_Gerente_${meses.find(m => m.valor === mes)?.nombre}_${anio}.pdf`;
    pdf.save(nombreArchivo);

  } catch (err) {
    console.error('Error al generar PDF:', err);
    alert('Error al generar el PDF. Por favor, intenta nuevamente.');
  } finally {
    setGeneratingPDF(false);
  }
};

// Función auxiliar para cargar scripts
const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
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

  const resumen = reportes.data.resumen_ganancias[0] || {};
  const totalVentas = Number(resumen.VentasTotales || resumen.total_ventas || 0);
  const totalCompras = Number(resumen.total_compras || 0);
  const gananciaNeta = Number(resumen.ganancia_neta || resumen.GananciaTotal || 0);
  const porcentajeGanancia = Number(resumen.porcentaje_ganancia || 0);

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
                disabled={generatingPDF}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generatingPDF ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generando...</span>
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

        {/* Contenido del reporte con estilos inline */}
        <div ref={contentRef} style={{ background: '#ffffff', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '2rem' }}>
          <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>Reporte del Período</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.875rem', color: '#4b5563' }}>
              <span><strong>Gerente ID:</strong> {idGerente}</span>
              <span><strong>Período:</strong> {meses.find(m => m.valor === mes)?.nombre} {anio}</span>
              <span><strong>Generado:</strong> {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {reportes.data.resumen_ganancias.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <TrendingUp style={{ height: '1.5rem', width: '1.5rem', color: '#059669' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>Resumen Financiero</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={{ background: 'linear-gradient(to bottom right, #dbeafe, #bfdbfe)', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #93c5fd' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1e40af', marginBottom: '0.25rem' }}>Total Ventas</p>
                  <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1e3a8a' }}>${totalVentas.toFixed(2)}</p>
                </div>
                <div style={{ background: 'linear-gradient(to bottom right, #fee2e2, #fecaca)', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #fca5a5' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#b91c1c', marginBottom: '0.25rem' }}>Total Compras</p>
                  <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#7f1d1d' }}>${totalCompras.toFixed(2)}</p>
                </div>
                <div style={{ background: 'linear-gradient(to bottom right, #d1fae5, #a7f3d0)', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #6ee7b7' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#065f46', marginBottom: '0.25rem' }}>Ganancia Neta</p>
                  <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#064e3b' }}>${gananciaNeta.toFixed(2)}</p>
                </div>
                <div style={{ background: 'linear-gradient(to bottom right, #e9d5ff, #d8b4fe)', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #c084fc' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b21a8', marginBottom: '0.25rem' }}>% Ganancia</p>
                  <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#581c87' }}>{porcentajeGanancia.toFixed(2)}%</p>
                </div>
              </div>
            </div>
          )}

          {reportes.data.ventas_empleados.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Users style={{ height: '1.5rem', width: '1.5rem', color: '#4f46e5' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>Ventas por Empleado</h3>
              </div>
              <div style={{ overflow: 'hidden', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: 'linear-gradient(to right, #f9fafb, #f3f4f6)' }}>
                    <tr>
                      <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Empleado</th>
                      <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Total Vendido</th>
                      <th style={{ padding: '1rem 1.5rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>N° Ventas</th>
                      <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Promedio</th>
                    </tr>
                  </thead>
                  <tbody style={{ background: 'white' }}>
                    {reportes.data.ventas_empleados.map((venta, idx) => (
                      <tr key={venta.idPersona} style={{ background: idx % 2 === 0 ? 'white' : '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <div style={{ fontWeight: '500', color: '#111827' }}>{venta.NombreCompleto}</div>
                        </td>
                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right', color: '#111827', fontWeight: '600' }}>
                          ${Number(venta.TotalVendido).toFixed(2)}
                        </td>
                        <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                          <span style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', fontWeight: '600', borderRadius: '9999px', background: '#dbeafe', color: '#1e40af', display: 'inline-block' }}>
                            {venta.NroVentas}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right', color: '#374151' }}>
                          ${Number(venta.PromedioVenta).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {reportes.data.compras_gerente.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Package style={{ height: '1.5rem', width: '1.5rem', color: '#ea580c' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>Compras por Producto</h3>
              </div>
              <div style={{ overflow: 'hidden', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: 'linear-gradient(to right, #f9fafb, #f3f4f6)' }}>
                    <tr>
                      <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Producto</th>
                      <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Total Comprado</th>
                      <th style={{ padding: '1rem 1.5rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Unidades</th>
                      <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Gerente</th>
                    </tr>
                  </thead>
                  <tbody style={{ background: 'white' }}>
                    {reportes.data.compras_gerente.map((compra, idx) => (
                      <tr key={compra.idProducto} style={{ background: idx % 2 === 0 ? 'white' : '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <div style={{ fontWeight: '500', color: '#111827' }}>{compra.nombre}</div>
                          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{compra.codigoProducto}</div>
                        </td>
                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right', color: '#111827', fontWeight: '600' }}>
                          ${Number(compra.TotalPago).toFixed(2)}
                        </td>
                        <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                          <span style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', fontWeight: '600', borderRadius: '9999px', background: '#fed7aa', color: '#9a3412', display: 'inline-block' }}>
                            {compra.UnitCompradas}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 1.5rem', color: '#374151' }}>
                          {compra.NombreGerente || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {reportes.data.conteo_stock_critico.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <AlertTriangle style={{ height: '1.5rem', width: '1.5rem', color: '#ca8a04' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>Alerta de Stock</h3>
              </div>
              {reportes.data.conteo_stock_critico.map((stock, index) => (
                <div key={index} style={{ background: 'linear-gradient(to right, #fef3c7, #fde68a)', borderLeft: '4px solid #eab308', borderRadius: '0.5rem', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <AlertTriangle style={{ height: '2rem', width: '2rem', color: '#ca8a04', marginRight: '1rem' }} />
                    <div>
                      <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#78350f' }}>
                        {stock.total_productos_criticos} productos con stock crítico
                      </p>
                      <p style={{ fontSize: '0.875rem', color: '#a16207', marginTop: '0.25rem' }}>
                        Se recomienda realizar pedidos de reposición inmediatamente
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {reportes.data.ganancias_producto.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <TrendingUp style={{ height: '1.5rem', width: '1.5rem', color: '#059669' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>Ganancias por Producto</h3>
              </div>
              <div style={{ overflow: 'hidden', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: 'linear-gradient(to right, #f9fafb, #f3f4f6)' }}>
                    <tr>
                      <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Producto</th>
                      <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Ganancias Totales</th>
                      <th style={{ padding: '1rem 1.5rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Unidades Vendidas</th>
                      <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Ganancia/Unidad</th>
                    </tr>
                  </thead>
                  <tbody style={{ background: 'white' }}>
                    {reportes.data.ganancias_producto.map((ganancia, idx) => (
                      <tr key={ganancia.idProducto} style={{ background: idx % 2 === 0 ? 'white' : '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <div style={{ fontWeight: '500', color: '#111827' }}>{ganancia.nombre}</div>
                          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{ganancia.codigoProducto}</div>
                        </td>
                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                          <span style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#059669' }}>
                            ${Number(ganancia.total_ganancias).toFixed(2)}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                          <span style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', fontWeight: '600', borderRadius: '9999px', background: '#d1fae5', color: '#065f46', display: 'inline-block' }}>
                            {ganancia.total_unidades_vendidas}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right', color: '#374151', fontWeight: '500' }}>
                          ${Number(ganancia.ganancia_promedio_unidad).toFixed(2)}
                        </td>
                      </tr>
                    ))}
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