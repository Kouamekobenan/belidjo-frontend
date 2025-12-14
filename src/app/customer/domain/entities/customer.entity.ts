import { User } from "@/app/users/domain/entities/user.entity";

export class Customer {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly vendorId: string,
    public readonly user?:User
  ) {}
}
