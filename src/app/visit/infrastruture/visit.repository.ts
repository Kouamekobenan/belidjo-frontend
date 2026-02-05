import { api } from "@/app/lib/api";
import { Visit } from "../domain/entities/visit.entity";
import {
  IVisitRepository,
  Result,
} from "../domain/interfaces/visit.repository";
export class VisitRepository implements IVisitRepository {
  async save(vendorId: string): Promise<Visit> {
    const url = "/visits";
    const visit = await api.post(url, { vendorId });
    return visit.data;
  }
  async getVendorDashboardStats(vendorId: string): Promise<Result> {
    const url = `/visits/stats/dashboard/${vendorId}`;
    const result = await api.get(url);
    return result.data;
  }
}
