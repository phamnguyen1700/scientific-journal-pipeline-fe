import { JournalDetailPage } from "@/features/journals";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <JournalDetailPage id={id} />;
}
