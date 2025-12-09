export class Category {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string,
    public imageUrl: string,
    public fileId: string,
    public vendorId: string,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
