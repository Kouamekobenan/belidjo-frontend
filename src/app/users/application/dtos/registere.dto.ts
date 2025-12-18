import { UserRole } from "../../domain/enums/role.enum";

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  phone: string | null;
  role: UserRole;
  cityId: string | null;
 
}

export interface RegisterResponse {
  message: string;
  token: {
    accessToken: string;
    refreshToken: string;
  };
}
