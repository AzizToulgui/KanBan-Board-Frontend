"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import * as api from "@/lib/api";

interface AttachmentPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attachment: any;
}

export function AttachmentPreviewModal({
  open,
  onOpenChange,
  attachment,
}: AttachmentPreviewModalProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isImage = attachment?.mimeType?.startsWith("image/");
  const isPdf = attachment?.mimeType === "application/pdf";

  // Load file securely (with auth)
  useEffect(() => {
    if (!attachment || !open) return;

    let objectUrl: string | null = null;

    const load = async () => {
      try {
        const blob = await api.getAttachmentPreviewBlob(attachment.id);
        objectUrl = URL.createObjectURL(blob);
        setPreviewUrl(objectUrl);
      } catch (err) {
        console.error("Preview load failed:", err);
      }
    };

    load();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      setPreviewUrl(null);
    };
  }, [attachment, open]);

  if (!attachment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="truncate">
              {attachment.fileName}
            </DialogTitle>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!previewUrl}
                onClick={() => {
                  if (previewUrl) window.open(previewUrl, "_blank");
                }}
              >
                <Download className="size-4 mr-1" />
                Open
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div
          className="overflow-auto bg-black/90 rounded-md"
          style={{ height: "70vh" }}
        >
          {!previewUrl ? (
            <div className="flex items-center justify-center h-full text-white">
              Loading...
            </div>
          ) : isImage ? (
            <img
              src={previewUrl}
              alt={attachment.fileName}
              className="mx-auto max-h-full object-contain"
            />
          ) : isPdf ? (
            <iframe
              src={previewUrl}
              className="w-full h-full min-h-[70vh]"
              title={attachment.fileName}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-white">
              <div className="text-center">
                <p className="text-lg">
                  Preview not available for this file type
                </p>

                <Button
                  className="mt-4"
                  onClick={() => {
                    if (previewUrl) window.open(previewUrl, "_blank");
                  }}
                >
                  Open in new tab
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
