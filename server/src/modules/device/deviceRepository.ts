import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

// Define the Device type matching our database schema
interface Device {
  id: number;
  type: "desktop" | "laptop" | "tablet";
  brand: string;
  model: string | null;
  status:
    | "to_sort"
    | "diagnosing"
    | "repairing"
    | "quality_check"
    | "ready"
    | "attributed"
    | "unusable";
  received_at: string;
  serial_number: string | null;
  donor: string | null;
  general_condition: string | null;
  accessories: string | null;
  notes: string | null;
  added_by_user_id: number;
  assigned_to_user_id: number | null;
  created_at: string;
}

class DeviceRepository {
  // Browse - Get all devices
  async readAll() {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM device ORDER BY created_at DESC",
    );
    return rows as Device[];
  }

  // Read - Get one device by id
  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM device WHERE id = ?",
      [id],
    );
    return rows[0] as Device | undefined;
  }

  // Add - Create a new device
  async create(device: Omit<Device, "id" | "created_at">) {
    const [result] = await databaseClient.query<Result>(
      `INSERT INTO device 
        (type, brand, model, status, received_at, serial_number, donor, general_condition, accessories, notes, added_by_user_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        device.type,
        device.brand,
        device.model,
        device.status,
        device.received_at,
        device.serial_number,
        device.donor,
        device.general_condition,
        device.accessories,
        device.notes,
        device.added_by_user_id,
      ],
    );
    return result.insertId;
  }

  // Edit - Update device status
  async updateStatus(
    id: number,
    status: Device["status"],
    assigned_to_user_id: number | null,
  ) {
    const [result] = await databaseClient.query<Result>(
      "UPDATE device SET status = ?, assigned_to_user_id = ? WHERE id = ?",
      [status, assigned_to_user_id, id],
    );
    return result.affectedRows;
  }

  // Destroy - Delete a device
  async delete(id: number) {
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM device WHERE id = ?",
      [id],
    );
    return result.affectedRows;
  }

  // Get all devices handled by a specific user
  async readByUser(userId: number) {
    const [rows] = await databaseClient.query<Rows>(
      `SELECT * FROM device 
     WHERE assigned_to_user_id = ? 
     OR added_by_user_id = ?
     ORDER BY created_at DESC`,
      [userId, userId],
    );
    return rows as Device[];
  }

  // Update notes on a device
  async updateNotes(id: number, notes: string) {
    const [result] = await databaseClient.query<Result>(
      "UPDATE device SET notes = ? WHERE id = ?",
      [notes, id],
    );
    return result.affectedRows;
  }
}

export default new DeviceRepository();
