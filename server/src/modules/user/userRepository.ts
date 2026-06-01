import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

// Define the User type matching our database schema
interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password_hash: string;
  role: "admin" | "benevole";
  is_active: boolean;
  created_at: string;
}

class UserRepository {
  // Browse - Get all volunteers (benevole role only)
  async readAll() {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT id, firstname, lastname, email, role, is_active, created_at FROM user WHERE role = 'benevole' ORDER BY created_at DESC",
    );
    return rows as Omit<User, "password_hash">[];
  }

  // Read - Get one user by id
  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT id, firstname, lastname, email, role, is_active, created_at FROM user WHERE id = ?",
      [id],
    );
    return rows[0] as Omit<User, "password_hash"> | undefined;
  }

  // Add - Create a new volunteer
  async create(
    user: Pick<User, "firstname" | "lastname" | "email" | "password_hash">,
  ) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO user (firstname, lastname, email, password_hash, role) VALUES (?, ?, ?, ?, 'benevole')",
      [user.firstname, user.lastname, user.email, user.password_hash],
    );
    return result.insertId;
  }

  // Edit - Toggle active status
  async updateActiveStatus(id: number, is_active: boolean) {
    const [result] = await databaseClient.query<Result>(
      "UPDATE user SET is_active = ? WHERE id = ?",
      [is_active, id],
    );
    return result.affectedRows;
  }
}

export default new UserRepository();
