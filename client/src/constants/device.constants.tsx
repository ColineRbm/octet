import { Laptop, Monitor, Tablet } from "lucide-react";
import type { DeviceStatus, DeviceType } from "../types";

export interface StatusConfig {
  label: string;
  color: string;
  bg: string;
  dot: string;
}

export const STATUS_CONFIG: Record<DeviceStatus, StatusConfig> = {
  to_sort: {
    label: "À trier",
    color: "#6B5C3E",
    bg: "#FFF3CD",
    dot: "#D97706",
  },
  diagnosing: {
    label: "Diagnostic",
    color: "#1A4F7A",
    bg: "#DBEAFE",
    dot: "#3B82F6",
  },
  repairing: {
    label: "Réparation",
    color: "#92400E",
    bg: "#FDE68A",
    dot: "#F59E0B",
  },
  quality_check: {
    label: "Contrôle N2",
    color: "#5B21B6",
    bg: "#EDE9FE",
    dot: "#8B5CF6",
  },
  ready: {
    label: "À attribuer",
    color: "#065F46",
    bg: "#A7F3D0",
    dot: "#10B981",
  },
  attributed: {
    label: "Attribué",
    color: "#1E3A5F",
    bg: "#BFDBFE",
    dot: "#3B82F6",
  },
  unusable: {
    label: "Hors service",
    color: "#7F1D1D",
    bg: "#FECACA",
    dot: "#EF4444",
  },
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
