import { CorrespDashboardData } from '../types/dashboard/dashboard.type.ts';
import { useEffect, useState } from 'react';
import { getCorrespDashboard } from '../services/dashboard.service.ts';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useCorrespDashboard = (): FetchState<CorrespDashboardData> => {
  const [data, setData] = useState<CorrespDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getCorrespDashboard()
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message ?? 'Error al cargar datos');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tick]);

  return { data, loading, error, refetch: () => setTick((t) => t + 1) };
};
