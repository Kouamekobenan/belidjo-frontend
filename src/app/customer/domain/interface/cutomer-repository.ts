import { IPaginatedResponse } from "@/app/lib/globals.type";
import { CreateCustomerDto } from "../../application/dtos/create-customer.dto";
import { Customer } from "../entities/customer.entity";

export interface ICustomerRepository {
  create(dto: CreateCustomerDto): Promise<Customer>;
  findAll(
    vendorId: string,
    limit: number,
    page: number
  ): Promise<IPaginatedResponse<Customer>>;
}