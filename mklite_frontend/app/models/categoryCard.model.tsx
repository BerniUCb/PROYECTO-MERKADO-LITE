import { IconType } from 'react-icons';

interface CategoryCardModel {
   id: number;
  nombre: string;
  descripcion: string; // esto te llega del backend
  IconComponent?: IconType;
}

export default CategoryCardModel;
