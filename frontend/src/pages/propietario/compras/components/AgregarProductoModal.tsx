import React, { useEffect, useState } from "react";
import { ProductoOption } from "../compras.service";

interface Props {
  open: boolean;
  productos: ProductoOption[];
  onClose: () => void;
  onConfirm: (detalle: {
    idProducto: number;
    cantidad: number;
    precioUnitario: number;
  }) => void;
}

const AgregarProductoModal: React.FC<Props> = ({
  open,
  productos,
  onClose,
  onConfirm,
}) => {
  const [idProducto, setIdProducto] = useState<number | "">("");
  const [cantidad, setCantidad] = useState<string>("1");
  const [precioUnitario, setPrecioUnitario] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setErrorMsg(null);
      setCantidad("1");
      if (productos.length > 0) {
        const p0 = productos[0];
        setIdProducto(p0.idProducto);
        setPrecioUnitario(String(p0.precioCompra ?? 0));
      } else {
        setIdProducto("");
        setPrecioUnitario("");
      }
    }
  }, [open, productos]);

  if (!open) return null;

  const selectedProducto =
    typeof idProducto === "number"
      ? productos.find((p) => p.idProducto === idProducto)
      : undefined;

  const subtotal =
    Number(precioUnitario || 0) * Number(cantidad || 0) || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!idProducto || typeof idProducto !== "number") {
      setErrorMsg("Selecciona un producto.");
      return;
    }
    const cant = Number(cantidad);
    const precio = Number(precioUnitario);
    if (cant <= 0 || !Number.isFinite(cant)) {
      setErrorMsg("La cantidad debe ser mayor a 0.");
      return;
    }
    if (precio < 0 || !Number.isFinite(precio)) {
      setErrorMsg("El precio unitario no es válido.");
      return;
    }

    onConfirm({
      idProducto,
      cantidad: cant,
      precioUnitario: precio,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-[#f5ede8] w-[95%] max-w-lg rounded-md shadow-lg border border-gray-400 max-h-[90vh] overflow-y-auto"
      >
        {/* CABECERA */}
        <div className="bg-[#e5ddda] px-6 py-3 rounded-t-md text-center">
          <h2 className="font-semibold text-lg text-gray-800">
            AGREGAR PRODUCTO A LA COMPRA
          </h2>
        </div>

        {/* CUERPO */}
        <div className="px-6 py-4 space-y-3 text-sm">
          {errorMsg && (
            <div className="mb-2 text-sm text-red-600">{errorMsg}</div>
          )}

          {/* Producto */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm">Producto:</label>
            <select
              value={idProducto}
              onChange={(e) => {
                const value = e.target.value;
                if (!value) {
                  setIdProducto("");
                  setPrecioUnitario("");
                  return;
                }
                const idNum = Number(value);
                setIdProducto(idNum);
                const prod = productos.find((p) => p.idProducto === idNum);
                setPrecioUnitario(
                  prod ? String(prod.precioCompra ?? 0) : ""
                );
              }}
              className="border border-gray-400 rounded-sm px-3 py-1.5 text-sm bg-white"
              required
            >
              {productos.length === 0 && (
                <option value="">No hay productos disponibles</option>
              )}
              {productos.length > 0 && (
                <>
                  <option value="">Seleccionar</option>
                  {productos.map((p) => (
                    <option key={p.idProducto} value={p.idProducto}>
                      {p.nombre} ({p.codigoProducto})
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          {/* Info rápida del producto */}
          {selectedProducto && (
            <div className="text-xs text-gray-700 border border-gray-300 rounded-sm px-3 py-2 bg-[#f0e7e2]">
              <div>
                <span className="font-semibold">Código: </span>
                <span>{selectedProducto.codigoProducto}</span>
              </div>
              <div>
                <span className="font-semibold">Precio compra base: </span>
                <span>Bs. {selectedProducto.precioCompra.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Cantidad y precio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-sm">Cantidad:</label>
              <input
                type="number"
                min={1}
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                className="border border-gray-400 rounded-sm px-3 py-1.5 text-sm bg-white"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-sm">
                Precio unitario (Bs.):
              </label>
              <input
                type="number"
                step="0.01"
                value={precioUnitario}
                onChange={(e) => setPrecioUnitario(e.target.value)}
                className="border border-gray-400 rounded-sm px-3 py-1.5 text-sm bg-white"
                required
              />
            </div>
          </div>

          {/* Subtotal */}
          <div className="flex justify-between mt-2 text-sm">
            <span className="font-semibold">Subtotal estimado:</span>
            <span>Bs. {subtotal.toFixed(2)}</span>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-3 flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-start">
          <button
            type="submit"
            className="px-4 py-2 rounded-sm bg-green-600 text-white text-sm hover:bg-green-700"
          >
            Agregar a la compra
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-sm bg-gray-600 text-white text-sm hover:bg-gray-700"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgregarProductoModal;
