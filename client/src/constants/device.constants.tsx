import { Laptop, Monitor, Tablet } from "lucide-react";
import type { DeviceStatus, DeviceType } from "../types";

export interface StatusConfig {
  label: string;
  color: string;
  bg: string;
}

export const STATUS_CONFIG: Record<DeviceStatus, StatusConfig> = {
  to_sort: { label: "À trier", color: "#6A6660", bg: "#F1EFE8" },
  diagnosing: { label: "Diagnostic", color: "#1C2B3A", bg: "#E8EEF4" },
  repairing: { label: "Réparation", color: "#A06010", bg: "#FEF3DC" },
  quality_check: { label: "Contrôle N2", color: "#6B30A0", bg: "#F3E8FA" },
  ready: { label: "À attribuer", color: "#1A7A45", bg: "#E8F4EE" },
  attributed: { label: "Attribué", color: "#C04800", bg: "#FEF0E4" },
  unusable: { label: "Hors service", color: "#A32D2D", bg: "#FDEDEC" },
};

export const TYPE_LABELS: Record<DeviceType, string> = {
  laptop: "Ordinateur portable",
  desktop: "Ordinateur fixe",
  tablet: "Tablette",
};

export const TYPE_ICONS: Record<DeviceType, React.ReactElement> = {
  laptop: <Laptop />,
  desktop: <Monitor />,
  tablet: <Tablet />,
};
