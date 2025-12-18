import { IVendorRepository } from "../../domain/interface/vendor-repository";
import { UpdateDto } from "../dtos/update-site-dto";

export class UpdateSiteUseCase {
  constructor(private readonly vendorRepository: IVendorRepository) {}
  async execute(id: string, update: UpdateDto, file?: File | null) {
    await this.vendorRepository.update(id, update, file);
  }
}
