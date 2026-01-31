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
  FiUpload,
  FiImage,
  FiX,
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
  imagen: null | File | string;
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
  imagen: null
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
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [form, setForm] = useState<ProductoFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [estadoFiltro, setEstadoFiltro] = useState<string>("");
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");

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
    setPreview(null);
    setFileName("");
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
      imagen: producto.imagenURL || null
    });
    setModalMode("edit");
    setErrorMsg(null);
    setPreview(producto.imagenURL ? `http://localhost:8000/storage/${producto.imagenURL}` : null);
    setFileName(producto.imagenURL ? "Imagen actual" : "");
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
    setPreview(null);
    setFileName("");
  };

  // ---------------- Image handlers ----------------

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        alert('Por favor, selecciona una imagen válida (JPEG, PNG, JPG, GIF)');
        return;
      }

      // Validar tamaño (2MB máximo)
      const maxSize = 2 * 1024 * 1024; // 2MB en bytes
      if (file.size > maxSize) {
        alert('La imagen es demasiado grande. Máximo 2MB');
        return;
      }

      setForm(prev => ({ ...prev, imagen: file }));
      setPreview(URL.createObjectURL(file));
      setFileName(file.name);
    }
  };

  const handleRemoveImage = () => {
    setForm(prev => ({ ...prev, imagen: null }));
    setPreview(null);
    setFileName("");
    // Reset input file
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  // ---------------- Form handlers ----------------

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setSaving(true);

    try {
      const formData = new FormData();
      
      // Agregar todos los campos al FormData
      formData.append('nombre', form.nombre);
      formData.append('codigoProducto', form.codigoProducto);
      formData.append('descripcion', form.descripcion);
      formData.append('precioVenta', form.precioVenta);
      formData.append('precioCompra', form.precioCompra);
      formData.append('stock', form.stock);
      formData.append('stockMinimo', form.stockMinimo);
      formData.append('estado', form.estado);
      formData.append('idCategoria', form.idCategoria);
      
      // Agregar imagen solo si es un File
      if (form.imagen && form.imagen instanceof File) {
        formData.append('imagen', form.imagen);
      }

      if (modalMode === "create") {
        await productosService.createProducto(formData);
        await loadProductos(1);
      } else if (modalMode === "edit" && form.idProducto) {
        await productosService.updateProducto(form.idProducto, formData);
        await loadProductos(page);
      }

      closeModal();
    } catch (error: any) {
      console.error(error);
      setErrorMsg(
        error?.response?.data?.error ||
          "Ocurrió un error al guardar el producto.",
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
    [],
  );
  const estadoClases = useMemo(
    () => (p: Producto) => getEstadoColorClasses(p.stock, p.stockMinimo),
    [],
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
            className="px-5 py-2 rounded-full bg-blue-600 text-white text-sm hover:bg-blue-700 shadow flex items-center gap-2"
          >
            <FiUpload /> Agregar Producto
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="relative w-full overflow-hidden">
        {/* Scroll solo para la tabla */}
        <div className="overflow-x-auto">
          <table className="min-w-[1200px] w-full text-sm">
            <thead className="bg-gray-300">
              <tr className="text-left">
                <th className="px-4 py-2 font-semibold text-center">Imagen</th>
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
                  <td colSpan={10} className="text-center py-6 text-gray-600">
                    Cargando productos...
                  </td>
                </tr>
              )}

              {!loading && productos.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-6 text-gray-600">
                    No hay productos registrados.
                  </td>
                </tr>
              )}

              {!loading &&
                filteredProductos.map((p, idx) => {
                  const estado = estadoClases(p);
                  const imagenUrl = p.imagenURL 
                    ? `http://localhost:8000/storage/${p.imagenURL}`
                    : null;
                  
                  return (
                    <tr
                      key={p.idProducto}
                      className={
                        idx % 2 === 0 ? "bg-[#f8f2ee]" : "bg-[#efe4dd]"
                      }
                    >
                      {/* Columna de Imagen */}
                      <td className="px-4 py-3">
                        <div className="flex justify-center">
                          <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-300 bg-white shadow-sm">
                            {imagenUrl ? (
                              <img
                                src={imagenUrl}
                                alt={p.nombre}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // Si la imagen falla al cargar, mostrar icono
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.parentElement!.innerHTML = `
                                    <div class="w-full h-full flex items-center justify-center bg-gray-100">
                                      <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                      </svg>
                                    </div>
                                  `;
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <FiImage className="text-gray-400" size={20} />
                              </div>
                            )}
                            
                            {/* Badge para indicar si tiene imagen */}
                            {imagenUrl && (
                              <div className="absolute -bottom-1 -right-1">
                                <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-800">{p.codigoProducto}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="max-w-[200px]">
                          <span className="font-medium text-gray-800">{p.nombre}</span>
                          {p.descripcion && (
                            <p className="text-xs text-gray-600 truncate mt-1">{p.descripcion}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {p.categoria?.nombre || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800">
                            Bs. {Number(p.precioCompra).toFixed(2)}
                          </span>
                          <span className="text-xs text-gray-500">Compra</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800">
                            Bs. {Number(p.precioVenta).toFixed(2)}
                          </span>
                          <span className="text-xs text-gray-500">Venta</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            p.stock < p.stockMinimo 
                              ? 'bg-red-100 text-red-800' 
                              : p.stock === p.stockMinimo 
                                ? 'bg-amber-100 text-amber-800' 
                                : 'bg-green-100 text-green-800'
                          }`}>
                            {p.stock}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gray-700">{p.stockMinimo}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-3 h-3 rounded-full ${estado.dot}`}
                          />
                          <span
                            className={`text-xs font-medium ${estado.text}`}
                          >
                            {estadoTexto(p)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openDetailModal(p)}
                            className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm hover:bg-indigo-200 transition-all duration-200 hover:scale-105"
                            title="Ver detalle"
                          >
                            <FiEye />
                          </button>
                          <button
                            onClick={() => openEditModal(p)}
                            className="w-9 h-9 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center text-sm hover:bg-gray-200 transition-all duration-200 hover:scale-105"
                            title="Editar"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDelete(p)}
                            className="w-9 h-9 rounded-lg bg-red-100 text-red-600 flex items-center justify-center text-sm hover:bg-red-200 transition-all duration-200 hover:scale-105"
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
                max-w-2xl
                rounded-xl
                shadow-2xl
                border
                border-gray-300
                max-h-[90vh]
                overflow-y-auto
            "
          >
            {/* CABECERA */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-xl">
              <h2 className="font-bold text-xl text-white text-center">
                {modalMode === "create" ? "NUEVO PRODUCTO" : "EDITAR PRODUCTO"}
              </h2>
            </div>

            {/* CUERPO */}
            <div className="px-6 py-5 space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{errorMsg}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Columna Izquierda - Datos Básicos */}
                <div className="space-y-4">
                  {/* Nombre */}
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-sm text-gray-700 flex items-center gap-1">
                      <span className="text-red-500">*</span> Nombre del Producto
                    </label>
                    <input
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="Ej: Llanta de moto 17"
                      required
                    />
                  </div>

                  {/* Código */}
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-sm text-gray-700 flex items-center gap-1">
                      <span className="text-red-500">*</span> Código
                    </label>
                    <input
                      name="codigoProducto"
                      value={form.codigoProducto}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="Ej: LLA-001"
                      required
                    />
                  </div>

                  {/* Categoría */}
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-sm text-gray-700 flex items-center gap-1">
                      <span className="text-red-500">*</span> Categoría
                    </label>
                    <select
                      name="idCategoria"
                      value={form.idCategoria}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none"
                      required
                    >
                      <option value="" className="text-gray-400">Seleccionar categoría</option>
                      {categorias.map((c) => (
                        <option key={c.idCategoria} value={c.idCategoria}>
                          {c.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Descripción */}
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-sm text-gray-700">
                      Descripción
                    </label>
                    <textarea
                      name="descripcion"
                      value={form.descripcion}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white resize-none h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="Describe las características del producto..."
                    />
                  </div>
                </div>

                {/* Columna Derecha - Precios, Stock e Imagen */}
                <div className="space-y-4">
                  {/* Precios */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2">
                      <label className="font-semibold text-sm text-gray-700 flex items-center gap-1">
                        <span className="text-red-500">*</span> Precio Compra
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Bs.</span>
                        <input
                          type="number"
                          step="0.01"
                          name="precioCompra"
                          value={form.precioCompra}
                          onChange={handleChange}
                          className="border border-gray-300 rounded-lg pl-10 pr-4 py-3 w-full text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-semibold text-sm text-gray-700 flex items-center gap-1">
                        <span className="text-red-500">*</span> Precio Venta
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Bs.</span>
                        <input
                          type="number"
                          step="0.01"
                          name="precioVenta"
                          value={form.precioVenta}
                          onChange={handleChange}
                          className="border border-gray-300 rounded-lg pl-10 pr-4 py-3 w-full text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stock */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2">
                      <label className="font-semibold text-sm text-gray-700 flex items-center gap-1">
                        <span className="text-red-500">*</span> Stock Actual
                      </label>
                      <input
                        type="number"
                        name="stock"
                        value={form.stock}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="0"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-semibold text-sm text-gray-700 flex items-center gap-1">
                        <span className="text-red-500">*</span> Stock Mínimo
                      </label>
                      <input
                        type="number"
                        name="stockMinimo"
                        value={form.stockMinimo}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>

                  {/* Estado */}
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-sm text-gray-700 flex items-center gap-1">
                      <span className="text-red-500">*</span> Estado
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="estado"
                          value="activo"
                          checked={form.estado === "activo"}
                          onChange={handleChange}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Activo</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="estado"
                          value="inactivo"
                          checked={form.estado === "inactivo"}
                          onChange={handleChange}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Inactivo</span>
                      </label>
                    </div>
                  </div>

                  {/* Upload de Imagen */}
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-sm text-gray-700">
                      Imagen del Producto
                    </label>
                    
                    {/* Área de Drop */}
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition cursor-pointer"
                         onClick={() => document.getElementById('fileInput')?.click()}>
                      <input
                        id="fileInput"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      
                      {preview ? (
                        <div className="relative">
                          <img
                            src={preview}
                            alt="Preview"
                            className="mx-auto max-h-48 rounded-lg shadow-md object-contain"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage();
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                          >
                            <FiX size={18} />
                          </button>
                          <p className="mt-2 text-sm text-gray-600 truncate">{fileName}</p>
                        </div>
                      ) : (
                        <div>
                          <div className="w-16 h-16 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                            <FiImage className="text-blue-500" size={28} />
                          </div>
                          <p className="text-gray-600 mb-1">
                            <span className="text-blue-600 font-medium">Haz clic para subir</span> o arrastra una imagen
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF hasta 2MB
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Tips */}
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600">
                        <strong>Recomendaciones:</strong> Usa imágenes nítidas, fondo claro, tamaño mínimo 500x500px.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition flex items-center gap-2"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium hover:from-green-600 hover:to-green-700 transition shadow-md flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Guardando...
                  </>
                ) : modalMode === "create" ? (
                  <>
                    <FiUpload /> Crear Producto
                  </>
                ) : (
                  <>
                    <FiEdit2 /> Actualizar Producto
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Detalle */}
      {modalMode === "detail" && selectedProducto && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-gray-300">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 rounded-t-xl">
              <h2 className="font-bold text-xl text-white">
                DETALLE DE PRODUCTO / {selectedProducto.codigoProducto}
              </h2>
            </div>

            <div className="px-6 py-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Columna Imagen */}
                <div className="md:col-span-1">
                  {selectedProducto.imagenURL ? (
                    <div className="bg-gray-100 rounded-xl p-4 border border-gray-200">
                      <img
                        src={`http://localhost:8000/storage/${selectedProducto.imagenURL}`}
                        alt={selectedProducto.nombre}
                        className="w-full h-auto rounded-lg shadow-md"
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-100 rounded-xl p-8 border border-gray-200 flex flex-col items-center justify-center h-full">
                      <FiImage className="text-gray-400 mb-3" size={48} />
                      <p className="text-gray-500 text-sm text-center">
                        Sin imagen
                      </p>
                    </div>
                  )}
                </div>

                {/* Columna Información */}
                <div className="md:col-span-2 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Nombre</p>
                      <p className="text-sm text-gray-800 font-semibold mt-1">{selectedProducto.nombre}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Categoría</p>
                      <p className="text-sm text-gray-800 font-semibold mt-1">{selectedProducto.categoria?.nombre || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Precio Compra</p>
                      <p className="text-sm text-gray-800 font-semibold mt-1">
                        Bs. {Number(selectedProducto.precioCompra).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Precio Venta</p>
                      <p className="text-sm text-gray-800 font-semibold mt-1">
                        Bs. {Number(selectedProducto.precioVenta).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Stock Actual</p>
                      <p className="text-sm text-gray-800 font-semibold mt-1">{selectedProducto.stock}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Stock Mínimo</p>
                      <p className="text-sm text-gray-800 font-semibold mt-1">{selectedProducto.stockMinimo}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Estado Stock</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`w-3 h-3 rounded-full ${estadoClases(selectedProducto).dot}`} />
                        <span className={`text-sm font-medium ${estadoClases(selectedProducto).text}`}>
                          {estadoTexto(selectedProducto)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Estado Producto</p>
                      <div className="mt-1">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          selectedProducto.estado === 'activo' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedProducto.estado === 'activo' ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedProducto.descripcion && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500 font-medium mb-2">Descripción</p>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {selectedProducto.descripcion}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-200 flex justify-center">
              <button
                onClick={closeModal}
                className="px-6 py-2.5 rounded-lg bg-gray-600 text-white text-sm font-medium hover:bg-gray-700 transition"
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