import { PaperSearchPage } from "@/features/paperSearch";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    fromHome?: string;
    q?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <PaperSearchPage
      initialFromHome={params.fromHome === "1"}
      initialQuery={params.q ?? ""}
    />
  );
}
