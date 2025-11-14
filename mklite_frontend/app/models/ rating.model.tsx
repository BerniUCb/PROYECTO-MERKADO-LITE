import Pedido from "./order.model";
import User from "./user.model";

export default interface Calificacion {
  id: number;
  puntuacion: number;
  comentario?: string;
  fechaCalificacion: string;

  pedido: Pedido;
  cliente: User;
}
