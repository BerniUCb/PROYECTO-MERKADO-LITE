import { instance } from "@/app/utils/axios";
//import { instance } from "../utils/axios";
import Order from "../models/order.model";
import type { CreateOrderDto } from "./dto/create-order.dto";

export interface PaginatedOrders {
  data: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const OrderService = {
  // --- REPORTES ---
  getTotalSales: async () => {
    const res = await instance.get("/orders/report/total-sales");
    return res.data;
  },

  getPendingOrderCount: async () => {
    const res = await instance.get("/orders/report/pending-count");
    return res.data;
  },

  getTotalOrdersCount: async (): Promise<number> => {
    const res = await instance.get("/orders/report/total-count");
    return res.data.totalOrders;
  },

  getCancelledOrderCount: async (): Promise<number> => {
    const res = await instance.get("/orders/report/cancelled-count");
    return res.data.cancelledOrders;
  },

  getWeeklySales: async () => {
    const res = await instance.get("/orders/report/weekly-sales");
    return res.data;
  },

  getLatestOrders: async (): Promise<Order[]> => {
    const res = await instance.get("/orders/report/latest");
    return res.data;
  },

  getLast7DaysSales: async (): Promise<number[]> => {
    const res = await instance.get("/orders/stats/last-7-days");
    return res.data;
  },

  // --- CRUD ---
  create: async (data: CreateOrderDto): Promise<Order> => {
    const res = await instance.post("/orders", data);
    return res.data;
  },

  getById: async (id: number): Promise<Order> => {
    const res = await instance.get(`/orders/${id}`);
    return res.data;
  },

  // 🔥 ESTE ES EL IMPORTANTE
  getByUser: async (
    userId: number,
    page: number = 1,
    limit: number = 5
  ): Promise<PaginatedOrders> => {
    const params = { page, limit };
    const res = await instance.get(`/orders/by-user/${userId}`, { params });
    return res.data;
  },

  update: async (id: number, data: Partial<Order>): Promise<Order> => {
    const res = await instance.patch(`/orders/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await instance.delete(`/orders/${id}`);
  },
<<<<<<< HEAD

  // --- RIDER (sin endpoints nuevos) ---
  getAvailableForRider: async (): Promise<Order[]> => {
    // Reutiliza /orders
    const res = await instance.get("/orders");
    const orders = res.data as Order[];

    // Disponibles = shipped (ajusta si tu backend usa otro estado)
    return orders.filter((o) => o.status === "shipped");
  },

  // Aceptar (sin endpoint): opción A) solo navegar, opción B) marcar status
  acceptForRider: async (orderId: number, markAsProcessing: boolean): Promise<Order> => {
    if (markAsProcessing) {
      // OJO: esto depende de si tu backend permite PATCH status
      const res = await instance.patch(`/orders/${orderId}`, { status: "processing" });
      return res.data;
    }

    // Si no marcamos nada, al menos devolvemos el pedido actual
    const res = await instance.get(`/orders/${orderId}`);
    return res.data;
  },

};


=======
};
>>>>>>> origin/main
