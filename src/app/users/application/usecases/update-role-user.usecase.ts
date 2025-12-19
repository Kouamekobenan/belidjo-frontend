import { IUserRepository } from "../../domain/interfaces/user-repository.interface";

export class UpdateRoleUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}
  async execute(id: string): Promise<void> {
    await this.userRepository.updateRole(id);
    // return true;
  }
}
