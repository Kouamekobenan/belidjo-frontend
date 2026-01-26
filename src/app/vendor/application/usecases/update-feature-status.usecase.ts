import { IVendorRepository } from "../../domain/interface/vendor-repository";

export class UpdateFeatureStatusUsecase {
  constructor(private readonly vendorRepository: IVendorRepository) {}
  async execute(id: string, status: boolean): Promise<void> {
    await this.vendorRepository.updateStatus(id, status);
  }
}
