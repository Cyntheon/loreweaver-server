import {User} from "@generated/user";

export interface LoginCredentialsUsernamePassword {
  username: string;
  password: string;
}

export interface LoginCredentialsEmailPassword {
  email: string;
  password: string;
}

export interface JwtPayload {
  username: string;
  sub: string;
}

export interface AuthContext {
  user: User;
}
