import { instance } from "../utils/axios";

export type StoreLocation = {
  name: string;
  lat: number;
  lng: number;
  address1: string;
  address2: string;
};

export const StoreService = {
  getLocation: async (): Promise<StoreLocation> => {
    const res = await instance.get("/store/location");
    return res.data;
  },
};
