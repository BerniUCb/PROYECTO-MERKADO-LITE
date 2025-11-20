import { IconType } from "react-icons";
import ProductModel from "./productCard.model";

export default interface CategoryModel {
  id: number;
  name: string;
  description?: string;
  IconComponent?: IconType;
  products: ProductModel[];
}
