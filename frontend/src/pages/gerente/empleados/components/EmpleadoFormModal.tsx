import React, { useEffect, useState } from "react";
import {
  DepartamentoOption,
  Empleado,
  EmpleadoCreatePayload,
  EmpleadoUpdatePayload,
} from "../empleados.service";

interface Props {
  open: boolean;
  mode: "create" | "edit";
  empleado?: Empleado | null;
  departamentosOptions: DepartamentoOption[];
  onClose: () => void;
  onCreate: (payload: EmpleadoCreatePayload) => Promise<void>;
  onUpdate: (idEmpleado: number, payload: EmpleadoUpdatePayload) => Promise<void>;
}

interface FormState {
  ci: string;
  paterno: string;
  materno: string;
  nombres: string;
  fechaNacimiento: string;          
  genero: "M" | "F" | "O" | "";     
  telefono: string;
  email: string;
  direccion: string;
  fechaContratacion: string;        
  password: string;
  departamentoInicialId: number | null;
}

const initialState: FormState = {
  ci: "",
  paterno: "",
  materno: "",
  nombres: "",
  fechaNacimiento: "",
  genero: "M",
  telefono: "",
  email: "",
  direccion: "",
  fechaContratacion: "",
  password: "",
  departamentoInicialId: null,
};

function toInputDate(iso: string | undefined | null) {
  if (!iso) return "";
  return iso.slice(0, 10);
}

const EmpleadoFormModal: React.FC<Props> = ({
  open,
  mode,
  empleado,
  departamentosOptions,
  onClose,
  onCreate,
  onUpdate,
}) => {
  const [form, setForm] = useState<FormState>(initialState);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && empleado) {
      const persona = empleado.persona;
      const deptActual =
        empleado.departamentos && empleado.departamentos.length > 0
          ? empleado.departamentos[0].idDepartamento
          : null;

      setForm({
        ci: persona.ci,
        paterno: persona.paterno,
        materno: persona.materno,
        nombres: persona.nombres,
        fechaNacimiento: toInputDate(persona.fecha_naci),
        genero: (persona.genero as any) || "M",
        telefono: persona.telefono,
        email: empleado.email,
        direccion: empleado.direccion,
        fechaContratacion: toInputDate(empleado.fecha_contratacion),
        password: "",
        departamentoInicialId: deptActual,
      });
    } else {
      setForm(initialState);
    }
  }, [open, mode, empleado]);

  if (!open) return null;

  const title = mode === "create" ? "NUEVO EMPLEADO" : "EDITAR EMPLEADO";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "departamentoInicialId") {
      setForm((prev) => ({
        ...prev,
        departamentoInicialId: value === "" ? null : Number(value),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: EmpleadoCreatePayload = {
      ci: form.ci,
      paterno: form.paterno,
      materno: form.materno,
      nombres: form.nombres,
      fechaNacimiento: form.fechaNacimiento,
      genero: form.genero as "M" | "F" | "O" | "",
      telefono: form.telefono,
      email: form.email,
      direccion: form.direccion,
      fechaContratacion: form.fechaContratacion,
      password: form.password,
      departamentoInicialId: form.departamentoInicialId,
    };

    try {
      setSaving(true);

      if (mode === "edit" && empleado) {
        await onUpdate(empleado.idEmpleado, payload as EmpleadoUpdatePayload);
      } else {
        await onCreate(payload);
      }

      onClose();
    } catch (err: any) {
      console.error("Error al guardar empleado:", err?.response?.data || err);
      alert("Ocurrió un error al guardar el empleado.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-[#f5ede8] w-[95%] max-w-3xl rounded-md shadow-lg border border-gray-400">
        {/* HEADER */}
        <div className="bg-[#e5ddda] px-6 py-3 rounded-t-md">
          <h2 className="font-semibold text-lg text-center text-gray-800">
            {title}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 text-sm space-y-3">
          {/* CI / Paterno */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">CI:</label>
              <input
                type="text"
                name="ci"
                value={form.ci}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-sm px-3 py-1.5 bg-white"
                required
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Paterno:</label>
              <input
                type="text"
                name="paterno"
                value={form.paterno}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-sm px-3 py-1.5 bg-white"
                required
              />
            </div>
          </div>

          {/* Materno / Nombres */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">Materno:</label>
              <input
                type="text"
                name="materno"
                value={form.materno}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-sm px-3 py-1.5 bg-white"
                required
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Nombres:</label>
              <input
                type="text"
                name="nombres"
                value={form.nombres}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-sm px-3 py-1.5 bg-white"
                required
              />
            </div>
          </div>

          {/* Fecha nacimiento / Género */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">
                Fecha Nacimiento:
              </label>
              <input
                type="date"
                name="fechaNacimiento"
                value={form.fechaNacimiento}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-sm px-3 py-1.5 bg-white"
                required
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Género:</label>
              <select
                name="genero"
                value={form.genero}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="">Seleccionar</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="O">Otro</option>
              </select>
            </div>
          </div>

          {/* Teléfono / Fecha contratación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">Teléfono:</label>
              <input
                type="text"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-sm px-3 py-1.5 bg-white"
                required
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">
                Fecha contratación:
              </label>
              <input
                type="date"
                name="fechaContratacion"
                value={form.fechaContratacion}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-sm px-3 py-1.5 bg-white"
                required
              />
            </div>
          </div>

          {/* Email / Dirección */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">Email:</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-sm px-3 py-1.5 bg-white"
                required
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Dirección:</label>
              <input
                type="text"
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-sm px-3 py-1.5 bg-white"
                required
              />
            </div>
          </div>

          {/* Password + Departamento inicial */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">
                {mode === "create"
                  ? "Password:"
                  : "Password (dejar vacío para no cambiar):"}
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-sm px-3 py-1.5 bg-white"
                required={mode === "create"}
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">
                Departamento inicial:
              </label>
              <select
                name="departamentoInicialId"
                value={
                  form.departamentoInicialId === null
                    ? ""
                    : String(form.departamentoInicialId)
                }
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-sm px-3 py-1.5 bg-white"
              >
                <option value="">Sin asignar</option>
                {departamentosOptions.map((d) => (
                  <option key={d.idDepartamento} value={d.idDepartamento}>
                    {d.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Botones */}
          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-sm bg-gray-500 text-white text-sm hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-sm bg-green-600 text-white text-sm hover:bg-green-700 disabled:opacity-60"
            >
              {mode === "create"
                ? "Guardar nuevo empleado"
                : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmpleadoFormModal;
