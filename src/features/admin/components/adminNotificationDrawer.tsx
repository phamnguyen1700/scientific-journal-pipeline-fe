"use client";

import { AlertTriangle, BellRing, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";

import { useTriggerAdminNotification } from "@/hooks/notifications";
import { getApiErrorMessage } from "@/lib/apiError";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { Button } from "@/shared/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/ui/drawer";
import { Input } from "@/shared/ui/input";
import type { AdminNotificationTriggerType } from "@/types/notifications";

const triggerOptions: Array<{
  value: AdminNotificationTriggerType;
  label: string;
}> = [
  {
    value: "NewPaperInFollowedTopic",
    label: "New paper in followed topic",
  },
  {
    value: "NewPaperInFollowedJournal",
    label: "New paper in followed journal",
  },
  {
    value: "BookmarkedPaperUpdated",
    label: "Bookmarked paper updated",
  },
];

const guidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function AdminNotificationDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [eventType, setEventType] =
    useState<AdminNotificationTriggerType>("NewPaperInFollowedTopic");
  const [paperId, setPaperId] = useState("");
  const [confirming, setConfirming] = useState(false);
  const triggerNotification = useTriggerAdminNotification();
  const normalizedPaperId = paperId.trim();
  const paperIdIsValid = guidPattern.test(normalizedPaperId);
  const selectedLabel =
    triggerOptions.find((option) => option.value === eventType)?.label ??
    "Notification";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!paperIdIsValid) {
      toast.error("Enter a valid paper ID.");
      return;
    }

    if (!confirming) {
      setConfirming(true);
      return;
    }

    triggerNotification.mutate(
      { eventType, paperId: normalizedPaperId },
      {
        onSuccess: (message) => {
          toast.success(message || "Notification triggered successfully.");
          setPaperId("");
          setConfirming(false);
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(
            getApiErrorMessage(error, "Unable to trigger the notification."),
          );
        },
      },
    );
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!triggerNotification.isPending) {
      setConfirming(false);
      onOpenChange(nextOpen);
    }
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent className="sm:max-w-[520px]" showCloseButton>
        <DrawerHeader className="border-b border-border px-6 py-5">
          <div className="flex items-center gap-2">
            <BellRing className="size-5 text-primary" />
            <DrawerTitle>Trigger notification</DrawerTitle>
          </div>
          <DrawerDescription>
            Send one paper event to eligible users.
          </DrawerDescription>
        </DrawerHeader>

        <form
          className="flex min-h-0 flex-col overflow-y-auto"
          onSubmit={handleSubmit}
        >
          <div className="flex-1 space-y-5 p-6">
            <Alert variant="warning">
              <AlertTriangle />
              <AlertTitle>Manual operation</AlertTitle>
              <AlertDescription>
                This runs the recipient query immediately. It does not run on a
                schedule or retry automatically.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="notification-event-type"
              >
                Event
              </label>
              <select
                id="notification-event-type"
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
                disabled={triggerNotification.isPending}
                value={eventType}
                onChange={(event) => {
                  setEventType(
                    event.target.value as AdminNotificationTriggerType,
                  );
                  setConfirming(false);
                }}
              >
                {triggerOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="notification-paper-id"
              >
                Paper ID
              </label>
              <Input
                id="notification-paper-id"
                autoComplete="off"
                disabled={triggerNotification.isPending}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                value={paperId}
                onChange={(event) => {
                  setPaperId(event.target.value);
                  setConfirming(false);
                }}
                aria-invalid={Boolean(normalizedPaperId) && !paperIdIsValid}
              />
              {normalizedPaperId && !paperIdIsValid ? (
                <p className="text-xs text-destructive">
                  Use a valid GUID from the paper record.
                </p>
              ) : null}
            </div>

            {confirming ? (
              <Alert variant="destructive">
                <AlertTriangle />
                <AlertTitle>Confirm send</AlertTitle>
                <AlertDescription>
                  Trigger &quot;{selectedLabel}&quot; for paper {normalizedPaperId}?
                </AlertDescription>
              </Alert>
            ) : null}
          </div>

          <DrawerFooter className="border-t border-border p-6">
            {confirming ? (
              <Button
                type="button"
                variant="outline"
                disabled={triggerNotification.isPending}
                onClick={() => setConfirming(false)}
              >
                Cancel
              </Button>
            ) : null}
            <Button
              type="submit"
              variant={confirming ? "destructive" : "default"}
              disabled={!paperIdIsValid || triggerNotification.isPending}
            >
              <Send />
              {triggerNotification.isPending
                ? "Sending..."
                : confirming
                  ? "Send now"
                  : "Review trigger"}
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
