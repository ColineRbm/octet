import { useCallback, useEffect, useState } from "react";
import { getMyActions } from "../services/api";

interface DeviceAction {
  id: number;
  action: string;
  created_at: string;
  device_id: number;
  brand: string;
  model: string | null;
  type: "desktop" | "laptop" | "tablet";
  status: string;
}

interface UseMyActionsReturn {
  actions: DeviceAction[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useMyActions = (): UseMyActionsReturn => {
  const [actions, setActions] = useState<DeviceAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyActions();
      setActions(data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les actions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActions();
  }, [fetchActions]);

  return { actions, loading, error, refetch: fetchActions };
};
