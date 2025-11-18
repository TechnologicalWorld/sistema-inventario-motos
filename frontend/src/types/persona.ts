export interface Persona {
  idPersona: number;
  ci: number;
  paterno: string;
  materno: string;
  nombres: string;
  fecha_naci: string;
  genero: "M" | "F";
  telefono: string;
}
