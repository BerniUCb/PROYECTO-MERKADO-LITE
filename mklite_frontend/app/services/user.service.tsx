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

  // 👉 YA NO usamos Omit<User...> porque no permite enviar "password"
  create: async (user: {
    fullName: string;
    email: string;
    phone?: string;
    password: string;
    role: string;
    isActive?: boolean;
    isTwoFactorEnabled?: boolean;
    twoFactorSecret?: string;
  }): Promise<User> => {
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

  getUsersWithOrders: async (): Promise<User[]> => {
    const res = await instance.get("/users/with-orders");
    return res.data;
  },

  countOrdersByUser: async (userId: number): Promise<number> => {
    const res = await instance.get(`/users/${userId}/orders/count`);
    return res.data.totalOrders;
  }
};
