import { instance } from "../utils/axios";
import type Promocion from "../models/promotion.model";

export const getPromotions = async (): Promise<Promocion[]> => {
    const res = await instance.get("/promotion");
    return res.data;
};

export const getPromotionById = async (id: number): Promise<Promocion> => {
    const res = await instance.get(`/promotion/${id}`);
    return res.data;
};

export const createPromotion = async (
    promotion: Partial<Promocion>
): Promise<Promocion> => {
    const res = await instance.post("/promotion", promotion);
    return res.data;
};

export const updatePromotion = async (
    id: number,
    promotion: Partial<Promocion>
): Promise<Promocion> => {
    const res = await instance.put(`/promotion/${id}`, promotion);
    return res.data;
};

export const deletePromotion = async (id: number) => {
    const res = await instance.delete(`/promotion/${id}`);
    return res.data;
};
