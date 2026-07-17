"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import {
  JournalDetailContent,
  JournalDetailDrawer as JournalDetailDrawerView,
} from "@/features/journals/components";
import { useJournal } from "@/hooks/journals";

export function JournalDetailPage({
  id,
  returnTo,
}: {
  id: string;
  returnTo?: string;
}) {
  const journalQuery = useJournal(id);
  const backHref = getJournalBackHref(returnTo);
  const backLabel = backHref === "/dashboard/papers" ? "Back to paper search" : "Back to paper detail";

  return (
    <div className="paper-detail-page">
      <Link href={backHref} className="paper-detail-back">
        <ArrowLeft /> {backLabel}
      </Link>
      <JournalDetailContent
        error={journalQuery.error}
        journal={journalQuery.journal}
        loading={journalQuery.loading}
      />
    </div>
  );
}

export function JournalDetailDrawer({
  journalId,
  open,
  onOpenChange,
  showPapers = true,
}: {
  journalId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showPapers?: boolean;
}) {
  const journalQuery = useJournal(journalId);

  return (
    <JournalDetailDrawerView
      error={journalQuery.error}
      journal={journalQuery.journal}
      loading={journalQuery.loading}
      open={open}
      onOpenChange={onOpenChange}
      showPapers={showPapers}
    />
  );
}

function getJournalBackHref(returnTo: string | undefined) {
  if (!returnTo?.startsWith("/dashboard/")) {
    return "/dashboard/papers";
  }

  return returnTo;
}

export { JournalDetailContent };
