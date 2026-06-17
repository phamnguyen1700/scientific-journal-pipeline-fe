"use client";

import { useMemo, useState } from "react";

import {
  PopularTopics,
  TopicGrid,
  TopicSearchHeader,
} from "@/features/topicSearch/components";
import type { ResearchTopic } from "@/types/topics";

const initialTopics: ResearchTopic[] = [
  {
    id: 1,
    name: "Large Language Models",
    description:
      "Foundation models for language understanding, generation, scientific reasoning, and intelligent assistants.",
    category: "Artificial Intelligence",
    color: "purple",
    papers: 4821,
    growth: 38.2,
    trend: "up",
    followed: true,
    keywords: ["Transformers", "NLP", "Generative AI"],
  },
  {
    id: 2,
    name: "Quantum Computing",
    description:
      "Quantum algorithms, hardware, error correction, and practical applications for computational science.",
    category: "Computer Science",
    color: "blue",
    papers: 2340,
    growth: 24.7,
    trend: "up",
    followed: false,
    keywords: ["Qubits", "Algorithms", "Quantum Systems"],
  },
  {
    id: 3,
    name: "Climate Modeling",
    description:
      "Simulation and prediction methods for climate systems, environmental risks, and long-term adaptation.",
    category: "Earth Science",
    color: "green",
    papers: 1892,
    growth: 18.4,
    trend: "up",
    followed: true,
    keywords: ["Climate Change", "Simulation", "Sustainability"],
  },
  {
    id: 4,
    name: "CRISPR Gene Editing",
    description:
      "Gene editing technologies for genomics, therapeutic applications, agriculture, and bioengineering.",
    category: "Biotechnology",
    color: "amber",
    papers: 1654,
    growth: 15.1,
    trend: "up",
    followed: false,
    keywords: ["CRISPR-Cas9", "Genomics", "Therapy"],
  },
  {
    id: 5,
    name: "Federated Learning",
    description:
      "Distributed machine learning for privacy-preserving collaboration across organizations and devices.",
    category: "Machine Learning",
    color: "red",
    papers: 1247,
    growth: 42.8,
    trend: "up",
    followed: false,
    keywords: ["Privacy", "Edge AI", "Distributed Systems"],
  },
  {
    id: 6,
    name: "Bioinformatics",
    description:
      "Computational methods for biological datasets, genomic analysis, protein modeling, and drug discovery.",
    category: "Life Science",
    color: "cyan",
    papers: 2890,
    growth: 12.8,
    trend: "stable",
    followed: false,
    keywords: ["Genomics", "Proteomics", "Data Science"],
  },
];

export function TopicSearchPage() {
  const [query, setQuery] = useState("");
  const [topics, setTopics] = useState(initialTopics);

  const visibleTopics = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return topics;

    return topics.filter((topic) =>
      [
        topic.name,
        topic.category,
        topic.description,
        ...topic.keywords,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search)
    );
  }, [query, topics]);

  const popularTopics = useMemo(
    () => [...topics].sort((first, second) => second.growth - first.growth).slice(0, 5),
    [topics]
  );

  function toggleFollow(id: number) {
    setTopics((current) =>
      current.map((topic) =>
        topic.id === id ? { ...topic, followed: !topic.followed } : topic
      )
    );
  }

  return (
    <div className="topic-search-page">
      <TopicSearchHeader query={query} onQueryChange={setQuery} />
      <PopularTopics topics={popularTopics} onSelect={setQuery} />
      <section className="topic-search-results">
        <div>
          <h2 className="topic-search-section-title">Explore Topics</h2>
          <p className="topic-search-section-description">
            {visibleTopics.length} research topics found
          </p>
        </div>
        <TopicGrid topics={visibleTopics} onToggleFollow={toggleFollow} />
      </section>
    </div>
  );
}

export { initialTopics };
