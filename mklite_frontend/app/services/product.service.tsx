import { instance } from "../utils/axios";
import type ProductModel from "../models/productCard.model";

export const getProducts = async (): Promise<ProductModel[]> => {
    const res = await instance.get("/product");
    return res.data;
};

export const getProductById = async (id: number): Promise<ProductModel> => {
    const res = await instance.get(`/product/${id}`);
    return res.data;
};

export const createProduct = async (
    product: Partial<ProductModel>
): Promise<ProductModel> => {
    const res = await instance.post("/product", product);
    return res.data;
};

export const updateProduct = async (
    id: number,
    product: Partial<ProductModel>
): Promise<ProductModel> => {
    const res = await instance.put(`/product/${id}`, product);
    return res.data;
};

export const deleteProduct = async (id: number) => {
    const res = await instance.delete(`/product/${id}`);
    return res.data;
};

