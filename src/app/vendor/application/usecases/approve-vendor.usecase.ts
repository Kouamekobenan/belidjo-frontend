import { IVendorRepository } from "../../domain/interface/vendor-repository";

export class ApproveVendorUseCase {
  constructor(private readonly vendorRepo: IVendorRepository) {}
  async execute(vendorId: string): Promise<void> {
    try {
      await this.vendorRepo.approved(vendorId);
    } catch (error) {
      throw new Error("Erreur provenant du backend");
    }
  }
}
