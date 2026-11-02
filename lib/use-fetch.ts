"use client";
import { useCallback, useEffect, useState } from "react";
import { api } from "./api";

/** GET helper with loading / error state. Pass path=null to wait. */
export function useFetch<T>(path: string | null, auth = false) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!path) return;
    let live = true;
    setLoading(true);
    setError(null);
    api<T>(path, { auth })
      .then((d) => live && setData(d))
      .catch((e: Error) => live && setError(e.message))
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [path, auth, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);
  return { data, setData, loading, error, refetch };
}
