"use client";

import { useMemo, useState } from "react";

import {
  BookmarkedPaperCard,
  BookmarkedPapersHeader,
  BookmarkedPapersToolbar,
} from "@/features/bookmarkedPapers/components";
import type { SavedPaper } from "@/types/library";

const initialSavedPapers: SavedPaper[] = [
  { id: 1, title: "Large Language Models in Scientific Discovery: A Systematic Review", authors: "Chen, L., Wang, H., Liu, Y.", journal: "Nature Machine Intelligence", year: 2024, citations: 148, savedAt: "2 days ago", abstract: "A systematic review of large language models across scientific workflows, discovery tools, and research domains.", tags: ["LLM", "AI", "Science"] },
  { id: 2, title: "Protein Structure Prediction with AlphaFold 3", authors: "Abramson, J., Adler, J., Dunger, J.", journal: "Nature", year: 2024, citations: 392, savedAt: "1 week ago", abstract: "AlphaFold 3 improves biomolecular structure prediction across proteins, nucleic acids, ligands, and molecular interactions.", tags: ["AlphaFold", "Proteins", "Biology"] },
  { id: 3, title: "Diffusion Models for Scientific Simulation", authors: "Li, M., Zhou, K., Patel, R.", journal: "NeurIPS 2024", year: 2024, citations: 76, savedAt: "2 weeks ago", abstract: "Diffusion-based generative approaches for accelerating simulation tasks in physics and computational science.", tags: ["Diffusion", "Simulation", "ML"] },
  { id: 4, title: "Climate Change Impacts on Biodiversity: A Meta-analysis", authors: "Muller, K., Jacobs, F., Martin, C.", journal: "Science", year: 2023, citations: 224, savedAt: "3 weeks ago", abstract: "A global meta-analysis identifying recurring biodiversity risks and ecosystem responses under climate pressure.", tags: ["Climate", "Ecology"] },
];

export function BookmarkedPapersPage() {
  const [papers, setPapers] = useState(initialSavedPapers);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recent");

  const visiblePapers = useMemo(() => {
    const search = query.trim().toLowerCase();
    return papers
      .filter((paper) => !search || [paper.title, paper.authors, paper.journal, ...paper.tags].join(" ").toLowerCase().includes(search))
      .sort((first, second) => {
        if (sort === "citations") return second.citations - first.citations;
        if (sort === "year") return second.year - first.year;
        return first.id - second.id;
      });
  }, [papers, query, sort]);

  return (
    <div className="library-page">
      <BookmarkedPapersHeader count={papers.length} />
      <BookmarkedPapersToolbar query={query} sort={sort} onQueryChange={setQuery} onSortChange={setSort} />
      <div className="library-list">
        {visiblePapers.map((paper) => <BookmarkedPaperCard key={paper.id} paper={paper} onRemove={(id) => setPapers((current) => current.filter((item) => item.id !== id))} />)}
      </div>
    </div>
  );
}
