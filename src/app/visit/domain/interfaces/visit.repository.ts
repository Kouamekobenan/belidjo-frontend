import { Visit } from "../entities/visit.entity";
interface countResult {
  count: number;
}
export interface Result {
  today: countResult;
  thisWeek: countResult;
  allTime: countResult;
  updatedAt: Date;
}
export interface IVisitRepository {
  save(vendorId: string): Promise<Visit>;
  getVendorDashboardStats(vendorId: string): Promise<Result>;
}
