import { IUserRepository } from "../../domain/interfaces/user-repository.interface";

export class FindAllUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}
  async execute() {
    return await this.userRepository.findAll();
  }
}
