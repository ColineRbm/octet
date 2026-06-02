import { useCallback, useEffect, useState } from "react";
import { getDevices, getMyDevices } from "../services/api";
import type { Device } from "../types";

interface UseMyDevicesReturn {
  devices: Device[];
  myDevices: Device[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useMyDevices = (): UseMyDevicesReturn => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [myDevices, setMyDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [allData, myData] = await Promise.all([
        getDevices(),
        getMyDevices(),
      ]);
      setDevices(allData);
      setMyDevices(myData);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les appareils.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { devices, myDevices, loading, error, refetch: fetchAll };
};
