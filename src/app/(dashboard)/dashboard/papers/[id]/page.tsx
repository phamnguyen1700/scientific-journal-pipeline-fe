import { PaperDetailPage } from "@/features/paperDetail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <PaperDetailPage id={id} />;
}
