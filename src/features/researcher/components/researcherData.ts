export type TopicKey = "llm" | "bio" | "quantum" | "climate" | "nlp";
export type ChartRow = { month: string } & Record<TopicKey, number>;
export type TopicMetricKey = "papers" | "growth" | "citations" | "hIndex" | "journals";

export const topicPalette = {
  purple: "#6C4CF1",
  emerald: "#10B981",
  blue: "#3B82F6",
  amber: "#F59E0B",
  red: "#EF4444",
  violet: "#8B5CF6",
};

export const dashboardTrendData = [
  { month: "Jan", llm: 2900, bio: 1200, quantum: 890, climate: 540 },
  { month: "Feb", llm: 3200, bio: 1350, quantum: 960, climate: 610 },
  { month: "Mar", llm: 3600, bio: 1480, quantum: 1040, climate: 590 },
  { month: "Apr", llm: 3900, bio: 1620, quantum: 1180, climate: 680 },
  { month: "May", llm: 4400, bio: 1780, quantum: 1320, climate: 720 },
  { month: "Jun", llm: 4821, bio: 1940, quantum: 1490, climate: 800 },
];

export const citationVelocityData = [
  { month: "Jan", citations: 1240 },
  { month: "Feb", citations: 1490 },
  { month: "Mar", citations: 1820 },
  { month: "Apr", citations: 2140 },
  { month: "May", citations: 2510 },
  { month: "Jun", citations: 2890 },
];

export const topTopics = [
  { name: "Large Language Models", papers: 4821, growth: 38.2 },
  { name: "Generative AI in Healthcare", papers: 3240, growth: 52.1 },
  { name: "Quantum ML", papers: 1490, growth: 28.4 },
  { name: "Federated Privacy ML", papers: 2140, growth: 42.8 },
  { name: "CRISPR 2.0 Delivery", papers: 1320, growth: 19.3 },
];

export const trendTopics: Array<{ key: TopicKey; label: string; color: string }> = [
  { key: "llm", label: "AI / LLM", color: topicPalette.purple },
  { key: "bio", label: "Biosciences", color: topicPalette.emerald },
  { key: "quantum", label: "Quantum Computing", color: topicPalette.blue },
  { key: "climate", label: "Climate Science", color: topicPalette.amber },
  { key: "nlp", label: "NLP", color: topicPalette.red },
];

export const monthlyTrendData: ChartRow[] = [
  { month: "Jan 23", llm: 1800, bio: 980, quantum: 620, climate: 480, nlp: 1240 },
  { month: "Apr 23", llm: 2100, bio: 1080, quantum: 720, climate: 520, nlp: 1380 },
  { month: "Jul 23", llm: 2600, bio: 1200, quantum: 840, climate: 560, nlp: 1490 },
  { month: "Oct 23", llm: 3000, bio: 1350, quantum: 980, climate: 610, nlp: 1620 },
  { month: "Jan 24", llm: 3400, bio: 1520, quantum: 1120, climate: 650, nlp: 1780 },
  { month: "Apr 24", llm: 4100, bio: 1720, quantum: 1280, climate: 720, nlp: 1920 },
  { month: "Jun 24", llm: 4821, bio: 1940, quantum: 1490, climate: 800, nlp: 2050 },
];

export const growthTrendData: ChartRow[] = [
  { month: "Jan 23", llm: 0, bio: 0, quantum: 0, climate: 0, nlp: 0 },
  { month: "Apr 23", llm: 16.7, bio: 10.2, quantum: 16.1, climate: 8.3, nlp: 11.3 },
  { month: "Jul 23", llm: 44.4, bio: 22.4, quantum: 35.5, climate: 16.7, nlp: 20.2 },
  { month: "Oct 23", llm: 66.7, bio: 37.8, quantum: 58.1, climate: 27.1, nlp: 30.6 },
  { month: "Jan 24", llm: 88.9, bio: 55.1, quantum: 80.6, climate: 35.4, nlp: 43.5 },
  { month: "Apr 24", llm: 127.8, bio: 75.5, quantum: 106.5, climate: 50.0, nlp: 54.8 },
  { month: "Jun 24", llm: 167.8, bio: 98.0, quantum: 140.3, climate: 66.7, nlp: 65.3 },
];

export const comparisonTopics: Record<string, Record<TopicMetricKey, number> & { color: string; monthlyTrend: number[] }> = {
  "Large Language Models": { color: topicPalette.purple, papers: 4821, growth: 38.2, citations: 142800, hIndex: 84, journals: 320, monthlyTrend: [2900, 3200, 3600, 3900, 4400, 4821] },
  "Computer Vision": { color: topicPalette.blue, papers: 3210, growth: 16.8, citations: 98400, hIndex: 72, journals: 218, monthlyTrend: [2200, 2380, 2560, 2740, 2980, 3210] },
  Bioinformatics: { color: topicPalette.emerald, papers: 2890, growth: 12.8, citations: 87600, hIndex: 68, journals: 194, monthlyTrend: [2100, 2280, 2420, 2580, 2740, 2890] },
  "Quantum Computing": { color: topicPalette.amber, papers: 2140, growth: 24.7, citations: 61200, hIndex: 56, journals: 142, monthlyTrend: [1200, 1380, 1540, 1720, 1930, 2140] },
  "Climate Modeling": { color: topicPalette.red, papers: 1890, growth: 15.1, citations: 54800, hIndex: 61, journals: 128, monthlyTrend: [1400, 1500, 1590, 1680, 1780, 1890] },
  "Federated Learning": { color: topicPalette.violet, papers: 1620, growth: 42.8, citations: 38900, hIndex: 48, journals: 104, monthlyTrend: [680, 850, 1050, 1250, 1450, 1620] },
};

export const allComparisonTopics = Object.keys(comparisonTopics);
export const comparisonMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

export const clusterAreas = [
  { id: "ai", label: "AI / Machine Learning", color: topicPalette.purple },
  { id: "bio", label: "Biosciences", color: topicPalette.emerald },
  { id: "phys", label: "Physics / Quantum", color: topicPalette.blue },
  { id: "climate", label: "Earth & Climate", color: topicPalette.amber },
  { id: "data", label: "Data Science", color: topicPalette.red },
];

export type ClusterNode = { id: number; label: string; x: number; y: number; r: number; area: string; papers: number };

export const clusterNodes: ClusterNode[] = [
  { id: 1, label: "Machine Learning", x: 340, y: 240, r: 42, area: "ai", papers: 48210 },
  { id: 2, label: "Deep Learning", x: 255, y: 175, r: 34, area: "ai", papers: 39820 },
  { id: 3, label: "Large Language Models", x: 420, y: 165, r: 38, area: "ai", papers: 4821 },
  { id: 4, label: "Computer Vision", x: 268, y: 310, r: 30, area: "ai", papers: 32100 },
  { id: 5, label: "NLP", x: 195, y: 245, r: 28, area: "ai", papers: 35640 },
  { id: 6, label: "Reinforcement Learning", x: 390, y: 310, r: 24, area: "ai", papers: 14320 },
  { id: 7, label: "Federated Learning", x: 460, y: 240, r: 22, area: "ai", papers: 9420 },
  { id: 8, label: "Bioinformatics", x: 580, y: 255, r: 36, area: "bio", papers: 28900 },
  { id: 9, label: "Genomics", x: 648, y: 185, r: 30, area: "bio", papers: 24180 },
  { id: 10, label: "CRISPR", x: 660, y: 320, r: 26, area: "bio", papers: 18720 },
  { id: 11, label: "Proteomics", x: 720, y: 245, r: 22, area: "bio", papers: 12400 },
  { id: 12, label: "Drug Discovery", x: 595, y: 340, r: 24, area: "bio", papers: 17650 },
  { id: 13, label: "Quantum Computing", x: 420, y: 80, r: 32, area: "phys", papers: 18720 },
  { id: 14, label: "Quantum ML", x: 320, y: 82, r: 20, area: "phys", papers: 3240 },
  { id: 15, label: "Neuromorphic", x: 510, y: 95, r: 20, area: "phys", papers: 5820 },
  { id: 16, label: "Data Mining", x: 360, y: 400, r: 24, area: "data", papers: 22300 },
  { id: 17, label: "Big Data", x: 460, y: 415, r: 26, area: "data", papers: 27400 },
  { id: 18, label: "Graph Neural Nets", x: 270, y: 395, r: 20, area: "data", papers: 11840 },
  { id: 19, label: "Climate Modeling", x: 120, y: 240, r: 28, area: "climate", papers: 18920 },
  { id: 20, label: "Carbon Capture", x: 100, y: 155, r: 20, area: "climate", papers: 8240 },
  { id: 21, label: "Biodiversity", x: 108, y: 330, r: 20, area: "climate", papers: 9840 },
];

export const clusterEdges = [
  [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7],
  [2, 3], [2, 5], [3, 7], [4, 16], [4, 18], [6, 16], [7, 8],
  [8, 9], [8, 10], [8, 11], [8, 12], [9, 10],
  [13, 1], [13, 14], [13, 15], [14, 2],
  [16, 17], [16, 18], [17, 8], [19, 5], [19, 20], [19, 21], [1, 8], [3, 13],
];

export const emergingTopics = [
  { name: "Multimodal AI for Drug Design", field: "AI x Pharmacology", growth: 148.2, papers: 1240, since: "6 months", stage: "Explosive", color: topicPalette.purple, opportunity: "High", trend: [80, 120, 180, 280, 430, 620, 890, 1240] },
  { name: "Quantum Error Correction", field: "Quantum Computing", growth: 112.4, papers: 890, since: "8 months", stage: "Rapid", color: topicPalette.blue, opportunity: "High", trend: [100, 148, 210, 290, 390, 520, 710, 890] },
  { name: "AI-Assisted Protein Engineering", field: "Synthetic Biology", growth: 94.8, papers: 2140, since: "12 months", stage: "Rapid", color: topicPalette.emerald, opportunity: "Medium", trend: [480, 620, 820, 1040, 1280, 1540, 1820, 2140] },
  { name: "Neuromorphic Chip Architectures", field: "Computer Architecture", growth: 87.3, papers: 680, since: "10 months", stage: "Growing", color: topicPalette.amber, opportunity: "High", trend: [80, 110, 150, 210, 300, 410, 540, 680] },
  { name: "Tipping Point Climate Models", field: "Climate Science", growth: 76.1, papers: 1580, since: "14 months", stage: "Growing", color: topicPalette.red, opportunity: "Medium", trend: [300, 420, 560, 720, 900, 1100, 1340, 1580] },
  { name: "Digital Twin Genomics", field: "Computational Biology", growth: 68.4, papers: 420, since: "5 months", stage: "Emerging", color: topicPalette.violet, opportunity: "Very High", trend: [40, 68, 105, 162, 238, 318, 378, 420] },
];

export const publicationYearlyData = [
  { year: "2019", papers: 124, citations: 1840, hIndex: 12 },
  { year: "2020", papers: 198, citations: 3420, hIndex: 18 },
  { year: "2021", papers: 312, citations: 6840, hIndex: 26 },
  { year: "2022", papers: 480, citations: 12400, hIndex: 34 },
  { year: "2023", papers: 680, citations: 22800, hIndex: 44 },
  { year: "2024", papers: 920, citations: 38600, hIndex: 54 },
];

export const publicationMonthlyData = [
  { month: "Jan", papers: 72, citations: 2840 },
  { month: "Feb", papers: 68, citations: 2960 },
  { month: "Mar", papers: 84, citations: 3410 },
  { month: "Apr", papers: 91, citations: 3820 },
  { month: "May", papers: 78, citations: 3280 },
  { month: "Jun", papers: 96, citations: 4180 },
];

export const topJournals = [
  { name: "Nature", papers: 12, avgCitations: 284 },
  { name: "Science", papers: 8, avgCitations: 241 },
  { name: "Cell", papers: 6, avgCitations: 198 },
  { name: "Nature Machine Intelligence", papers: 14, avgCitations: 162 },
  { name: "PLOS ONE", papers: 22, avgCitations: 87 },
];

export const topKeywords = [
  { keyword: "machine learning", count: 184 },
  { keyword: "deep learning", count: 142 },
  { keyword: "neural network", count: 128 },
  { keyword: "CRISPR", count: 94 },
  { keyword: "NLP", count: 86 },
  { keyword: "federated learning", count: 72 },
];

export const trackedJournals = [
  { id: 1, name: "Nature Machine Intelligence", publisher: "Springer Nature", impactFactor: 23.8, papers: 184, growth: 18.4, alert: true, keywords: ["LLM", "Computer Vision", "AI Safety"], lastUpdated: "2h ago" },
  { id: 2, name: "Nature Biotechnology", publisher: "Springer Nature", impactFactor: 46.9, papers: 142, growth: 12.1, alert: true, keywords: ["CRISPR", "Gene Therapy", "Protein Engineering"], lastUpdated: "4h ago" },
  { id: 3, name: "Science", publisher: "AAAS", impactFactor: 56.9, papers: 98, growth: 8.3, alert: false, keywords: ["Climate", "Quantum", "Genomics"], lastUpdated: "6h ago" },
  { id: 4, name: "Cell Systems", publisher: "Elsevier", impactFactor: 11.1, papers: 76, growth: 22.7, alert: true, keywords: ["Systems Biology", "Multiomics"], lastUpdated: "1d ago" },
  { id: 5, name: "NeurIPS Proceedings", publisher: "Neural Information Proc. Systems Foundation", impactFactor: null, papers: 520, growth: 34.2, alert: false, keywords: ["Deep Learning", "RL", "Optimization"], lastUpdated: "8h ago" },
  { id: 6, name: "Physical Review Letters", publisher: "APS", impactFactor: 9.2, papers: 64, growth: -2.4, alert: false, keywords: ["Quantum", "Photonics"], lastUpdated: "2d ago" },
];

export const keywordAlerts = [
  { keyword: "large language model", journals: 42, papers: 184, active: true },
  { keyword: "CRISPR therapy", journals: 18, papers: 67, active: true },
  { keyword: "quantum error correction", journals: 12, papers: 38, active: false },
  { keyword: "federated learning", journals: 28, papers: 92, active: true },
  { keyword: "climate tipping point", journals: 15, papers: 44, active: false },
];

export const reports = [
  { id: 1, title: "AI / ML Research Landscape Q2 2024", type: "Trend Report", generated: "Jun 15, 2024", pages: 42, topics: ["LLM", "Deep Learning", "Computer Vision"] },
  { id: 2, title: "Biosciences Publication Analysis - H1 2024", type: "Analytics Report", generated: "Jun 10, 2024", pages: 28, topics: ["Genomics", "CRISPR", "Proteomics"] },
  { id: 3, title: "Emerging Topics Signal Report - June 2024", type: "Signal Report", generated: "Jun 5, 2024", pages: 18, topics: ["Emerging AI", "Quantum ML"] },
  { id: 4, title: "Quantum Computing Growth Study 2023-2024", type: "Research Study", generated: "May 28, 2024", pages: 56, topics: ["Quantum Computing", "Quantum ML"] },
  { id: 5, title: "Climate Science Citation Network Analysis", type: "Network Report", generated: "May 15, 2024", pages: 34, topics: ["Climate", "Ecology"] },
];

