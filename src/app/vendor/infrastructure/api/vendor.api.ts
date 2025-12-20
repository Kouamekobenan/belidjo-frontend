// infrastructure/api/vendor.api.ts
import { api } from "@/app/lib/api";
import { IVendorRepository } from "../../domain/interface/vendor-repository";
import { VendorMapper } from "../../domain/mappers/vendor.mapper";
import { IPaginatedResponse } from "@/app/lib/globals.type";
import { Vendor } from "../../domain/entities/vendor.entity";
import { UpdateDto } from "../../application/dtos/update-site-dto";

export const VendorApi = {
  async getAll() {
    const res = await api.get("/vendor/paginate");
    // console.log("vendor data:", res.data.data);
    return res.data.data;
  },
};

export class VendorRepository implements IVendorRepository {
  // constructor(private readonly mapper: VendorMapper) {}
  async getAll(
    limit: number,
    page: number
  ): Promise<IPaginatedResponse<Vendor>> {
    const response = await api.get(`/vendor/paginate`, {
      params: { limit, page },
    });
    return {
      data: response.data.data,
      total: response.data.total,
      totalPages: response.data.totalPages,
      limit: response.data.limit,
      page: response.data.page,
    };
  }
  async approved(vendorId: string): Promise<void> {
    const url = `/vendor/approve/${vendorId}`;
    await api.patch(url);
  }
  async update(
    id: string,
    update: UpdateDto,
    file?: File | null
  ): Promise<void> {
    const url = `/vendor/site/${id}`;
    let response;
    if (file) {
      const formData = new FormData();
      formData.append("imageUrl", file);
      formData.append("description", update.description);
      response = await api.patch(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      response = await api.patch(url, update);
    }
  }

  async findAll(
    limit: number,
    page: number
  ): Promise<IPaginatedResponse<Vendor>> {
    const response = await api.get(`/vendor`, {
      params: { limit, page },
    });
    return {
      data: response.data.data,
      total: response.data.total,
      totalPages: response.data.totalPages,
      limit: response.data.limit,
      page: response.data.page,
    };
  }
}
