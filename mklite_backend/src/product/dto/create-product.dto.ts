export class CreateProductDto { 
  name!: string;
  description?: string;
  salePrice!: number;
  unitOfMeasure?: string;
  physicalStock?: number;
  reservedStock?: number;
  imageUrl?: string;
  isActive?: boolean;

  category_id?: number; // ← OPCIONAL al crear
}
