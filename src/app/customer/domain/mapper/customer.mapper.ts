import { Customer } from "../entities/customer.entity";

export class CustomerMapper {
  toEntity(model: Customer): Customer {
    return new Customer(model.id, model.userId, model.vendorId, model.user);
  }
}
