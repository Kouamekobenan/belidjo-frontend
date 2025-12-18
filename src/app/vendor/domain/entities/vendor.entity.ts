export class Vendor {
  constructor(
    public readonly id: string,
    public name: string,
    public readonly userId: string,
    public readonly cityId: string,
    public isApproved: boolean,
    public approvedById: string,
    public approvedAt: Date,
    public readonly user: {
      id: string;
      name: string;
      email: string;
      phone: string;
      cityName: string;
    },
    public readonly site: {
      id: string;
      domain: string;
      description: string;
      logoUrl: string;
      isActive: boolean;
    },
    public readonly city: {
      id: string;
      name: string;
      country: string;
    }
  ) {}
}
