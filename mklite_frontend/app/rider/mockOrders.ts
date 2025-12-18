// ===============================
// Tipos SOLO PARA LA UI DEL RIDER
// ===============================

export type RiderOrderStatus =
  | "Disponible"
  | "En proceso"
  | "Entregado";

export interface RiderOrderItem {
  id: number;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface RiderUser {
  id: number;
  fullName: string;
  email: string;
  phone: string;
}

export interface RiderOrder {
  id: number;
  name: string;
  createdAt: string;

  status: RiderOrderStatus;
  paymentMethod: string;
  orderTotal: number;

  user: RiderUser;
  items: RiderOrderItem[];

  store: {
    name: string;
    location: {
      lat: number;
      lng: number;
      address1: string;
      address2?: string;
    };
  };

  customerLocation: {
    lat: number;
    lng: number;
    address1: string;
    address2?: string;
  };
}
