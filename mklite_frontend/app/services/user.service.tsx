import { instance } from "../utils/axios";
import User from "../models/user.model";

export const UserService = {
  getAll: async (
    page?: number,
    limit?: number,
    sort?: string,
    order?: "asc" | "desc"
  ): Promise<User[]> => {
    const params = { page, limit, sort, order };
    const res = await instance.get("/users", { params });
    return res.data;
  },

  getById: async (id: number): Promise<User> => {
    const res = await instance.get(`/users/${id}`);
    return res.data;
  },

  // Omitimos relaciones complejas al crear
  create: async (user: Omit<User, "id" | "orders" | "cartItems" | "notifications" | "addresses" | "stockMovements" | "ratings" | "assignedShipments">): Promise<User> => {
    const res = await instance.post("/users", user);
    return res.data;
  },

  update: async (id: number, user: Partial<User>): Promise<User> => {
    const res = await instance.put(`/users/${id}`, user);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await instance.delete(`/users/${id}`);
  },

  getRegisteredClientsCount: async (): Promise<number> => {
    const res = await instance.get("/users/totalUsers"); 
    return res.data.totalUsers;
  },
// NUEVO: GET /users/with-orders (Endpoint útil para listar clientes)
  getUsersWithOrders: async (): Promise<User[]> => {
    const res = await instance.get("/users/with-orders");
    return res.data;
  },
  
  // NUEVO: GET /users/:id/orders/count
  countOrdersByUser: async (userId: number): Promise<number> => {
    const res = await instance.get(`/users/${userId}/orders/count`);
    // Extraemos la propiedad: { totalOrders: 10 }
    return res.data.totalOrders;
  }

};