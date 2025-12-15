import Order from "../models/order.model";

export const mockOrders: Order[] = [
  {
    id: 1,
    name: "Pedido 1",
    createdAt: new Date().toISOString(),
    status: "shipped",
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
    },
    items: [
      { id: 101, name: "Leche PIL 1L", quantity: 2, unitPrice: 8, order: {} as any, product: {} as any },
      { id: 102, name: "Pan Bimbo", quantity: 1, unitPrice: 10, order: {} as any, product: {} as any },
      { id: 103, name: "Coca Cola 2L", quantity: 1, unitPrice: 14, order: {} as any, product: {} as any },
    ],
  },
];
