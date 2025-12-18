import { IPaginatedResponse } from "@/app/lib/globals.type";
import { Vendor } from "../entities/vendor.entity";
import { UpdateDto } from "../../application/dtos/update-site-dto";

export interface IVendorRepository {
  getAll(limit: number, page: number): Promise<IPaginatedResponse<Vendor>>;
  approved(vendorId: string): Promise<void>;
  update(id: string, update: UpdateDto, file?: File | null): Promise<void>;
}
