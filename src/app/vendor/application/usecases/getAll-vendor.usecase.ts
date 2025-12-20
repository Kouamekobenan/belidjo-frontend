import { IPaginatedResponse } from "@/app/lib/globals.type";
import { IVendorRepository } from "../../domain/interface/vendor-repository";
import { Vendor } from "../../domain/entities/vendor.entity";

export class GetAllVendorUseCase {
  constructor(private readonly vendorRepo: IVendorRepository) {}
  async execute(
    limit: number,
    page: number
  ): Promise<IPaginatedResponse<Vendor>> {
    try {
      const vendors = await this.vendorRepo.findAll(limit, page);
      return vendors;
    } catch (error) {
      throw new Error("Vendeur failled error API:");
    }
  }
}
