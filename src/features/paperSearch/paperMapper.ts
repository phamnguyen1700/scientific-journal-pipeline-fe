import type { PaperApiModel } from "@/types/papers";
import type { PaperSearchResult } from "@/types/search";

const emptyId = "00000000-0000-0000-0000-000000000000";

export function toPaperSearchResult(
  paper: PaperApiModel,
  index = 0
): PaperSearchResult {
  const authors = [...(paper.paperAuthorResponseModels ?? [])]
    .sort((first, second) => (first.authorOrder ?? 0) - (second.authorOrder ?? 0))
    .map((author) =>
      author.author?.displayName ??
      author.author?.fullName ??
      author.rawAuthorName ??
      author.name ??
      author.authorName
    )
    .filter((author): author is string => Boolean(author));

  return {
    id: paper.id && paper.id !== emptyId ? paper.id : String(index + 1),
    apiId: paper.id,
    doi: paper.doi,
    title: paper.title,
    authors: authors.length ? authors : ["Author information unavailable"],
    journal: paper.journal?.journalName ?? paper.journal?.name ?? paper.journal?.title ?? "Journal information unavailable",
    year: paper.publicationYear,
    citations: paper.citedByCount,
    abstract: paper.abstract ?? "No abstract is available for this paper.",
    tags: [paper.paperType, paper.language].filter((tag): tag is string => Boolean(tag)),
    openAccess: paper.isOpenAccess,
    bookmarked: false,
    publicationDate: paper.publicationDate,
    paperType: paper.paperType,
    language: paper.language,
    referenceCount: paper.referenceCount,
    retracted: paper.isRetracted,
  };
}
