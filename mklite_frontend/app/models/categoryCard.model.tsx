import { IconType } from 'react-icons';

interface CategoryCardModel {
   id: number;
  nombre: string;
  descripcion: string; 
  IconComponent?: IconType;
}

export default CategoryCardModel;
