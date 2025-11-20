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
    const res = await instance.get("/user", { params });
    return res.data;
  },

  getById: async (id: number): Promise<User> => {
    const res = await instance.get(`/user/${id}`);
    return res.data;
  },

  create: async (user: Partial<User>): Promise<User> => {
    const res = await instance.post("/user", user);
    return res.data;
  },

  update: async (id: number, user: Partial<User>): Promise<User> => {
    const res = await instance.put(`/user/${id}`, user);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await instance.delete(`/user/${id}`);
  },
};
