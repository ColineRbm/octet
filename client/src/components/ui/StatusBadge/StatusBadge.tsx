import { STATUS_CONFIG } from "../../../constants/device.constants";
import type { DeviceStatus } from "../../../types";
import "./StatusBadge.css";

interface StatusBadgeProps {
  status: DeviceStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className="status-badge"
      style={{ background: config.bg, color: config.color }}
    >
      <span className="status-badge__dot" />
      {config.label}
    </span>
  );
};

export default StatusBadge;
