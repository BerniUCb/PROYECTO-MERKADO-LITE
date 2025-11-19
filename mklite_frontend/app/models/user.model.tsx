import type DireccionModel from "./address.model";

export type RolUsuario =
  | 'Administrador'
  | 'Vendedor'
  | 'Almacen'
  | 'Repartidor'
  | 'Cliente'
  | 'Soporte'
  | 'Proveedor';

export default interface User {
  id: number;
  nombreCompleto: string;
  email: string;
  rol: RolUsuario;
  isActive: boolean;
  direcciones: DireccionModel[];
}
