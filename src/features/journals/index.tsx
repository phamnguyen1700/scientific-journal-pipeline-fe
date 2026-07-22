"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import {
  JournalDetailContent,
  JournalDetailDrawer as JournalDetailDrawerView,
} from "@/features/journals/components";
import { useJournal } from "@/hooks/journals";
import { useUserFollowingJournals } from "@/hooks/user";

export function JournalDetailPage({
  id,
  returnTo,
}: {
  id: string;
  returnTo?: string;
}) {
  const journalQuery = useJournal(id);
  const followingJournalsQuery = useUserFollowingJournals();
  const backHref = getJournalBackHref(returnTo);
  const backLabel = backHref === "/dashboard/papers" ? "Back to paper search" : "Back to paper detail";
  const isFollowingJournal = isJournalFollowed(
    followingJournalsQuery.journals,
    id,
  );

  return (
    <div className="paper-detail-page">
      <Link href={backHref} className="paper-detail-back">
        <ArrowLeft /> {backLabel}
      </Link>
      <JournalDetailContent
        error={journalQuery.error}
        followed={isFollowingJournal}
        journal={journalQuery.journal}
        loading={journalQuery.loading}
        savingFollow={followingJournalsQuery.saving}
        onToggleFollow={() => {
          if (isFollowingJournal) {
            followingJournalsQuery.unfollowJournal(id);
          } else {
            followingJournalsQuery.followJournal(id);
          }
        }}
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
  const followingJournalsQuery = useUserFollowingJournals();
  const isFollowingJournal = journalId
    ? isJournalFollowed(followingJournalsQuery.journals, journalId)
    : false;

  return (
    <JournalDetailDrawerView
      error={journalQuery.error}
      followed={isFollowingJournal}
      journal={journalQuery.journal}
      loading={journalQuery.loading}
      open={open}
      onOpenChange={onOpenChange}
      savingFollow={followingJournalsQuery.saving}
      showPapers={showPapers}
      onToggleFollow={() => {
        if (!journalId) return;

        if (isFollowingJournal) {
          followingJournalsQuery.unfollowJournal(journalId);
        } else {
          followingJournalsQuery.followJournal(journalId);
        }
      }}
    />
  );
}

function isJournalFollowed(
  journals: Array<{ journalId: string }>,
  journalId: string,
) {
  return journals.some((journal) => journal.journalId === journalId);
}

function getJournalBackHref(returnTo: string | undefined) {
  if (!returnTo?.startsWith("/dashboard/")) {
    return "/dashboard/papers";
  }

  return returnTo;
}

export { JournalDetailContent };
