import { IPaginatedResponse } from "@/app/lib/globals.type";
import { Customer } from "../../domain/entities/customer.entity";
import { ICustomerRepository } from "../../domain/interface/cutomer-repository";
export class FindAllCustomerUseCase {
  constructor(private readonly customerRepo: ICustomerRepository) {}
  async execute(
    vendorId: string,
    limit: number,
    page: number
  ): Promise<IPaginatedResponse<Customer[]>> {
    try {
      return await this.customerRepo.findAll(vendorId, limit, page);
    } catch (error) {
      throw new Error("Erreur");
    }
  }
}
