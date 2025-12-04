import { useEffect, useState } from "react";
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
import categoriasService, { Categoria } from "../categorias.service";

interface CategoriaFormState {
  idCategoria?: number;
  nombre: string;
  descripcion: string;
}

type ModalMode = "create" | "edit" | "detail" | null;

const emptyForm: CategoriaFormState = {
  nombre: "",
  descripcion: "",
};

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [filtered, setFiltered] = useState<Categoria[]>([]);
  const [search, setSearch] = useState("");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<Categoria | null>(null);
  const [form, setForm] = useState<CategoriaFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const currentPageData = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const loadCategorias = async () => {
    try {
      const res = await categoriasService.getCategorias();
      setCategorias(res);
      setFiltered(res);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadCategorias();
  }, []);

  useEffect(() => {
    const text = search.toLowerCase();
    const flt = categorias.filter(
      (c) =>
        c.nombre.toLowerCase().includes(text) ||
        (c.descripcion || "").toLowerCase().includes(text)
    );
    setFiltered(flt);
    setPage(1);
  }, [search, categorias]);

  const handleRefresh = () => {
    setSearch("");
    loadCategorias();
  };

  const openCreate = () => {
    setForm(emptyForm);
    setSelected(null);
    setModalMode("create");
    setErrorMsg(null);
  };

  const openEdit = (cat: Categoria) => {
    setSelected(cat);
    setForm({
      idCategoria: cat.idCategoria,
      nombre: cat.nombre,
      descripcion: cat.descripcion || "",
    });
    setModalMode("edit");
    setErrorMsg(null);
  };

  const openDetail = (cat: Categoria) => {
    setSelected(cat);
    setModalMode("detail");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelected(null);
    setForm(emptyForm);
    setErrorMsg(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);

    try {
      const payload = {
        nombre: form.nombre,
        descripcion: form.descripcion || null,
      };

      if (modalMode === "create") {
        await categoriasService.createCategoria(payload as any);
      } else if (modalMode === "edit" && form.idCategoria) {
        await categoriasService.updateCategoria(
          form.idCategoria,
          payload as any
        );
      }

      await loadCategorias();
      closeModal();
    } catch (error: any) {
      const msg =
        error?.response?.data?.error || "Error al guardar la categoría";
      setErrorMsg(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: Categoria) => {
    if (!confirm(`¿Seguro que deseas eliminar la categoría "${cat.nombre}"?`))
      return;

    try {
      await categoriasService.deleteCategoria(cat.idCategoria);
      await loadCategorias();
    } catch (error: any) {
      const msg =
        error?.response?.data?.error || "No se pudo eliminar la categoría";
      alert(msg);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Lista de tipos de productos registrados en el sistema
          </h1>
          <div className="mt-2 h-[1px] bg-gray-300 w-full" />
        </div>

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

      {/* Buscador + botón agregar */}
      <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
        {/* IZQUIERDA: buscador compacto */}
        <div className="min-w-[260px] max-w-md w-full md:w-auto">
          <div className="flex items-center bg-white border border-gray-400 rounded-full overflow-hidden">
            <span className="px-3 text-gray-500">
              <FiSearch />
            </span>
            <input
              type="text"
              placeholder="Buscar Categoría..."
              className="flex-1 px-2 py-2 text-sm outline-none border-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="px-5 py-2 bg-black text-white text-sm hover:bg-gray-900 transition">
              Buscar
            </button>
          </div>
        </div>

        {/* DERECHA: botón agregar */}
        <div>
          <button
            onClick={openCreate}
            className="px-5 py-2 rounded-full bg-blue-600 text-white text-sm hover:bg-blue-700 shadow"
          >
            Agregar Categoría
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-[#f3ebe7] border border-gray-300 rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-300">
            <tr className="text-left">
              <th className="px-4 py-2 font-semibold">id Categoría</th>
              <th className="px-4 py-2 font-semibold">Nombre</th>
              <th className="px-4 py-2 font-semibold">Descripción</th>
              <th className="px-4 py-2 font-semibold">Nº Productos</th>
              <th className="px-4 py-2 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-600">
                  No hay categorías registradas.
                </td>
              </tr>
            )}

            {currentPageData.map((c, idx) => (
              <tr
                key={c.idCategoria}
                className={idx % 2 === 0 ? "bg-[#f8f2ee]" : "bg-[#efe4dd]"}
              >
                <td className="px-4 py-2">
                  C-
                  {String(c.idCategoria).padStart(3, "0")}
                </td>
                <td className="px-4 py-2">{c.nombre}</td>
                <td className="px-4 py-2">{c.descripcion}</td>
                <td className="px-4 py-2">{c.productos_count ?? 0}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openDetail(c)}
                      className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs hover:bg-indigo-700"
                      title="Ver detalle"
                    >
                      <FiEye />
                    </button>
                    <button
                      onClick={() => openEdit(c)}
                      className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs hover:bg-gray-800"
                      title="Editar"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(c)}
                      className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-xs hover:bg-red-700"
                      title="Eliminar"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
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
          onClick={() => setPage((p) => Math.max(1, p - 1))}
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
          Página {page} de {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm ${
            page >= totalPages
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
            className="bg-[#f5ede8] w-full max-w-xl rounded-md shadow-lg border border-gray-400"
          >
            <div className="bg-[#e5ddda] px-6 py-3 rounded-t-md text-center">
              <h2 className="font-semibold text-lg text-gray-800">
                {modalMode === "create"
                  ? "NUEVA CATEGORÍA"
                  : "EDITAR CATEGORÍA"}
              </h2>
            </div>

            <div className="px-6 py-4 space-y-3">
              {errorMsg && (
                <div className="mb-2 text-sm text-red-600">{errorMsg}</div>
              )}

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

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-sm">Descripción:</label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  className="border border-gray-400 rounded-sm px-3 py-1.5 text-sm bg-white resize-none h-24"
                />
              </div>
            </div>

            <div className="px-6 py-3 flex justify-start gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-sm bg-green-600 text-white text-sm hover:bg-green-700 disabled:opacity-60"
              >
                {modalMode === "create"
                  ? "Guardar nueva categoría"
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
      {modalMode === "detail" && selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-[#f5ede8] w-full max-w-xl rounded-md shadow-lg border border-gray-400">
            <div className="bg-[#e5ddda] px-6 py-3 rounded-t-md text-left">
              <h2 className="font-semibold text-lg text-gray-800">
                DETALLE DE CATEGORÍA / C-
                {String(selected.idCategoria).padStart(3, "0")}
              </h2>
            </div>

            <div className="px-6 py-4 space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-y-2">
                <span className="font-semibold">Nombre:</span>
                <span>{selected.nombre}</span>

                <span className="font-semibold">Descripción:</span>
                <span>{selected.descripcion}</span>

                <span className="font-semibold">Nº Productos:</span>
                <span>{selected.productos_count ?? 0}</span>
              </div>
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
