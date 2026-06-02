import { Laptop, Monitor, Tablet } from "lucide-react";
import type { DeviceType } from "../../../types";

interface DeviceIconProps {
  type: DeviceType;
  size?: number;
}

const DeviceIcon = ({ type, size = 17 }: DeviceIconProps) => {
  if (type === "desktop") return <Monitor size={size} />;
  if (type === "tablet") return <Tablet size={size} />;
  return <Laptop size={size} />;
};

export default DeviceIcon;
