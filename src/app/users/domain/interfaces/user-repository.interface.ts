import { RegisterDto, RegisterResponse } from "../../application/dtos/registere.dto";
import { User } from "../entities/user.entity";

export interface IUserRepository {
  create(dto: RegisterDto): Promise<RegisterResponse>;
}
