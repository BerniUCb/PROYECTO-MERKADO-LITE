import CategoryCardModel  from './categoryCard.model';

export default interface ProductCardModel {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  
}

export default interface ProductoCardModel {
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
