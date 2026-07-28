"use client";

import { useCallback, useEffect, useState } from "react";

const FIVE_MINUTES = 5 * 60 * 1000;
const THIRTY_MINUTES = 30 * 60 * 1000;

type RefreshState<T> = {
  data: T;
  error: boolean;
  lastUpdatedLabel: string;
  refreshNow: () => Promise<void>;
};

export function useMenuBoardRefresh<T>({
  fallbackData,
  publicJsonPath,
  formatTimestamp,
}: {
  fallbackData: T;
  publicJsonPath: string;
  formatTimestamp: () => string;
}): RefreshState<T> {
  const [data, setData] = useState<T>(fallbackData);
  const [error, setError] = useState(false);
  const [lastUpdatedLabel, setLastUpdatedLabel] = useState(
    "Refreshing every 5 minutes"
  );

  const refreshNow = useCallback(async () => {
    try {
      const response = await fetch(`${publicJsonPath}?ts=${Date.now()}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Menu board fetch failed: ${response.status}`);
      }

      setData((await response.json()) as T);
      setError(false);
      setLastUpdatedLabel(`Auto-refresh every 5 minutes • Last sync ${formatTimestamp()}`);
    } catch {
      setData(fallbackData);
      setError(true);
      setLastUpdatedLabel("Live refresh unavailable • showing local menu");
    }
  }, [fallbackData, formatTimestamp, publicJsonPath]);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => void refreshNow(), 0);
    const refreshTimer = window.setInterval(() => void refreshNow(), FIVE_MINUTES);
    const safetyReload = window.setTimeout(() => {
      window.location.reload();
    }, THIRTY_MINUTES);
    const handleOnline = () => {
      window.location.reload();
    };

    window.addEventListener("online", handleOnline);

    return () => {
      window.clearTimeout(initialLoad);
      window.clearInterval(refreshTimer);
      window.clearTimeout(safetyReload);
      window.removeEventListener("online", handleOnline);
    };
  }, [refreshNow]);

  return {
    data,
    error,
    lastUpdatedLabel,
    refreshNow,
  };
}
