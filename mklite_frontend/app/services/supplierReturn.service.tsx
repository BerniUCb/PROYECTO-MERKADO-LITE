import { instance } from "../utils/axios";
import type SupplierReturnModel from "../models/supplierReturn.model";

export const SupplierReturnService = {
  // Crear una devolución a proveedor
  // POST /supplier-return
  create: async (data: Omit<SupplierReturnModel, "id" | "createdAt" | "resolvedAt">): Promise<SupplierReturnModel> => {
    const res = await instance.post("/supplier-return", data);
    return res.data;
  },

  // Obtener todas las devoluciones
  // GET /supplier-return
  getAll: async (): Promise<SupplierReturnModel[]> => {
    const res = await instance.get("/supplier-return");
    return res.data;
  },

  // Obtener devolución por ID
  // GET /supplier-return/:id
  getById: async (id: number): Promise<SupplierReturnModel> => {
    const res = await instance.get(`/supplier-return/${id}`);
    return res.data;
  },

  // Eliminar devolución
  // DELETE /supplier-return/:id
  delete: async (id: number): Promise<void> => {
    // Nota: El controlador recibe 'id' como string, pero Axios lo maneja bien.
    // Convertimos a string explícitamente si es necesario, pero JS lo hace en la URL.
    await instance.delete(`/supplier-return/${id}`);
  },

  // Actualizar devolución
  // PUT /supplier-return/:id
  update: async (id: number, data: Partial<SupplierReturnModel>): Promise<SupplierReturnModel> => {
    const res = await instance.put(`/supplier-return/${id}`, data);
    return res.data;
  },

  // Filtrar devoluciones por rango de fecha
  // GET /supplier-return/filter?start=YYYY-MM-DD&end=YYYY-MM-DD
  getReturnsByDateRange: async (start: string, end: string): Promise<SupplierReturnModel[]> => {
    const res = await instance.get("/supplier-return/filter", {
      params: { start, end },
    });
    return res.data;
  },

  // Filtrar devoluciones por fecha específica (Asumo que devuelve algo similar al anterior o estadísticas)
  // GET /supplier-return/filter-by-date
  getByDate: async (): Promise<any> => {
    const res = await instance.get("/supplier-return/filter-by-date");
    return res.data;
  },
};