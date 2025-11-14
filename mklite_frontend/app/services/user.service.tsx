import { instance } from "../utils/axios";
import User  from "../models/user.model";

export const UserService = {
  getAll: async (
    page?: number,
    limit?: number,
    sort?: string,
    order?: "asc" | "desc"
  ): Promise<User[]> => {
    const params = { page, limit, sort, order };
    const res = await instance.get("/usuarios", { params });
    return res.data;
  },

  getById: async (id: number): Promise<User> => {
    const res = await instance.get(`/usuarios/${id}`);
    return res.data;
  },

  create: async (user: Partial<User>): Promise<User> => {
    const res = await instance.post("/usuarios", user);
    return res.data;
  },

  update: async (id: number, user: Partial<User>): Promise<User> => {
    const res = await instance.put(`/usuarios/${id}`, user);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await instance.delete(`/usuarios/${id}`);
  },
};
