import { useCallback, useEffect, useState } from "react";
import { getBeneficiaries } from "../services/api";
import type { Beneficiary } from "../types";

interface UseBeneficiariesReturn {
  beneficiaries: Beneficiary[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useBeneficiaries = (): UseBeneficiariesReturn => {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBeneficiaries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBeneficiaries();
      setBeneficiaries(data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les bénéficiaires.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBeneficiaries();
  }, [fetchBeneficiaries]);

  return { beneficiaries, loading, error, refetch: fetchBeneficiaries };
};
