import Pedido from "./pedido.model";
import User from "./user.model";

export default interface Calificacion {
  id: number;
  puntuacion: number;
  comentario?: string;
  fechaCalificacion: string;

  pedido: Pedido;
  cliente: User;
}
