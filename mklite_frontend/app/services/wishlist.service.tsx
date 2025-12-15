import { instance } from "../utils/axios";
import type WishlistItem from "../models/wishlist.model";

export const WishlistService = {
  // Obtener toda la lista de deseos del usuario
  getByUser: async (userId: number): Promise<WishlistItem[]> => {
    try {
      const res = await instance.get(`/user/${userId}/wishlist`);
      return res.data;
    } catch (error: any) {
      // SOLUCIÓN: Si el backend dice 404 (No encontrado), asumimos que la lista está vacía.
      if (error.response && error.response.status === 404) {
        return []; 
      }
      // Si es otro error (500, red, etc), lo lanzamos para que la página lo maneje
      throw error;
    }
  },

  // Verificar si un producto específico está en la lista (para pintar el corazón)
  checkProduct: async (userId: number, productId: number): Promise<WishlistItem | null> => {
    try {
      const res = await instance.get(`/user/${userId}/wishlist/product/${productId}`);
      return res.data; 
    } catch (error: any) {
      // Aquí también: Si da 404, significa que NO está en favoritos, retornamos null
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Agregar a favoritos
  add: async (userId: number, productId: number): Promise<WishlistItem> => {
    const res = await instance.post(`/user/${userId}/wishlist`, { productId });
    return res.data;
  },

  // Eliminar de favoritos (usando el ID del item de la wishlist)
  remove: async (id: number): Promise<void> => {
    await instance.delete(`/wishlist/${id}`);
  },
  
  // Alternativa: Eliminar por producto y usuario si no tienes el ID del wishlist a mano
  removeByProduct: async (userId: number, productId: number): Promise<void> => {
    await instance.delete(`/user/${userId}/wishlist/product/${productId}`);
  }
};