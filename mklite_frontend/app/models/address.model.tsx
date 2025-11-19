// models/direccion.model.ts

export default interface DireccionModel {
  id: number;
  calle: string;
  numeroExterior: string;
  numeroInterior?: string | null;
  codigoPostal: string;
  ciudad: string;
  estado: string;
  referencias?: string | null;
  aliasDireccion: string; // Ej: "Casa", "Oficina"
  isDefault: boolean;
  usuarioId: number;      // Relación simplificada para el frontend
}
