import CategoryCardModel  from './categoryCard.model';

export default interface ProductCardModel {
  id: number;
  nombre: string;
  descripcion?: string;
  precioVenta: number;
  unidadMedida: string;
  stockFisico: number;
  stockReservado: number;
  urlImagen?: string;
  isActive: boolean;
  discount?: number; 
  categoria: CategoryCardModel;
}
