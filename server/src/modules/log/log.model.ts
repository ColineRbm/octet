import { Schema, model } from "mongoose";

export type LogAction =
  | "login_success"
  | "login_failed"
  | "user_created"
  | "user_status_changed"
  | "user_password_reset"
  | "beneficiary_created"
  | "attribution_created"
  | "device_created"
  | "device_deleted";

export interface LogDocument {
  action: LogAction;
  user_id: number | null;
  details: Record<string, unknown>;
  timestamp: Date;
}

const logSchema = new Schema<LogDocument>({
  action: {
    type: String,
    required: true,
    enum: [
      "login_success",
      "login_failed",
      "user_created",
      "user_status_changed",
      "user_password_reset",
      "beneficiary_created",
      "attribution_created",
      "device_created",
      "device_deleted",
    ],
  },
  user_id: {
    type: Number,
    default: null,
  },
  details: {
    type: Schema.Types.Mixed,
    default: {},
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const Log = model<LogDocument>("Log", logSchema);
