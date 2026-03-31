import {
  RegisterDto,
  RegisterResponse,
} from "../../application/dtos/registere.dto";
import { UpdateUserDto } from "../../application/dtos/update-user.dto";
import { User } from "../entities/user.entity";

export interface IUserRepository {
  create(dto: RegisterDto): Promise<RegisterResponse>;
  updateRole(id: string): Promise<void>;
  findAll(): Promise<User[]>;
  update(id: string, dto: UpdateUserDto): Promise<User>;
}
