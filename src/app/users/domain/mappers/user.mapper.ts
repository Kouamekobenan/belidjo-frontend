import { User } from "../entities/user.entity";

export class UserMapper {
  toEntity(model: User): User {
    return new User(
      model.id,
      model.name,
      model.email,
      model.password,
      model.phone,
      model.role,
      model.refreshToken,
      model.cityId,
      model.createdAt,
      model.updatedAt,
      model.cityName
    );
  }
}
