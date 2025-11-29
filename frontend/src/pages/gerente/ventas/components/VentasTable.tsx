import { FiEye } from "react-icons/fi";
import { Venta } from "../ventas.service";

interface Props {
  ventas: Venta[];
  loading: boolean;
  filteredSearch: (v: Venta) => boolean;
  onVerDetalle: (venta: Venta) => void;
}

export const VentasTable: React.FC<Props> = ({
  ventas,
  loading,
  filteredSearch,
  onVerDetalle,
}) => {
  const formatFecha = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleDateString();
  };

  const formatHora = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const ventasFiltradas = ventas.filter(filteredSearch);

  return (
    <div className="bg-[#f3ebe7] border border-gray-300 rounded-md overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-300">
          <tr className="text-left">
            <th className="px-4 py-2 font-semibold">id Venta</th>
            <th className="px-4 py-2 font-semibold">Fecha</th>
            <th className="px-4 py-2 font-semibold">Cliente</th>
            <th className="px-4 py-2 font-semibold">
              Empleado (Vendedor)
            </th>
            <th className="px-4 py-2 font-semibold">Método de pago</th>
            <th className="px-4 py-2 font-semibold">Monto Total</th>
            <th className="px-4 py-2 font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td
                colSpan={7}
                className="text-center py-6 text-gray-600"
              >
                Cargando ventas...
              </td>
            </tr>
          )}

          {!loading && ventasFiltradas.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="text-center py-6 text-gray-600"
              >
                No se encontraron ventas.
              </td>
            </tr>
          )}

          {!loading &&
            ventasFiltradas.map((venta, idx) => {
              const clienteNombre = `${venta.cliente.persona.nombres} ${venta.cliente.persona.paterno}`;
              const empPersona = venta.empleado.persona;
              const empleadoNombre = `${empPersona.nombres} ${empPersona.paterno}`;

              return (
                <tr
                  key={venta.idVenta}
                  className={
                    idx % 2 === 0
                      ? "bg-[#f8f2ee]"
                      : "bg-[#efe4dd]"
                  }
                >
                  <td className="px-4 py-2">V-{venta.idVenta.toString().padStart(4, "0")}</td>
                  <td className="px-4 py-2">
                    {formatFecha(venta.fecha)}
                  </td>
                  <td className="px-4 py-2">{clienteNombre}</td>
                  <td className="px-4 py-2">{empleadoNombre}</td>
                  <td className="px-4 py-2 capitalize">
                    {venta.metodoPago}
                  </td>
                  <td className="px-4 py-2">
                    Bs. {Number(venta.montoTotal).toFixed(2)}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onVerDetalle(venta)}
                        className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs hover:bg-indigo-700"
                        title="Ver detalle"
                      >
                        <FiEye />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};
