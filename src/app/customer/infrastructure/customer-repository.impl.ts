import { api } from "@/app/lib/api";
import { CreateCustomerDto } from "../application/dtos/create-customer.dto";
import { Customer } from "../domain/entities/customer.entity";
import { ICustomerRepository } from "../domain/interface/cutomer-repository";
import { CustomerMapper } from "../domain/mapper/customer.mapper";
import { IPaginatedResponse } from "@/app/lib/globals.type";

export class CustomerRepository implements ICustomerRepository {
  constructor(private readonly mapper: CustomerMapper) {}
  async create(dto: CreateCustomerDto): Promise<Customer> {
    const url = "/customer";
    const response = await api.post(url, dto);
    return response.data.data;
  }
  async findAll(
    vendorId: string,
    limit: number,
    page: number
  ): Promise<IPaginatedResponse<Customer[]>> {
    const url = `/customer/vendor/${vendorId}`;
    const response = await api.get(url, {
      params: {
        limit,
        page,
      },
    });
    return {
      data: response.data.data || response.data,
      total: response.data.total,
      totalPages: response.data.totalPages,
      limit: response.data.limit,
      page: response.data.page,
    };
  }
}
