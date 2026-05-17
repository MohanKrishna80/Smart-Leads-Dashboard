import type { UserRole } from "./domain.js";

declare global {
  namespace Express {
    interface User {
      id: string;
      name: string;
      email: string;
      role: UserRole;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};
