import { instance } from "../utils/axios";
import  CartItem  from "../models/carItem.model";

export const CartItemService = {
  getById: async (id: number): Promise<CartItem> => {
    const res = await instance.get(`/cart-item/${id}`);
    return res.data;
  },

  deleteById: async (id: number): Promise<void> => {
    await instance.delete(`/cart-item/${id}`);
  },

  updateQuantityById: async (id: number, quantity: number): Promise<CartItem> => {
    const res = await instance.put(`/cart-item/${id}`, { quantity });
    return res.data;
  },

  // --- Endpoints por usuario ---
  addToCart: async (
    userId: number,
    productId: number,
    quantity: number = 1
  ): Promise<CartItem> => {
    const res = await instance.post(`/user/${userId}/cart`, {
      productId,
      quantity,
    });
    return res.data;
  },

  getCartByUser: async (userId: number): Promise<CartItem[]> => {
    const res = await instance.get(`/user/${userId}/cart`);
    return res.data;
  },

  updateQuantityUserProduct: async (
    userId: number,
    productId: number,
    quantity: number
  ): Promise<CartItem> => {
    const res = await instance.put(`/user/${userId}/cart/${productId}`, {
      quantity,
    });
    return res.data;
  },

  removeItemUserProduct: async (userId: number, productId: number): Promise<void> => {
    await instance.delete(`/user/${userId}/cart/${productId}`);
  },
};
