import { IconType } from 'react-icons';

interface CategoryCardModel {
    id: number;
  name: string;
  slug: string;        // <-- SLUG CORRECTO
  IconComponent: IconType;
}

export default CategoryCardModel;
