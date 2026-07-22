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
  followed,
  journal,
  loading,
  open,
  onOpenChange,
  savingFollow,
  showPapers = true,
  onToggleFollow,
}: {
  error: string | null;
  followed?: boolean;
  journal: Journal | null;
  loading: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  savingFollow?: boolean;
  showPapers?: boolean;
  onToggleFollow?: () => void;
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
          <JournalDetailContent
            error={error}
            followed={followed}
            journal={journal}
            loading={loading}
            savingFollow={savingFollow}
            showPapers={showPapers}
            onToggleFollow={onToggleFollow}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
