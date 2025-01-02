export type Role = "assistant" | "professor" | "admin";

export type User = {
  id: string;
  email: string;
  password: string | "";
  first_name: string;
  last_name: string;
  date_of_birth: string;
  roles: Role[];
  profile_pic: string;
  created_at: string;
};

export type JwtUser = {
    id: string;
    email: string;
    roles: Role[];
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtUser;
    }
  }
}
