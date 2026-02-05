export class Visit {
  constructor(
    public readonly id: string,
    public readonly vendorId: string,
    public ip: string,
    public userAgent: string,
    public createdAt: Date,
  ) {}
}
