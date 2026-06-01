import { Bookmark } from "lucide-react";

export function BookmarkedPapersHeader({ count }: { count: number }) {
  return (
    <div>
      <h1 className="library-page-title">Bookmarked Papers</h1>
      <p className="library-page-description">
        <Bookmark />
        {count} saved papers in your research library
      </p>
    </div>
  );
}
