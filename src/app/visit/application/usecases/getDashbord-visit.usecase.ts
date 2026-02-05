import {
  IVisitRepository,
  Result,
} from "../../domain/interfaces/visit.repository";

export class GetVendorDashboardStatsUseCase {
  constructor(private readonly visitRepo: IVisitRepository) {}
  async execute(vendorId: string): Promise<Result> {
    return await this.visitRepo.getVendorDashboardStats(vendorId);
  }
}
