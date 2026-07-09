import { JournalDetailPage } from "@/features/journalDetail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <JournalDetailPage id={id} />;
}
