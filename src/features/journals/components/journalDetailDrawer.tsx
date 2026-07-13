import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/ui/drawer";
import type { Journal } from "@/types/journals";

import { JournalDetailContent } from "@/features/journals/components/journalDetailContent";

export function JournalDetailDrawer({
  error,
  journal,
  loading,
  open,
  onOpenChange,
  showPapers = true,
}: {
  error: string | null;
  journal: Journal | null;
  loading: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showPapers?: boolean;
}) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent showCloseButton>
        <DrawerHeader className="author-drawer-header">
          <DrawerTitle>Journal detail</DrawerTitle>
          <DrawerDescription>
            Source profile, research topics, yearly activity, and related papers.
          </DrawerDescription>
        </DrawerHeader>
        <div className="author-drawer-body">
          <JournalDetailContent error={error} journal={journal} loading={loading} showPapers={showPapers} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
