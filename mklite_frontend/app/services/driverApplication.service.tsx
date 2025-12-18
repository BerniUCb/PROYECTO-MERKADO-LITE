import { instance } from "../utils/axios";
import DriverApplicationModel, {
  DriverApplicationStatus,
} from "../models/driverApplication.model";

export const DriverApplicationService = {
  // Obtener todas las solicitudes
  getAll: async (): Promise<DriverApplicationModel[]> => {
    const res = await instance.get("/driver-applications");
    return res.data;
  },

  // Obtener una solicitud por ID
  getById: async (id: number): Promise<DriverApplicationModel> => {
    const res = await instance.get(`/driver-applications/${id}`);
    return res.data;
  },

  // Crear solicitud (si lo necesitas)
  create: async (
    data: Omit<DriverApplicationModel, "id" | "status" | "createdAt">
  ): Promise<DriverApplicationModel> => {
    const res = await instance.post("/driver-applications", data);
    return res.data;
  },

  // Aprobar / Rechazar solicitud
  updateStatus: async (
    id: number,
    status: DriverApplicationStatus
  ): Promise<DriverApplicationModel> => {
    const res = await instance.put(`/driver-applications/${id}/status`, {
      status,
    });
    return res.data;
  },

  // Eliminar solicitud
  delete: async (id: number): Promise<void> => {
    await instance.delete(`/driver-applications/${id}`);
  },
};
