import { api } from "@/app/lib/api";
import {
  RegisterDto,
  RegisterResponse,
} from "../application/dtos/registere.dto";
import { User } from "../domain/entities/user.entity";
import { IUserRepository } from "../domain/interfaces/user-repository.interface";
import { UserMapper } from "../domain/mappers/user.mapper";

export class UserRepository implements IUserRepository {
  constructor(public readonly mapper: UserMapper) {}
  async create(dto: RegisterDto): Promise<RegisterResponse> {
    const users = await api.post(`/auth/register`, dto);
    return {
      message: users.data.message,
      token: {
        accessToken: users.data.accessToken,
        refreshToken: users.data.refreshToken,
      },
    };
  }
}
