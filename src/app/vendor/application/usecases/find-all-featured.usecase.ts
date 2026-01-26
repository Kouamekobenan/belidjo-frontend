import { IVendorRepository } from "../../domain/interface/vendor-repository";

export class FindAllFeaturedUseCase {
  constructor(private readonly vendorRepository: IVendorRepository) {}
  async execute() {
    return await this.vendorRepository.findFeatured();
  }
}                
  