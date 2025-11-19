import CategoryModel from "./categoryCard.model";

export default interface ProductModel {
  id: number;
  name: string;
  description?: string;
  salePrice: number;
  unitOfMeasure: string;
  physicalStock: number;
  reservedStock: number;
  imageUrl?: string;
  isActive: boolean;
  discount?: number;

  category: CategoryModel;
}
