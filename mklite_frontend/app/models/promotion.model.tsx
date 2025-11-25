import ProductModel from "./productCard.model";

export default interface Promotion {
  id: number;
  description: string;
  discountType?: string;
  discountValue?: number;
  startsAt?: string;
  endsAt?: string;

  product?: ProductModel;
}
