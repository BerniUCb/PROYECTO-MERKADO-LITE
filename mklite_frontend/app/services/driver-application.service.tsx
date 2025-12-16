import { instance } from "../utils/axios";
import DriverApplication from "../models/driverApplication.model";
import type { CreateDriverApplicationDto } from "./dto/create-driver-application.dto";

export const DriverApplicationService = {
  // =====================
  // CREAR POSTULACIÓN (Usuario postula como conductor)
  // =====================
  create: async (
    data: CreateDriverApplicationDto
  ): Promise<DriverApplication> => {
    const res = await instance.post("/driver-applications", data);
    return res.data;
  },

  // =====================
  // LEER POSTULACIONES (Obtener las postulaciones del usuario)
  // =====================
  getAll: async (): Promise<DriverApplication[]> => {
    const res = await instance.get("/driver-applications");
    return res.data;
  },

  getById: async (id: number): Promise<DriverApplication> => {
    const res = await instance.get(`/driver-applications/${id}`);
    return res.data;
  },
};
