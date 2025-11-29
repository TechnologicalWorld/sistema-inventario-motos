import React, { useEffect, useMemo, useState } from "react";
import {
  createCompra,
  fetchProductosOptions,
  NuevaCompraPayload,
  ProveedorOption,
  ProductoOption,
} from "../compras.service";
import AgregarProductoModal from "./AgregarProductoModal";
import { FiTrash2 } from "react-icons/fi";

interface Props {
  proveedores: ProveedorOption[];
  onCancel: () => void;
  onSaved: () => void;
}

interface DetalleDraft {
  idTemp: number;
  producto: ProductoOption;
  cantidad: number;
  precioUnitario: number;
}

function todayInputValue() {
  const d = new Date();
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const NuevaCompraForm: React.FC<Props> = ({
  proveedores,
  onCancel,
  onSaved,
}) => {
  const [fecha, setFecha] = useState(todayInputValue());
  const [idEmpresaP, setIdEmpresaP] = useState<number | "">("");
  const [observacion, setObservacion] = useState("");
  const [detalles, setDetalles] = useState<DetalleDraft[]>([]);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [productos, setProductos] = useState<ProductoOption[]>([]);
  const [loadingProductos, setLoadingProductos] = useState(false);

  const [modalProductoOpen, setModalProductoOpen] = useState(false);

  useEffect(() => {
    const loadProductos = async () => {
      setLoadingProductos(true);
      try {
        const list = await fetchProductosOptions();
        setProductos(list);
      } finally {
        setLoadingProductos(false);
      }
    };
    loadProductos();
  }, []);

  const resumen = useMemo(() => {
    const totalItems = detalles.length;
    const totalUnidades = detalles.reduce(
      (acc, d) => acc + d.cantidad,
      0
    );
    const totalPago = detalles.reduce(
      (acc, d) => acc + d.cantidad * d.precioUnitario,
      0
    );
    return { totalItems, totalUnidades, totalPago };
  }, [detalles]);

  const handleAgregarDetalle = (data: {
    idProducto: number;
    cantidad: number;
    precioUnitario: number;
  }) => {
    const producto = productos.find(
      (p) => p.idProducto === data.idProducto
    );
    if (!producto) return;

    setDetalles((prev) => [
      ...prev,
      {
        idTemp: Date.now() + Math.random(),
        producto,
        cantidad: data.cantidad,
        precioUnitario: data.precioUnitario,
      },
    ]);
    setModalProductoOpen(false);
  };

  const handleEliminarDetalle = (idTemp: number) => {
    setDetalles((prev) => prev.filter((d) => d.idTemp !== idTemp));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!idEmpresaP || typeof idEmpresaP !== "number") {
      setErrorMsg("Selecciona un proveedor.");
      return;
    }
    if (detalles.length === 0) {
      setErrorMsg("Agrega al menos un producto a la compra.");
      return;
    }

    const payload: NuevaCompraPayload = {
      idEmpresaP,
      observacion: observacion || undefined,
      detalles: detalles.map((d) => ({
        idProducto: d.producto.idProducto,
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario,
      })),
    };

    try {
      setSaving(true);
      await createCompra(payload);
      onSaved();
    } catch (e: any) {
      setErrorMsg(
        e.message || "Error al registrar la compra. Intenta de nuevo."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full">
      {/* Título */}
      <div className="mb-4 flex items-center justify-center">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          NUEVA COMPRA
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-[#f5ede8] border border-gray-300 rounded-md p-4 md:p-6 text-sm"
      >
        {errorMsg && (
          <div className="mb-3 text-sm text-red-600">{errorMsg}</div>
        )}

        {/* Datos principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Fecha */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm">Fecha:</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="border border-gray-400 rounded-sm px-3 py-1.5 text-sm bg-white"
            />
            
          </div>

          {/* Proveedor */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm">Proveedor:</label>
            <select
              value={idEmpresaP}
              onChange={(e) =>
                setIdEmpresaP(
                  e.target.value ? Number(e.target.value) : ""
                )
              }
              className="border border-gray-400 rounded-sm px-3 py-1.5 text-sm bg-white"
              required
            >
              <option value="">Seleccionar</option>
              {proveedores.map((p) => (
                <option key={p.idEmpresaP} value={p.idEmpresaP}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Gerente */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm">Gerente:</label>
            <input
              disabled
              value="Se usará automáticamente el gerente autenticado."
              className="border border-gray-400 rounded-sm px-3 py-1.5 text-sm bg-gray-100 text-gray-700"
            />
          </div>

          {/* Observación */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm">Observación:</label>
            <textarea
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              className="border border-gray-400 rounded-sm px-3 py-1.5 text-sm bg-white resize-none h-20"
              placeholder="Opcional..."
            />
          </div>
        </div>

        {/* Detalle de compra */}
        <div className="mt-2">
          <h2 className="font-semibold text-sm mb-2">
            Detalle de Compra
          </h2>
          <button
            type="button"
            onClick={() => setModalProductoOpen(true)}
            disabled={loadingProductos}
            className="mb-3 inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-blue-700 text-white text-sm hover:bg-blue-800 disabled:opacity-60"
          >
            + Agregar producto
          </button>

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
                  <th className="px-4 py-2 text-left font-semibold">
                    {/* acciones */}
                  </th>
                </tr>
              </thead>
              <tbody>
                {detalles.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-4 text-center text-gray-600"
                    >
                      No se han agregado productos a la compra.
                    </td>
                  </tr>
                )}

                {detalles.map((d, idx) => {
                  const subtotal = d.cantidad * d.precioUnitario;
                  return (
                    <tr
                      key={d.idTemp}
                      className={
                        idx % 2 === 0
                          ? "bg-[#f8f2ee]"
                          : "bg-[#efe4dd]"
                      }
                    >
                      <td className="px-4 py-2">
                        {d.producto.nombre} (
                        {d.producto.codigoProducto})
                      </td>
                      <td className="px-4 py-2">
                        Bs. {d.precioUnitario.toFixed(2)}
                      </td>
                      <td className="px-4 py-2">{d.cantidad}</td>
                      <td className="px-4 py-2">
                        Bs. {subtotal.toFixed(2)}
                      </td>
                      <td className="px-4 py-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleEliminarDetalle(d.idTemp)
                          }
                          className="text-red-600 hover:text-red-800"
                          title="Quitar producto"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resumen + botones */}
        <div className="mt-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="border border-gray-300 bg-[#f0e7e2] rounded-md px-4 py-3 text-sm w-full md:w-72">
            <h4 className="font-semibold mb-2 text-gray-800">
              Resumen de Compra
            </h4>
            <div className="flex justify-between">
              <span>Total ítems:</span>
              <span>{resumen.totalItems}</span>
            </div>
            <div className="flex justify-between">
              <span>Total unidades:</span>
              <span>{resumen.totalUnidades}</span>
            </div>
            <div className="flex justify-between font-semibold mt-2">
              <span>Total pago:</span>
              <span>
                Bs. {resumen.totalPago.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center px-4 py-2 rounded-sm bg-green-600 text-white text-sm hover:bg-green-700 disabled:opacity-60"
            >
              Confirmar Compra
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-sm bg-gray-600 text-white text-sm hover:bg-gray-700"
            >
              Cancelar
            </button>
          </div>
        </div>
      </form>

      {/* Modal agregar producto */}
      <AgregarProductoModal
        open={modalProductoOpen}
        productos={productos}
        onClose={() => setModalProductoOpen(false)}
        onConfirm={handleAgregarDetalle}
      />
    </div>
  );
};

export default NuevaCompraForm;
