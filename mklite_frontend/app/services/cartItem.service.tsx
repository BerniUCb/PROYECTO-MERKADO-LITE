import { instance } from "../utils/axios";
import  CarritoItem  from "../models/carItem.model";

export const CartItemService = {
  getById: async (id: number): Promise<CarritoItem> => {
    const res = await instance.get(`/cart-item/${id}`);
    return res.data;
  },

  deleteById: async (id: number): Promise<void> => {
    await instance.delete(`/cart-item/${id}`);
  },

  updateQuantityById: async (id: number, cantidad: number): Promise<CarritoItem> => {
    const res = await instance.put(`/cart-item/${id}`, { cantidad });
    return res.data;
  },

  // --- Endpoints por usuario ---
  addToCart: async (
    userId: number,
    productId: number,
    cantidad: number = 1
  ): Promise<CarritoItem> => {
    const res = await instance.post(`/users/${userId}/cart`, {
      productId,
      cantidad,
    });
    return res.data;
  },

  getCartByUser: async (userId: number): Promise<CarritoItem[]> => {
    const res = await instance.get(`/users/${userId}/cart`);
    return res.data;
  },

  updateQuantityUserProduct: async (
    userId: number,
    productId: number,
    cantidad: number
  ): Promise<CarritoItem> => {
    const res = await instance.put(`/users/${userId}/cart/${productId}`, {
      cantidad,
    });
    return res.data;
  },

  removeItemUserProduct: async (userId: number, productId: number): Promise<void> => {
    await instance.delete(`/users/${userId}/cart/${productId}`);
  },
};
