import { Vendor } from "../entities/vendor.entity";

export class VendorMapper {
  toEntity(model: Vendor): Vendor {
    return new Vendor(
      model.id,
      model.name,
      model.userId,
      model.cityId,
      model.isApproved,
      model.approvedById,
      model.approvedAt,
      model.user,
      model.site,
      model.city
    );
  }
}
