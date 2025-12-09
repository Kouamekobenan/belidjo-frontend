import { UserRole } from "../enums/role.enum";

export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public password: string,
    public phone: string | null,
    public role: UserRole,
    public refreshToken: string | null,
    public cityId: string | null,
    public createdAt: Date,
    public updatedAt: Date,
    public cityName?: string
  ) {}
}
