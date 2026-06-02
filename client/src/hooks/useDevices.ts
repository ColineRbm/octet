import { useCallback, useEffect, useState } from "react";
import { getDevices } from "../services/api";
import type { Device } from "../types";

interface UseDevicesReturn {
  devices: Device[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useDevices = (): UseDevicesReturn => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDevices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDevices();
      setDevices(data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les appareils.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  return { devices, loading, error, refetch: fetchDevices };
};
