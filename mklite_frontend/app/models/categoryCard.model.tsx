import { IconType } from "react-icons";
import ProductModel from "./productCard.model";

interface CategoryCardModel {
   id: number;
  name: string;
  description: string; 
  IconComponent?: IconType;
  products: ProductModel[];
}

export default CategoryCardModel;
