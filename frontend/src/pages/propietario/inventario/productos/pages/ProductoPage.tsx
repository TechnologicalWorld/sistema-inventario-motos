import { useEffect, useMemo, useState } from "react";
import {
  FiSearch,
  FiFilter,
  FiTag,
  FiRefreshCcw,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import productosService, { type Producto } from "../productos.service";
import categoriasService, {
  type Categoria,
} from "../../categorias/categorias.service";

interface ProductoFormState {
  idProducto?: number;
  nombre: string;
  codigoProducto: string;
  descripcion: string;
  precioVenta: string;
  precioCompra: string;
  stock: string;
  stockMinimo: string;
  estado: "activo" | "inactivo";
  idCategoria: string;
}

type ModalMode = "create" | "edit" | "detail" | null;

const emptyForm: ProductoFormState = {
  nombre: "",
  codigoProducto: "",
  descripcion: "",
  precioVenta: "",
  precioCompra: "",
  stock: "",
  stockMinimo: "",
  estado: "activo",
  idCategoria: "",
};

function getEstadoTexto(stock: number, minimo: number) {
  if (stock < minimo) return "Crítico";
  if (stock === minimo) return "Mínimo";
  return "Ok";
}

function getEstadoColorClasses(stock: number, minimo: number) {
  if (stock < minimo) return { dot: "bg-red-500", text: "text-red-600" };
  if (stock === minimo) return { dot: "bg-amber-400", text: "text-amber-600" };
  return { dot: "bg-green-500", text: "text-green-600" };
}

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(
    null
  );
  const [form, setForm] = useState<ProductoFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [estadoFiltro, setEstadoFiltro] = useState<string>("");

  // ---------------- Cargar datos ----------------

  const loadCategorias = async () => {
    try {
      const res = await categoriasService.getCategorias();
      setCategorias(res);
    } catch (error) {
      console.error(error);
    }
  };

  const loadProductos = async (pageToLoad = 1) => {
    try {
      setLoading(true);
      const data = await productosService.getProductos({
        page: pageToLoad,
        search: search || undefined,
        categoria: categoriaFiltro ? Number(categoriaFiltro) : undefined,
      });

      setProductos(data.data);
      setPage(data.current_page);
      setLastPage(data.last_page);
    } catch (error) {
      console.error(error);
      setErrorMsg("Error al obtener productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategorias();
  }, []);

  useEffect(() => {
    loadProductos(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, categoriaFiltro]);

  // ---------------- Modal helpers ----------------

  const openCreateModal = () => {
    setForm(emptyForm);
    setSelectedProducto(null);
    setModalMode("create");
    setErrorMsg(null);
  };

  const openEditModal = (producto: Producto) => {
    setSelectedProducto(producto);
    setForm({
      idProducto: producto.idProducto,
      nombre: producto.nombre,
      codigoProducto: producto.codigoProducto,
      descripcion: producto.descripcion || "",
      precioVenta: String(producto.precioVenta),
      precioCompra: String(producto.precioCompra),
      stock: String(producto.stock),
      stockMinimo: String(producto.stockMinimo),
      estado: producto.estado,
      idCategoria: String(producto.idCategoria),
    });
    setModalMode("edit");
    setErrorMsg(null);
  };

  const openDetailModal = (producto: Producto) => {
    setSelectedProducto(producto);
    setModalMode("detail");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedProducto(null);
    setForm(emptyForm);
    setErrorMsg(null);
  };

  // ---------------- Form handlers ----------------

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setSaving(true);

    try {
      const payloadBase = {
        ...form,
        precioCompra: Number(form.precioCompra),
        precioVenta: Number(form.precioVenta),
        stock: Number(form.stock),
        stockMinimo: Number(form.stockMinimo),
      };

      if (modalMode === "create") {
        await productosService.createProducto({
          ...payloadBase,
          estado: "activo",
        });

        await loadProductos(1);
      } else if (modalMode === "edit" && form.idProducto) {
        await productosService.updateProducto(form.idProducto, payloadBase);

        await loadProductos(page);
      }

      closeModal();
    } catch (error: any) {
      console.error(error);
      setErrorMsg(
        error?.response?.data?.error ||
          "Ocurrió un error al guardar el producto."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (producto: Producto) => {
    if (
      !confirm(`¿Seguro que deseas eliminar el producto "${producto.nombre}"?`)
    )
      return;

    try {
      await productosService.deleteProducto(producto.idProducto);
      await loadProductos(page);
    } catch (error: any) {
      const msg =
        error?.response?.data?.error || "No se pudo eliminar el producto";
      alert(msg);
    }
  };

  const handleRefresh = () => {
    setSearch("");
    setCategoriaFiltro("");
    setEstadoFiltro("");
    loadProductos(page);
  };

  const estadoTexto = useMemo(
    () => (p: Producto) => getEstadoTexto(p.stock, p.stockMinimo),
    []
  );
  const estadoClases = useMemo(
    () => (p: Producto) => getEstadoColorClasses(p.stock, p.stockMinimo),
    []
  );

  const filteredProductos = useMemo(() => {
    return productos.filter((p) => {
      if (!estadoFiltro) return true;

      const texto = getEstadoTexto(p.stock, p.stockMinimo);

      if (estadoFiltro === "critico") return texto === "Crítico";
      if (estadoFiltro === "minimo") return texto === "Mínimo";
      if (estadoFiltro === "ok") return texto === "Ok";

      return true;
    });
  }, [productos, estadoFiltro]);

  // ---------------- Render ----------------

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Control y administración de productos
          </h1>
          <div className="mt-2 h-[1px] bg-gray-300 w-full" />
        </div>

        {/* Botones de acción en el header derecho */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="w-10 h-10 flex items-center justify-center rounded-md border border-gray-400 bg-gray-100 hover:bg-gray-200 transition"
            title="Actualizar lista"
          >
            <FiRefreshCcw />
          </button>
        </div>
      </div>

      {/* Buscador + Filtros + Botón agregar */}
      <div className="flex flex-wrap items-center justify-between mb-5 gap-4">
        {/* IZQUIERDA: buscador + filtros */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Buscador */}
          <div className="flex items-center">
            <div className="flex items-center bg-white border border-gray-400 rounded-l-full px-3 py-1.5 min-w-[260px]">
              <span className="text-gray-500 mr-2">
                <FiSearch />
              </span>
              <input
                type="text"
                placeholder="Buscar Producto..."
                className="flex-1 text-sm outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && loadProductos(1)}
              />
            </div>
            <button
              onClick={() => loadProductos(1)}
              className="px-5 py-1.5 rounded-r-full bg-black text-white text-sm hover:bg-gray-900 transition -ml-px"
            >
              Buscar
            </button>
          </div>

          {/* Filtro Categoría */}
          <select
            className="border border-gray-400 rounded-full px-4 py-2 text-sm bg-white min-w-[150px]"
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
          >
            <option value="">Categoría</option>
            {categorias.map((c) => (
              <option key={c.idCategoria} value={c.idCategoria}>
                {c.nombre}
              </option>
            ))}
          </select>

          {/* Filtro Estado */}
          <select
            className="border border-gray-400 rounded-full px-4 py-2 text-sm bg-white min-w-[140px]"
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
          >
            <option value="">Estado</option>
            <option value="critico">Crítico</option>
            <option value="minimo">Mínimo</option>
            <option value="ok">Ok</option>
          </select>
        </div>

        {/* DERECHA: botón agregar */}
        <div>
          <button
            onClick={openCreateModal}
            className="px-5 py-2 rounded-full bg-blue-600 text-white text-sm hover:bg-blue-700 shadow"
          >
            Agregar Producto
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-[#f3ebe7] border border-gray-300 rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-300">
            <tr className="text-left">
              <th className="px-4 py-2 font-semibold">Código</th>
              <th className="px-4 py-2 font-semibold">Nombre</th>
              <th className="px-4 py-2 font-semibold">Categoría</th>
              <th className="px-4 py-2 font-semibold">Precio Compra</th>
              <th className="px-4 py-2 font-semibold">Precio Venta</th>
              <th className="px-4 py-2 font-semibold">Stock</th>
              <th className="px-4 py-2 font-semibold">Stock Mínimo</th>
              <th className="px-4 py-2 font-semibold">Estado</th>
              <th className="px-4 py-2 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={9} className="text-center py-6 text-gray-600">
                  Cargando productos...
                </td>
              </tr>
            )}

            {!loading && productos.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-6 text-gray-600">
                  No hay productos registrados.
                </td>
              </tr>
            )}

            {!loading &&
              filteredProductos.map((p, idx) => {
                const estado = estadoClases(p);
                return (
                  <tr
                    key={p.idProducto}
                    className={idx % 2 === 0 ? "bg-[#f8f2ee]" : "bg-[#efe4dd]"}
                  >
                    <td className="px-4 py-2">{p.codigoProducto}</td>
                    <td className="px-4 py-2">{p.nombre}</td>
                    <td className="px-4 py-2">{p.categoria?.nombre || "-"}</td>
                    <td className="px-4 py-2">
                      {Number(p.precioCompra).toFixed(2)}
                    </td>
                    <td className="px-4 py-2">
                      {Number(p.precioVenta).toFixed(2)}
                    </td>
                    <td className="px-4 py-2">{p.stock}</td>
                    <td className="px-4 py-2">{p.stockMinimo}</td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-3 h-3 rounded-full ${estado.dot}`}
                        />
                        <span className={`text-xs font-medium ${estado.text}`}>
                          {estadoTexto(p)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openDetailModal(p)}
                          className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs hover:bg-indigo-700"
                          title="Ver detalle"
                        >
                          <FiEye />
                        </button>
                        <button
                          onClick={() => openEditModal(p)}
                          className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs hover:bg-gray-800"
                          title="Editar"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
                          className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-xs hover:bg-red-700"
                          title="Eliminar"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="mt-5 flex items-center justify-center gap-4">
        <button
          disabled={page <= 1}
          onClick={() => loadProductos(page - 1)}
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
          onClick={() => loadProductos(page + 1)}
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

      {/* Modal Crear/Editar */}
      {(modalMode === "create" || modalMode === "edit") && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="
                bg-[#f5ede8]
                w-[95%]
                max-w-lg
                rounded-md
                shadow-lg
                border
                border-gray-400
                max-h-[90vh]
                overflow-y-auto
            "
          >
            {/* CABECERA */}
            <div className="bg-[#e5ddda] px-6 py-3 rounded-t-md text-center">
              <h2 className="font-semibold text-lg text-gray-800">
                {modalMode === "create" ? "NUEVO PRODUCTO" : "EDITAR PRODUCTO"}
              </h2>
            </div>

            {/* CUERPO */}
            <div className="px-6 py-4 space-y-3">
              {errorMsg && (
                <div className="mb-2 text-sm text-red-600">{errorMsg}</div>
              )}

              {/* Nombre */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-sm">Nombre:</label>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  className="border border-gray-400 rounded-sm px-3 py-1.5 text-sm bg-white"
                  required
                />
              </div>

              {/* Código */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-sm">Código:</label>
                <input
                  name="codigoProducto"
                  value={form.codigoProducto}
                  onChange={handleChange}
                  className="border border-gray-400 rounded-sm px-3 py-1.5 text-sm bg-white"
                  required
                />
              </div>

              {/* Categoría */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-sm">Categoría:</label>
                <select
                  name="idCategoria"
                  value={form.idCategoria}
                  onChange={handleChange}
                  className="border border-gray-400 rounded-sm px-3 py-1.5 text-sm bg-white"
                  required
                >
                  <option value="">Seleccionar</option>
                  {categorias.map((c) => (
                    <option key={c.idCategoria} value={c.idCategoria}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Descripción */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-sm">Descripción:</label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  className="border border-gray-400 rounded-sm px-3 py-1.5 text-sm bg-white resize-none h-20"
                  required
                />
              </div>

              {/* Precios y stocks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-sm">
                    Precio Compra:
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="precioCompra"
                    value={form.precioCompra}
                    onChange={handleChange}
                    className="border border-gray-400 rounded-sm px-3 py-1.5 text-sm bg-white"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-sm">Precio Venta:</label>
                  <input
                    type="number"
                    step="0.01"
                    name="precioVenta"
                    value={form.precioVenta}
                    onChange={handleChange}
                    className="border border-gray-400 rounded-sm px-3 py-1.5 text-sm bg-white"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-sm">Stock:</label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    className="border border-gray-400 rounded-sm px-3 py-1.5 text-sm bg-white"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-sm">Stock Mínimo:</label>
                  <input
                    type="number"
                    name="stockMinimo"
                    value={form.stockMinimo}
                    onChange={handleChange}
                    className="border border-gray-400 rounded-sm px-3 py-1.5 text-sm bg-white"
                    required
                  />
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="px-6 py-3 flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-start">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-sm bg-green-600 text-white text-sm hover:bg-green-700 disabled:opacity-60"
              >
                {modalMode === "create"
                  ? "Guardar nuevo producto"
                  : "Guardar cambios"}
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 rounded-sm bg-gray-600 text-white text-sm hover:bg-gray-700"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Detalle */}
      {modalMode === "detail" && selectedProducto && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-[#f5ede8] w-full max-w-xl rounded-md shadow-lg border border-gray-400">
            <div className="bg-[#e5ddda] px-6 py-3 rounded-t-md text-left">
              <h2 className="font-semibold text-lg text-gray-800">
                DETALLE DE PRODUCTO / {selectedProducto.codigoProducto}
              </h2>
            </div>

            <div className="px-6 py-4 space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-y-2">
                <span className="font-semibold">Nombre:</span>
                <span>{selectedProducto.nombre}</span>

                <span className="font-semibold">Categoría:</span>
                <span>{selectedProducto.categoria?.nombre || "-"}</span>

                <span className="font-semibold">Precio Compra:</span>
                <span>{Number(selectedProducto.precioCompra).toFixed(2)}</span>

                <span className="font-semibold">Precio Venta:</span>
                <span>{Number(selectedProducto.precioVenta).toFixed(2)}</span>

                <span className="font-semibold">Stock:</span>
                <span>{selectedProducto.stock}</span>

                <span className="font-semibold">Stock Mínimo:</span>
                <span>{selectedProducto.stockMinimo}</span>

                <span className="font-semibold">Estado:</span>
                <span>
                  <span
                    className={`inline-block w-3 h-3 rounded-full mr-2 ${
                      estadoClases(selectedProducto).dot
                    }`}
                  />
                  {estadoTexto(selectedProducto)}
                </span>
              </div>

              {selectedProducto.descripcion && (
                <div className="mt-2">
                  <span className="font-semibold block">Descripción:</span>
                  <p>{selectedProducto.descripcion}</p>
                </div>
              )}
            </div>

            <div className="px-6 py-3 flex justify-center">
              <button
                onClick={closeModal}
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
