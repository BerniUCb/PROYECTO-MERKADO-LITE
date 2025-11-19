import { IconType } from 'react-icons';

interface CategoryCardModel {
   id: number;
  name: string;
  descripcion: string; // esto te llega del backend
  IconComponent?: IconType;
}

export default CategoryCardModel;
