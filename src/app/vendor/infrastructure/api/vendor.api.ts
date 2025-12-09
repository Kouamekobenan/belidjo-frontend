// infrastructure/api/vendor.api.ts
import { api } from "@/app/lib/api";

export const VendorApi = {
  async getAll() {
    const res = await api.get("/vendor/paginate");
    // console.log("vendor data:", res.data.data);
    return res.data.data;
  },

  async create(payload: any) {
    const res = await api.post("/vendor", payload);
    return res.data;
  },

  async update(id: string, payload: any) {
    const res = await api.put(`vendor/${id}`, payload);
    return res.data;
  },

  async delete(id: string) {
    const res = await api.delete(`vendor/${id}`);
    return res.data;
  },
};
