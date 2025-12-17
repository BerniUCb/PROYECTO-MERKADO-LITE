import Order from "../models/order.model";

/**
 * Tipos auxiliares SOLO para el Rider (frontend)
 */
export type GeoLocation = {
  lat: number;
  lng: number;
  address1: string;
  address2?: string;
};

export type RiderOrder = Order & {
  store: {
    name: string;
    location: GeoLocation;
  };
  customerLocation: GeoLocation;
};

export const mockOrders: RiderOrder[] = [
  {
    id: 1,
    name: "Pedido 1",
    createdAt: new Date().toISOString(),

    // ✅ Estado correcto para Rider
    status: "Disponible" as any,

    orderTotal: 85.5,
    paymentMethod: "Cash on delivery",

    user: {
      id: 10,
      fullName: "Carlos Pérez",
      email: "carlos@gmail.com",
      phone: "70000000",
      passwordHash: "",
      role: "Client",
      isActive: true,
      isTwoFactorEnabled: false,
      twoFactorSecret: "",
      orders: [],
      assignedShipments: [],
      cartItems: [],
      ratings: [],
      stockMovements: [],
      notifications: [],
      addresses: [],
    } as any,

    items: [
      {
        id: 101,
        name: "Leche PIL 1L",
        quantity: 2,
        unitPrice: 8,
        order: {} as any,
        product: {} as any,
      },
      {
        id: 102,
        name: "Pan Bimbo",
        quantity: 1,
        unitPrice: 10,
        order: {} as any,
        product: {} as any,
      },
      {
        id: 103,
        name: "Coca Cola 2L",
        quantity: 1,
        unitPrice: 14,
        order: {} as any,
        product: {} as any,
      },
    ],

    // 🗺️ NUEVO: datos para mapa / ruta
    store: {
      name: "MERKADO LITE",
      location: {
        lat: -17.3895,
        lng: -66.1568,
        address1: "Julio Mendez, Cercado",
        address2: "Cochabamba, Bolivia",
      },
    },

    customerLocation: {
      lat: -17.3932,
      lng: -66.1621,
      address1: "Av. América #456",
      address2: "Cercado, Cochabamba, Bolivia",
    },
  },
];
