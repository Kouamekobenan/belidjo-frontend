import { RegisterDto, RegisterResponse } from "../../application/dtos/registere.dto";

export interface IUserRepository {
  create(dto: RegisterDto): Promise<RegisterResponse>;
  updateRole(id: string): Promise<void>;
}
