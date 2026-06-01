import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

// Define the Beneficiary type matching our database schema
interface Beneficiary {
  id: number;
  name: string;
  firstname: string | null;
  structure_type: "family" | "school" | "association" | "other";
  contact: string | null;
  address: string | null;
  created_at: string;
}

class BeneficiaryRepository {
  // Browse - Get all beneficiaries
  async readAll() {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM beneficiary ORDER BY created_at DESC",
    );
    return rows as Beneficiary[];
  }

  // Read - Get one beneficiary by id
  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM beneficiary WHERE id = ?",
      [id],
    );
    return rows[0] as Beneficiary | undefined;
  }

  // Add - Create a new beneficiary
  async create(beneficiary: Omit<Beneficiary, "id" | "created_at">) {
    const [result] = await databaseClient.query<Result>(
      `INSERT INTO beneficiary (name, firstname, structure_type, contact, address)
       VALUES (?, ?, ?, ?, ?)`,
      [
        beneficiary.name,
        beneficiary.firstname,
        beneficiary.structure_type,
        beneficiary.contact,
        beneficiary.address,
      ],
    );
    return result.insertId;
  }
}

export default new BeneficiaryRepository();
