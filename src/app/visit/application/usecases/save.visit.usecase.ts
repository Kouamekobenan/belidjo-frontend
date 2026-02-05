import { Visit } from "../../domain/entities/visit.entity";
import { IVisitRepository } from "../../domain/interfaces/visit.repository";
export class SaveVisitUseCase {
  constructor(private readonly visitRepo: IVisitRepository) {}
  async execute(vendorId: string): Promise<Visit> {
    return await this.visitRepo.save(vendorId);
  }
}
