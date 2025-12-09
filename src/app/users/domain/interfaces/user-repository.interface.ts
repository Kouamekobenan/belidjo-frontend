import { RegisterDto } from "../../application/dtos/registere.dto";
import { User } from "../entities/user.entity";

export interface IUserRepository {
  create(dto: RegisterDto): Promise<User>;
}
