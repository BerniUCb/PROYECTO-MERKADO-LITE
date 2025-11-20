import { instance } from "../utils/axios";
import type Promotion from "../models/promotion.model";

export const getPromotions = async (): Promise<Promotion[]> => {
    const res = await instance.get("/promotion");
    return res.data;
};

export const getPromotionById = async (id: number): Promise<Promotion> => {
    const res = await instance.get(`/promotion/${id}`);
    return res.data;
};

export const createPromotion = async (
    promotion: Partial<Promotion>
): Promise<Promotion> => {
    const res = await instance.post("/promotion", promotion);
    return res.data;
};

export const updatePromotion = async (
    id: number,
    promotion: Partial<Promotion>
): Promise<Promotion> => {
    const res = await instance.put(`/promotion/${id}`, promotion);
    return res.data;
};

export const deletePromotion = async (id: number) => {
    const res = await instance.delete(`/promotion/${id}`);
    return res.data;
};
