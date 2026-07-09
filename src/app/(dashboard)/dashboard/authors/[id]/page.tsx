import { AuthorDetailPage } from "@/features/authorDetail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <AuthorDetailPage id={id} />;
}
