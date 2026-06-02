import { useCallback, useEffect, useState } from "react";
import { getAttributions } from "../services/api";
import type { Attribution } from "../types";

interface UseAttributionsReturn {
  attributions: Attribution[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useAttributions = (): UseAttributionsReturn => {
  const [attributions, setAttributions] = useState<Attribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAttributions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAttributions();
      setAttributions(data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les attributions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttributions();
  }, [fetchAttributions]);

  return { attributions, loading, error, refetch: fetchAttributions };
};
