import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import {
  AuthorDetailContent,
  AuthorDetailDrawer,
} from "@/features/authors/components/authorDetailDrawer";

export function AuthorDetailPage({
  id,
  returnTo,
}: {
  id: string;
  returnTo?: string;
}) {
  const backHref = getAuthorBackHref(returnTo);
  const backLabel =
    backHref === "/dashboard/papers"
      ? "Back to paper search"
      : "Back to paper detail";

  return (
    <div className="paper-detail-page">
      <Link href={backHref} className="paper-detail-back">
        <ArrowLeft /> {backLabel}
      </Link>
      <AuthorDetailContent id={id} />
    </div>
  );
}

function getAuthorBackHref(returnTo: string | undefined) {
  if (!returnTo?.startsWith("/dashboard/")) {
    return "/dashboard/papers";
  }

  return returnTo;
}

export { AuthorDetailContent, AuthorDetailDrawer };