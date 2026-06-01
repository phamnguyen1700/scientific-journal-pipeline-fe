"use client";

import { useEffect, useState } from "react";

import {
  getPaperDetailService,
  getPapersService,
} from "@/service/papers";
import type { PaperApiModel } from "@/types/papers";

export function usePapers() {
  const [papers, setPapers] = useState<PaperApiModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getPapersService()
      .then((response) => {
        if (!active) return;
        if (!response.succeeded) {
          throw new Error(response.errors.join(", ") || "Unable to load papers.");
        }
        setPapers(response.result);
      })
      .catch((requestError: unknown) => {
        if (!active) return;
        setError(getErrorMessage(requestError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { papers, loading, error };
}

export function usePaper(id: string) {
  const listQuery = usePapers();
  const [paper, setPaper] = useState<PaperApiModel | null>(null);
  const [detailLoading, setDetailLoading] = useState(!isListPosition(id));
  const [detailError, setDetailError] = useState<string | null>(null);

  useEffect(() => {
    if (isListPosition(id)) return;

    let active = true;

    getPaperDetailService(id)
      .then((response) => {
        if (!active) return;
        if (!response.succeeded || !response.result) {
          throw new Error(response.errors.join(", ") || "Paper not found.");
        }
        setPaper(response.result);
      })
      .catch((requestError: unknown) => {
        if (active) setDetailError(getErrorMessage(requestError));
      })
      .finally(() => {
        if (active) setDetailLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (isListPosition(id)) {
    const position = Number(id) - 1;
    return {
      paper: listQuery.papers[position] ?? null,
      loading: listQuery.loading,
      error: listQuery.error || (!listQuery.loading && !listQuery.papers[position] ? "Paper not found." : null),
    };
  }

  return { paper, loading: detailLoading, error: detailError };
}

function isListPosition(id: string) {
  return /^\d+$/.test(id);
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unable to connect to the paper service.";
}
