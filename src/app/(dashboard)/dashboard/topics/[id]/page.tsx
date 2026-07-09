import { TopicDetailPage } from "@/features/topicDetail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <TopicDetailPage id={id} />;
}
