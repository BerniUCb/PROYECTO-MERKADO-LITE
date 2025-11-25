import { instance } from "../utils/axios";
import CartItem from "../models/carItem.model"; 

export const CartItemService = {
  // --- Endpoints Clásicos (por ID del item) ---

  // GET cart-item/:id
  getById: async (id: number): Promise<CartItem> => {
    const res = await instance.get(`/cart-item/${id}`);
    return res.data;
  },

  // DELETE cart-item/:id
  deleteById: async (id: number): Promise<void> => {
    await instance.delete(`/cart-item/${id}`);
  },

  // PUT cart-item/:id (Solo actualiza cantidad)
  updateQuantityById: async (id: number, quantity: number): Promise<CartItem> => {
    const res = await instance.put(`/cart-item/${id}`, { quantity });
    return res.data;
  },

  // --- Endpoints por Usuario (User Context) ---

  // POST users/:userId/cart
  addToCart: async (
    userId: number,
    productId: number,
    quantity: number = 1
  ): Promise<CartItem> => {
    const res = await instance.post(`/users/${userId}/cart`, {
      productId,
      quantity,
    });
    return res.data;
  },

  // GET users/:userId/cart
  getCartByUser: async (userId: number): Promise<CartItem[]> => {
    const res = await instance.get(`/users/${userId}/cart`);
    return res.data;
  },

  // PUT users/:userId/cart/:productId
  updateQuantityUserProduct: async (
    userId: number,
    productId: number,
    quantity: number
  ): Promise<CartItem> => {
    const res = await instance.put(`/users/${userId}/cart/${productId}`, {
      quantity,
    });
    return res.data;
  },

  // DELETE users/:userId/cart/:productId
  removeItemUserProduct: async (userId: number, productId: number): Promise<void> => {
    await instance.delete(`/users/${userId}/cart/${productId}`);
  },
};