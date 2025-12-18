// application/usecases/get-vendors.usecase.ts
import { VendorApi } from "../../infrastructure/api/vendor.api";
import { Vendor } from "../../domain/entities/vendor.entity";
export async function getVendorsUseCase(): Promise<Vendor[]> {
  const vendors = await VendorApi.getAll();
  return vendors.map(
    (v: any) =>
      new Vendor(
        v.id,
        v.name,
        v.userId,
        v.cityId,
        v.isApproved,
        v.approvedById,
        v.approvedAt,
        v.user,
        v.site,
        v.city
      )
  );
}
