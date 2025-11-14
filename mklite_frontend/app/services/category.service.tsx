import { instance } from "../utils/axios";
import CategoryCardModel from "../models/categoryCard.model";

export const CategoryService = {
  create: async (category: CategoryCardModel): Promise<CategoryCardModel> => {
    const res = await instance.post("/category", category);
    return res.data;
  },

  getAll: async (): Promise<CategoryCardModel[]> => {
    const res = await instance.get("/category");
    return res.data;
  },

  getById: async (id: number): Promise<CategoryCardModel> => {
    const res = await instance.get(`/category/${id}`);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await instance.delete(`/category/${id}`);
  },

  update: async (id: number, category: CategoryCardModel): Promise<CategoryCardModel> => {
    const res = await instance.put(`/category/${id}`, category);
    return res.data;
  },
};
