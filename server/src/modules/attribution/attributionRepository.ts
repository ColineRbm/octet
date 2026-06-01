import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

// Define the Attribution type matching our database schema
interface Attribution {
  id: number;
  device_id: number;
  beneficiary_id: number;
  user_id: number;
  cession_type: "donation" | "cession";
  price: number;
  attributed_at: string;
  notes: string | null;
}

class AttributionRepository {
  // Browse - Get all attributions with device and beneficiary info
  async readAll() {
    const [rows] = await databaseClient.query<Rows>(
      `SELECT 
        a.id,
        a.cession_type,
        a.price,
        a.attributed_at,
        a.notes,
        d.brand,
        d.model,
        d.type AS device_type,
        b.name AS beneficiary_name,
        b.firstname AS beneficiary_firstname,
        b.structure_type,
        u.firstname AS attributed_by_firstname,
        u.lastname AS attributed_by_lastname
       FROM attribution a
       JOIN device d ON a.device_id = d.id
       JOIN beneficiary b ON a.beneficiary_id = b.id
       JOIN user u ON a.user_id = u.id
       ORDER BY a.attributed_at DESC`,
    );
    return rows;
  }

  // Read - Get one attribution by id
  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      `SELECT 
        a.id,
        a.cession_type,
        a.price,
        a.attributed_at,
        a.notes,
        d.brand,
        d.model,
        d.type AS device_type,
        b.name AS beneficiary_name,
        b.firstname AS beneficiary_firstname,
        b.structure_type,
        u.firstname AS attributed_by_firstname,
        u.lastname AS attributed_by_lastname
       FROM attribution a
       JOIN device d ON a.device_id = d.id
       JOIN beneficiary b ON a.beneficiary_id = b.id
       JOIN user u ON a.user_id = u.id
       WHERE a.id = ?`,
      [id],
    );
    return rows[0];
  }

  // Add - Create a new attribution
  async create(attribution: Omit<Attribution, "id" | "attributed_at">) {
    const [result] = await databaseClient.query<Result>(
      `INSERT INTO attribution (device_id, beneficiary_id, user_id, cession_type, price, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        attribution.device_id,
        attribution.beneficiary_id,
        attribution.user_id,
        attribution.cession_type,
        attribution.price,
        attribution.notes,
      ],
    );
    return result.insertId;
  }
}

export default new AttributionRepository();
