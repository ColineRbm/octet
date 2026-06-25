import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password_hash: string;
  role: "admin" | "benevole";
  is_active: boolean;
}

class AuthRepository {
  // Find a user by email (used during login)
  async findByEmail(email: string) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM user WHERE email = ?",
      [email],
    );

    return rows[0] as User | undefined;
  }
}

export default new AuthRepository();
