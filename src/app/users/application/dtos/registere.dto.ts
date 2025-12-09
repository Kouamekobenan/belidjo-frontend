import { UserRole } from "../../domain/enums/role.enum";

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  phone: string | null;
  role: UserRole;
  refreshToken: string | null;
  cityId: string | null;
 
}
