import { Customer } from "../../domain/entities/customer.entity";
import { ICustomerRepository } from "../../domain/interface/cutomer-repository";
import { CreateCustomerDto } from "../dtos/create-customer.dto";

export class CreateCustomerUseCase {
  constructor(private readonly customerRepo: ICustomerRepository) {}
  async execute(dto: CreateCustomerDto): Promise<Customer> {
    try {
      return await this.customerRepo.create(dto);
    } catch (error) {
      throw new Error("Erreur venant du backend");
    }
  }
}
