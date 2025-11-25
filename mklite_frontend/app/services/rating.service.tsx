import { instance } from "../utils/axios";
import Rating from "../models/rating.model";

export const RatingService = {
  // POST /rating
  create: async (data: Omit<Rating, "id">): Promise<Rating> => {
    const res = await instance.post("/rating", data);
    return res.data;
  },

  // GET /rating (con paginación y ordenamiento)
  getAll: async (
    page?: number,
    limit?: number,
    sort?: string,
    order?: "asc" | "desc"
  ): Promise<Rating[]> => {
    const params = { page, limit, sort, order };
    const res = await instance.get("/rating", { params });
    return res.data;
  },

  // GET /rating/:id
  getById: async (id: number): Promise<Rating> => {
    const res = await instance.get(`/rating/${id}`);
    return res.data;
  },

  // PATCH /rating/:id
  update: async (id: number, data: Partial<Rating>): Promise<Rating> => {
    const res = await instance.patch(`/rating/${id}`, data);
    return res.data;
  },

  // DELETE /rating/:id
  delete: async (id: number): Promise<void> => {
    await instance.delete(`/rating/${id}`);
  },
};