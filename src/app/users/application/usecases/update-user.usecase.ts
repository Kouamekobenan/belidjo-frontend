import { User } from "../../domain/entities/user.entity";
import { IUserRepository } from "../../domain/interfaces/user-repository.interface";
import { UpdateUserDto } from "../dtos/update-user.dto";

export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}
  async execute(id: string, dto: UpdateUserDto): Promise<User> {
    return await this.userRepository.update(id, dto);
  }
}
