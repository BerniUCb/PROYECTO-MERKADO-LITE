export interface CreateOrderDto {
  user_id: number;
  paymentMethod: string;
  status?: string;
  deliveryAddressId?: number; // Opcional: si se proporciona, se crea el Shipment automáticamente
  items: {
    productId: number;
    quantity: number;
  }[];
}
