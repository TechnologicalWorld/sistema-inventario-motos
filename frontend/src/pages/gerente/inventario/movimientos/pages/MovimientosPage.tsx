import { useEffect, useState } from "react";
import {
  FiFilter,
  FiTag,
  FiRefreshCcw,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiDownload,
} from "react-icons/fi";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import movimientosService, {
  Movimiento,
} from "../movimientos.service";
import productosService, {
  Producto,
} from "../../productos/productos.service";

type ModalMode = "create" | "detail" | null;

interface MovimientoFormState {
  tipo: "entrada" | "salida";
  cantidad: string;
  observacion: string;
  idProducto: string;
}

const emptyForm: MovimientoFormState = {
  tipo: "entrada",
  cantidad: "",
  observacion: "",
  idProducto: "",
};

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
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
  filterInfo: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 9,
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
  col2: { width: '10%' },
  col3: { width: '22%' },
  col4: { width: '12%', textAlign: 'right' },
  col5: { width: '22%' },
  col6: { width: '22%' },
  summarySection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f7ff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#d1e9ff',
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
  statsGrid: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  statCard: {
    width: '48%',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
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
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#666',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    borderTopStyle: 'solid',
    paddingTop: 10,
  },
});

// Componente PDF para movimientos
const MovimientosReportePDF: React.FC<{ 
  movimientos: Movimiento[],
  filtros: {
    tipo: string;
    fechaInicio: string;
    fechaFin: string;
    textoProducto: string;
    textoResponsable: string;
  }
}> = ({ movimientos, filtros }) => {
  const fechaGeneracion = new Date().toLocaleDateString('es-ES');
  const horaGeneracion = new Date().toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Estadísticas
  const totalMovimientos = movimientos.length;
  const entradas = movimientos.filter(m => m.tipo === 'entrada').length;
  const salidas = movimientos.filter(m => m.tipo === 'salida').length;
  
  const cantidadTotalEntradas = movimientos
    .filter(m => m.tipo === 'entrada')
    .reduce((acc, m) => acc + m.cantidad, 0);
  
  const cantidadTotalSalidas = movimientos
    .filter(m => m.tipo === 'salida')
    .reduce((acc, m) => acc + m.cantidad, 0);

  const productosUnicos = [...new Set(movimientos.map(m => m.producto?.nombre).filter(Boolean))];

  // Función para formatear fecha
  const formatFecha = (fecha: string) => {
    const d = new Date(fecha);
    if (Number.isNaN(d.getTime())) return fecha;
    return d.toLocaleDateString('es-ES');
  };

  // Función para obtener texto del tipo
  const getTipoTexto = (tipo: string) => {
    if (tipo === 'entrada') return 'Entrada';
    if (tipo === 'salida') return 'Salida';
    return tipo;
  };

  // Información de filtros aplicados
  const tieneFiltros = filtros.tipo || filtros.fechaInicio || filtros.fechaFin || 
                      filtros.textoProducto || filtros.textoResponsable;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>REPORTE DE MOVIMIENTOS DE INVENTARIO</Text>
          <Text style={styles.subtitle}>
            Generado: {fechaGeneracion} a las {horaGeneracion}
          </Text>
          <Text style={styles.subtitle}>
            Total de movimientos: {totalMovimientos}
          </Text>
        </View>

        {/* Información de filtros */}
        {tieneFiltros && (
          <View style={styles.filterInfo}>
            <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 5 }}>
              Filtros aplicados:
            </Text>
            {filtros.tipo && (
              <Text style={{ fontSize: 9 }}>• Tipo: {filtros.tipo === 'entrada' ? 'Entrada' : 'Salida'}</Text>
            )}
            {filtros.fechaInicio && (
              <Text style={{ fontSize: 9 }}>• Desde: {formatFecha(filtros.fechaInicio)}</Text>
            )}
            {filtros.fechaFin && (
              <Text style={{ fontSize: 9 }}>• Hasta: {formatFecha(filtros.fechaFin)}</Text>
            )}
            {filtros.textoProducto && (
              <Text style={{ fontSize: 9 }}>• Producto contiene: "{filtros.textoProducto}"</Text>
            )}
            {filtros.textoResponsable && (
              <Text style={{ fontSize: 9 }}>• Responsable contiene: "{filtros.textoResponsable}"</Text>
            )}
          </View>
        )}

        {/* Tabla de movimientos */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>Fecha</Text>
            <Text style={styles.col2}>Tipo</Text>
            <Text style={styles.col3}>Producto</Text>
            <Text style={styles.col4}>Cantidad</Text>
            <Text style={styles.col5}>Responsable</Text>
            <Text style={styles.col6}>Observación</Text>
          </View>
          {movimientos.map((movimiento, idx) => {
            const responsable = movimiento.empleado?.persona
              ? `${movimiento.empleado.persona.nombres} ${movimiento.empleado.persona.paterno}`
              : "—";

            return (
              <View
                key={movimiento.idMovimiento}
                style={[styles.tableRow, idx % 2 === 1 && styles.tableRowAlt]}
              >
                <Text style={styles.col1}>{formatFecha(movimiento.fechaMovimiento)}</Text>
                <Text style={[
                  styles.col2,
                  { color: movimiento.tipo === 'entrada' ? '#059669' : '#dc2626' }
                ]}>
                  {getTipoTexto(movimiento.tipo)}
                </Text>
                <Text style={styles.col3}>{movimiento.producto?.nombre || "—"}</Text>
                <Text style={[
                  styles.col4,
                  { color: movimiento.tipo === 'entrada' ? '#059669' : '#dc2626' }
                ]}>
                  {movimiento.tipo === 'entrada' ? '+' : '-'}{movimiento.cantidad}
                </Text>
                <Text style={styles.col5}>{responsable}</Text>
                <Text style={styles.col6}>{movimiento.observacion || "—"}</Text>
              </View>
            );
          })}
        </View>

        {/* Resumen y estadísticas */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Resumen General</Text>
          
          <View style={styles.summaryRow}>
            <Text>Total de movimientos:</Text>
            <Text style={{ fontWeight: 'bold' }}>{totalMovimientos}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text>Entradas registradas:</Text>
            <Text style={{ fontWeight: 'bold', color: '#059669' }}>{entradas}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text>Salidas registradas:</Text>
            <Text style={{ fontWeight: 'bold', color: '#dc2626' }}>{salidas}</Text>
          </View>
        </View>

        {/* Estadísticas detalladas */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Total Cantidad Entradas</Text>
            <Text style={[styles.statValue, { color: '#059669' }]}>
              +{cantidadTotalEntradas} unidades
            </Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Total Cantidad Salidas</Text>
            <Text style={[styles.statValue, { color: '#dc2626' }]}>
              -{cantidadTotalSalidas} unidades
            </Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Productos con movimientos</Text>
            <Text style={styles.statValue}>
              {productosUnicos.length} productos diferentes
            </Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Balance neto</Text>
            <Text style={styles.statValue}>
              {cantidadTotalEntradas - cantidadTotalSalidas} unidades
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Reporte de Movimientos de Inventario - Generado el {fechaGeneracion}</Text>
        </View>
      </Page>
    </Document>
  );
};

function formatFecha(fecha: string) {
  const d = new Date(fecha);
  if (Number.isNaN(d.getTime())) return fecha;
  return d.toLocaleDateString("es-BO");
}

export default function MovimientosPage() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // filtros
  const [tipo, setTipo] = useState<"" | "entrada" | "salida">("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [textoProducto, setTextoProducto] = useState("");
  const [textoResponsable, setTextoResponsable] = useState("");

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<Movimiento | null>(null);
  const [form, setForm] = useState<MovimientoFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadProductos = async () => {
    const res = await productosService.getProductos({
      page: 1,
    });
    setProductos(res.data);
  };

  const loadMovimientos = async (pageToLoad = 1) => {
    setLoading(true);
    try {
      const res = await movimientosService.getMovimientos({
        page: pageToLoad,
        tipo: tipo || undefined,
        fecha_inicio: fechaInicio || undefined,
        fecha_fin: fechaFin || undefined,
      });
      setMovimientos(res.data);
      setPage(res.current_page);
      setLastPage(res.last_page);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductos();
    loadMovimientos();
  }, []);

  const aplicarFiltros = () => {
    loadMovimientos(1);
  };

  const handleRefresh = () => {
    setTipo("");
    setFechaInicio("");
    setFechaFin("");
    setTextoProducto("");
    setTextoResponsable("");
    loadMovimientos(1);
  };

  const movimientosFiltrados = movimientos.filter((m) => {
    const txtProd = textoProducto.toLowerCase();
    const txtResp = textoResponsable.toLowerCase();
    const prodName = m.producto?.nombre.toLowerCase() || "";
    const respName = `${m.empleado?.persona?.nombres} ${m.empleado?.persona?.paterno ?? ""}`
      .trim()
      .toLowerCase();

    return (
      (txtProd === "" || prodName.includes(txtProd)) &&
      (txtResp === "" || respName.includes(txtResp))
    );
  });

  const abrirCrear = () => {
    setForm(emptyForm);
    setModalMode("create");
    setErrorMsg(null);
  };

  const abrirDetalle = (m: Movimiento) => {
    setSelected(m);
    setModalMode("detail");
  };

  const cerrarModal = () => {
    setModalMode(null);
    setSelected(null);
    setForm(emptyForm);
    setErrorMsg(null);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);

    try {
      const idEmpleado = 13;

      await movimientosService.createMovimiento({
        tipo: form.tipo,
        cantidad: Number(form.cantidad),
        observacion: form.observacion,
        idProducto: Number(form.idProducto),
        idEmpleado,
      });

      await loadMovimientos(page);
      cerrarModal();
    } catch (error: any) {
      const msg =
        error?.response?.data?.error ||
        "Error al registrar movimiento";
      setErrorMsg(msg);
    } finally {
      setSaving(false);
    }
  };

  const getTipoClase = (tipo: string) => {
    if (tipo === "entrada")
      return "text-green-600 font-semibold";
    if (tipo === "salida")
      return "text-red-600 font-semibold";
    return "text-gray-800";
  };

  const getTipoTexto = (tipo: string) => {
    if (tipo === "entrada") return "Entrada";
    if (tipo === "salida") return "Salida";
    return tipo;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Lista de los movimientos de inventario en el sistema
          </h1>
          <div className="mt-2 h-[1px] bg-gray-300 w-full" />
        </div>

        <div className="flex items-center gap-2">
          {/* Botón para descargar PDF */}
          {!loading && movimientosFiltrados.length > 0 && (
            <PDFDownloadLink
              document={
                <MovimientosReportePDF 
                  movimientos={movimientosFiltrados}
                  filtros={{
                    tipo,
                    fechaInicio,
                    fechaFin,
                    textoProducto,
                    textoResponsable
                  }}
                />
              }
              fileName={`reporte-movimientos-${new Date().toISOString().split('T')[0]}.pdf`}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#c0163b] text-white text-sm hover:bg-[#a41333] transition-colors"
            >
              {({ loading: pdfLoading }) => (
                <>
                  <FiDownload />
                  {pdfLoading ? 'Preparando PDF...' : 'Descargar PDF'}
                </>
              )}
            </PDFDownloadLink>
          )}
          
          <button
            onClick={handleRefresh}
            className="w-10 h-10 flex items-center justify-center rounded-md border border-gray-400 bg-gray-100 hover:bg-gray-200 transition"
            title="Actualizar lista"
          >
            <FiRefreshCcw />
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-4 mb-5">
        {/* Desde */}
        <input
          type="date"
          placeholder="Desde"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          className="border border-gray-400 rounded-full px-4 py-1.5 text-sm bg-white min-w-[140px]"
        />

        {/* Hasta */}
        <input
          type="date"
          placeholder="Hasta"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
          className="border border-gray-400 rounded-full px-4 py-1.5 text-sm bg-white min-w-[140px]"
        />

        {/* Nombre producto */}
        <input
          placeholder="Nombre producto..."
          value={textoProducto}
          onChange={(e) => setTextoProducto(e.target.value)}
          className="border border-gray-400 rounded-full px-4 py-1.5 text-sm bg-white min-w-[180px]"
        />

        {/* Responsable */}
        <input
          placeholder="Responsable..."
          value={textoResponsable}
          onChange={(e) => setTextoResponsable(e.target.value)}
          className="border border-gray-400 rounded-full px-4 py-1.5 text-sm bg-white min-w-[180px]"
        />

        {/* Tipo */}
        <select
          value={tipo}
          onChange={(e) =>
            setTipo(e.target.value as "" | "entrada" | "salida")
          }
          className="border border-gray-400 rounded-full px-4 py-1.5 text-sm bg-white min-w-[140px]"
        >
          <option value="">Tipo</option>
          <option value="entrada">Entrada</option>
          <option value="salida">Salida</option>
        </select>

        {/* Botón aplicar */}
        <button
          onClick={aplicarFiltros}
          className="px-5 py-2 rounded-full bg-black text-white text-sm hover:bg-gray-900 transition"
        >
          Aplicar Filtros
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-[#f3ebe7] border border-gray-300 rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-300">
            <tr className="text-left">
              <th className="px-4 py-2 font-semibold">
                Fecha Movimiento
              </th>
              <th className="px-4 py-2 font-semibold">
                Tipo
              </th>
              <th className="px-4 py-2 font-semibold">
                Producto
              </th>
              <th className="px-4 py-2 font-semibold">
                Cantidad
              </th>
              <th className="px-4 py-2 font-semibold">
                Responsable
              </th>
              <th className="px-4 py-2 font-semibold">
                Observación
              </th>
              <th className="px-4 py-2 font-semibold">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-6 text-gray-600"
                >
                  Cargando movimientos...
                </td>
              </tr>
            )}

            {!loading &&
              movimientosFiltrados.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-6 text-gray-600"
                  >
                    No hay movimientos registrados.
                  </td>
                </tr>
              )}

            {!loading &&
              movimientosFiltrados.map((m, idx) => (
                <tr
                  key={m.idMovimiento}
                  className={
                    idx % 2 === 0
                      ? "bg-[#f8f2ee]"
                      : "bg-[#efe4dd]"
                  }
                >
                  <td className="px-4 py-2">
                    {formatFecha(m.fechaMovimiento)}
                  </td>
                  <td className="px-4 py-2">
                    <span className={getTipoClase(m.tipo)}>
                      {getTipoTexto(m.tipo)}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {m.producto?.nombre}
                  </td>
                  <td className="px-4 py-2">
                    {m.cantidad > 0
                      ? `+${m.cantidad}`
                      : m.cantidad}
                  </td>
                  <td className="px-4 py-2">
                    {m.empleado?.persona
                      ? `${m.empleado.persona.nombres} ${m.empleado.persona.paterno}`
                      : ""}
                  </td>
                  <td className="px-4 py-2">
                    {m.observacion}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => abrirDetalle(m)}
                      className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs hover:bg-indigo-700"
                    >
                      <FiEye />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="mt-5 flex items-center justify-center gap-4">
        <button
          disabled={page <= 1}
          onClick={() => loadMovimientos(page - 1)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm ${
            page <= 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-white text-gray-800 hover:bg-gray-100"
          }`}
        >
          <FiChevronLeft />
          <span>Anterior</span>
        </button>

        <span className="text-sm text-gray-700">
          Página {page} de {lastPage}
        </span>

        <button
          disabled={page >= lastPage}
          onClick={() => loadMovimientos(page + 1)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm ${
            page >= lastPage
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-white text-gray-800 hover:bg-gray-100"
          }`}
        >
          <span>Siguiente</span>
          <FiChevronRight />
        </button>
      </div>

      {/* Modal detalle */}
      {modalMode === "detail" && selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-[#f5ede8] w-full max-w-xl rounded-md shadow-lg border border-gray-400">
            <div className="bg-[#e5ddda] px-6 py-3 rounded-t-md text-left">
              <h2 className="font-semibold text-lg text-gray-800">
                DETALLE DE MOVIMIENTO
              </h2>
            </div>

            <div className="px-6 py-4 space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-y-2">
                <span className="font-semibold">
                  Fecha Movimiento:
                </span>
                <span>
                  {formatFecha(selected.fechaMovimiento)}
                </span>

                <span className="font-semibold">
                  Tipo:
                </span>
                <span>
                  {getTipoTexto(selected.tipo)}
                </span>

                <span className="font-semibold">
                  Producto:
                </span>
                <span>
                  {selected.producto?.nombre}
                </span>

                <span className="font-semibold">
                  Cantidad:
                </span>
                <span>{selected.cantidad}</span>

                <span className="font-semibold">
                  Responsable:
                </span>
                <span>
                  {selected.empleado?.persona
                    ? `${selected.empleado.persona.nombres} ${selected.empleado.persona.paterno}`
                    : ""}
                </span>

                <span className="font-semibold">
                  Observación:
                </span>
                <span>{selected.observacion}</span>
              </div>
            </div>

            <div className="px-6 py-3 flex justify-center">
              <button
                onClick={cerrarModal}
                className="px-6 py-2 rounded-sm bg-gray-600 text-white text-sm hover:bg-gray-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}