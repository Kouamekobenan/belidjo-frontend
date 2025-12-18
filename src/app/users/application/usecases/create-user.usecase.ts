import { User } from "../../domain/entities/user.entity";
import { IUserRepository } from "../../domain/interfaces/user-repository.interface";
import { RegisterDto, RegisterResponse } from "../dtos/registere.dto";

export class CreateUserUseCase {
  constructor(private readonly userRepo: IUserRepository) {}
  async execute(dto: RegisterDto): Promise<RegisterResponse> {
    const users = await this.userRepo.create(dto);
    return users;
  }
}
