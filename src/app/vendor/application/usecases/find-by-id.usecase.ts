import { IVendorRepository } from "../../domain/interface/vendor-repository";

export class FindByIDVendorUseCase {
  constructor(private readonly vendorRepo: IVendorRepository) {}
  async execute(vendorId: string) {
    return await this.vendorRepo.findById(vendorId);
  }
}
