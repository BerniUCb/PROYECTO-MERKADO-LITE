import { instance } from "../utils/axios";
import type ProductModel from "../models/productCard.model";

export const ProductService = {
  getAll: async (): Promise<ProductModel[]> => {
    const res = await instance.get("/product");
    return res.data;
  },

  getById: async (id: number): Promise<ProductModel> => {
    const res = await instance.get(`/product/${id}`);
    return res.data;
  },

  getTopSelling: async (): Promise<ProductModel[]> => {
    const res = await instance.get("/product/top-selling");
    return res.data;
  },

  create: async (product: Partial<ProductModel>): Promise<ProductModel> => {
    const res = await instance.post("/product", product);
    return res.data;
  },

  update: async (id: number, product: Partial<ProductModel>): Promise<ProductModel> => {
    const res = await instance.put(`/product/${id}`, product);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await instance.delete(`/product/${id}`);
  },

  getTotalProductsCount: async (): Promise<number> => {
    const res = await instance.get("/product/count");
    return res.data.totalProducts;
  },

  // Reporte: Productos en Stock
  getInStockCount: async (): Promise<number> => {
    const res = await instance.get("/product/count/in-stock");
    return res.data.inStock;
  },

  // Reporte: Productos Fuera de Stock
  getOutOfStockCount: async (): Promise<number> => {
    const res = await instance.get("/product/count/out-of-stock");
    return res.data.outOfStock;
  },
  getByCategory: async (categoryId: number): Promise<ProductModel[]> => {
    const res = await instance.get(`/product/category/${categoryId}`);
    return res.data;
  },
};
