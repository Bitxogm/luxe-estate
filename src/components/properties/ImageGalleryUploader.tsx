"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Plus, Loader2 } from "lucide-react";
import { uploadPropertyImageAction } from "@/server/actions/upload.action";

interface ImageGalleryUploaderProps {
  imageUrl: string;
  images: string[];
  onImageUrlChange: (url: string) => void;
  onImagesChange: (urls: string[]) => void;
  imageUrlError?: string;
}

const MAX_GALLERY = 5;

export default function ImageGalleryUploader({
  imageUrl,
  images,
  onImageUrlChange,
  onImagesChange,
  imageUrlError,
}: ImageGalleryUploaderProps) {
  const [mainLoading, setMainLoading] = useState(false);
  const [mainError, setMainError] = useState<string | null>(null);
  const [mainDragging, setMainDragging] = useState(false);
  const [slotLoadings, setSlotLoadings] = useState<boolean[]>(Array(MAX_GALLERY).fill(false));
  const [slotErrors, setSlotErrors] = useState<(string | null)[]>(Array(MAX_GALLERY).fill(null));

  const mainInputRef = useRef<HTMLInputElement>(null);
  const slotRefs = useRef<(HTMLInputElement | null)[]>(Array(MAX_GALLERY).fill(null));

  async function upload(file: File): Promise<{ url: string } | { error: string }> {
    const fd = new FormData();
    fd.append("file", file);
    return uploadPropertyImageAction(fd);
  }

  async function handleMainFile(file: File) {
    setMainLoading(true);
    setMainError(null);
    const result = await upload(file);
    setMainLoading(false);
    if ("error" in result) setMainError(result.error);
    else onImageUrlChange(result.url);
  }

  async function handleSlotFile(index: number, file: File) {
    setSlotLoadings((prev) => {
      const n = [...prev];
      n[index] = true;
      return n;
    });
    setSlotErrors((prev) => {
      const n = [...prev];
      n[index] = null;
      return n;
    });

    const result = await upload(file);

    setSlotLoadings((prev) => {
      const n = [...prev];
      n[index] = false;
      return n;
    });

    if ("error" in result) {
      setSlotErrors((prev) => {
        const n = [...prev];
        n[index] = result.error;
        return n;
      });
    } else {
      const next = [...images];
      next[index] = result.url;
      onImagesChange(next.filter(Boolean));
    }
  }

  function removeSlot(index: number) {
    const next = [...images];
    next.splice(index, 1);
    onImagesChange(next);
    const ref = slotRefs.current[index];
    if (ref) ref.value = "";
  }

  return (
    <div className="space-y-4">
      {/* Main image */}
      {imageUrl ? (
        <div className="relative overflow-hidden rounded-lg">
          <Image
            src={imageUrl}
            alt="Main property image"
            width={800}
            height={450}
            className="h-56 w-full object-cover"
          />
          <span className="absolute left-3 top-3 rounded-full bg-mosque px-3 py-1 text-xs font-semibold text-white">
            Main
          </span>
          <button
            type="button"
            onClick={() => {
              onImageUrlChange("");
              setMainError(null);
              if (mainInputRef.current) mainInputRef.current.value = "";
            }}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-nordic/80 text-white transition-colors hover:bg-nordic"
          >
            <X size={15} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => mainInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setMainDragging(true);
          }}
          onDragLeave={() => setMainDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setMainDragging(false);
            const f = e.dataTransfer.files[0];
            if (f) handleMainFile(f);
          }}
          disabled={mainLoading}
          className={`flex w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed py-12 transition-colors disabled:opacity-60 ${
            mainDragging
              ? "border-mosque bg-hint-green/20"
              : "border-nordic/20 bg-clear-day hover:bg-hint-green/20 dark:border-white/10 dark:bg-white/5 dark:hover:bg-hint-green/10"
          }`}
        >
          {mainLoading ? (
            <Loader2 size={28} className="animate-spin text-mosque dark:text-hint-green" />
          ) : (
            <Upload size={28} className="text-nordic/40 dark:text-clear-day/40" />
          )}
          <span className="text-sm font-medium text-nordic dark:text-clear-day">
            {mainLoading ? "Uploading…" : "Click to upload or drag & drop"}
          </span>
          {!mainLoading && (
            <span className="text-xs text-nordic/40 dark:text-clear-day/40">
              JPG, PNG or WebP — max 5MB · Main image
            </span>
          )}
        </button>
      )}

      <input
        ref={mainInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleMainFile(f);
        }}
      />

      {(mainError || imageUrlError) && (
        <p className="text-xs text-red-500">{mainError ?? imageUrlError}</p>
      )}

      {/* Gallery slots */}
      <div>
        <p className="mb-2 text-xs text-nordic/50 dark:text-clear-day/50">
          Additional photos (up to {MAX_GALLERY})
        </p>
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: MAX_GALLERY }).map((_, i) => {
            const url = images[i];
            const loading = slotLoadings[i];
            const error = slotErrors[i];

            return (
              <div key={i} className="relative">
                <div className="relative aspect-square">
                  {url ? (
                    <>
                      <Image
                        src={url}
                        alt={`Gallery image ${i + 1}`}
                        fill
                        className="rounded-lg object-cover"
                        sizes="80px"
                      />
                      <button
                        type="button"
                        onClick={() => removeSlot(i)}
                        className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-nordic text-white shadow"
                      >
                        <X size={10} />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => slotRefs.current[i]?.click()}
                      disabled={loading}
                      className="flex h-full w-full items-center justify-center rounded-lg border-2 border-dashed border-nordic/20 bg-clear-day transition-colors hover:bg-hint-green/20 disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:hover:bg-hint-green/10"
                    >
                      {loading ? (
                        <Loader2
                          size={16}
                          className="animate-spin text-mosque dark:text-hint-green"
                        />
                      ) : (
                        <Plus size={16} className="text-nordic/40 dark:text-clear-day/40" />
                      )}
                    </button>
                  )}
                </div>
                {error && (
                  <p className="mt-1 text-center text-[10px] leading-tight text-red-500">{error}</p>
                )}
                <input
                  ref={(el) => {
                    slotRefs.current[i] = el;
                  }}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleSlotFile(i, f);
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
