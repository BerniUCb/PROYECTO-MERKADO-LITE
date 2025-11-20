import { IconType } from "react-icons";
import ProductModel from "./productCard.model";

interface CategoryCardModel {
   id: number;
  nombre: string;
  descripcion: string; 
  IconComponent?: IconType;
  products: ProductModel[];
}
