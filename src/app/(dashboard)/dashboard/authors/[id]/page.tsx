import { AuthorDetailPage } from "@/features/authors";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { id } = await params;
  const { returnTo } = await searchParams;

  return <AuthorDetailPage id={id} returnTo={returnTo} />;
}
