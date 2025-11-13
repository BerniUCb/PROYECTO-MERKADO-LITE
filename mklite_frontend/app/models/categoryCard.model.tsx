import { IconType } from 'react-icons';

interface CategoryCardModel {
  id: number;
  name: string;
  description?: string;
  IconComponent: IconType;
}

export default CategoryCardModel;
