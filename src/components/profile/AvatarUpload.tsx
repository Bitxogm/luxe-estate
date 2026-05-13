"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Camera, Loader2 } from "lucide-react";
import { uploadAvatarAction } from "@/server/actions/upload.action";
import { updateUserAvatarAction } from "@/server/actions/user.action";
import { notify } from "@/lib/toast";

interface AvatarUploadProps {
  name: string;
  email: string;
  image?: string | null;
  size?: "sm" | "lg";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function AvatarUpload({ name, email, image, size = "lg" }: AvatarUploadProps) {
  const [currentImage, setCurrentImage] = useState(image ?? null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const dim = size === "lg" ? "h-24 w-24 lg:h-32 lg:w-32" : "h-20 w-20";
  const textSize = size === "lg" ? "text-2xl lg:text-3xl" : "text-xl";
  const borderClass =
    size === "lg"
      ? "border-4 border-white shadow-lg dark:border-nordic"
      : "border-2 border-nordic/10 dark:border-white/10";

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const uploadResult = await uploadAvatarAction(formData);
    if ("error" in uploadResult) {
      notify.error(uploadResult.error);
      setIsUploading(false);
      return;
    }

    const saveResult = await updateUserAvatarAction(uploadResult.url);
    setIsUploading(false);

    if (saveResult.success) {
      setCurrentImage(saveResult.image);
      notify.success("Photo updated");
      router.refresh();
    } else {
      notify.error(saveResult.error);
    }
  }

  return (
    <div className="relative flex-shrink-0">
      <div className={`relative ${dim}`}>
        {currentImage ? (
          <Image
            src={currentImage}
            alt={name || email}
            fill
            className={`rounded-full object-cover ${borderClass}`}
            sizes={size === "lg" ? "128px" : "80px"}
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center rounded-full bg-mosque font-bold text-white ${borderClass} ${textSize}`}
          >
            {getInitials(name || email)}
          </div>
        )}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-nordic/50">
            <Loader2 size={size === "lg" ? 24 : 20} className="animate-spin text-white" />
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        title="Change photo"
        className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-mosque text-white shadow-md transition-colors hover:bg-nordic disabled:opacity-50 dark:bg-hint-green dark:text-nordic dark:hover:bg-white"
      >
        <Camera size={14} />
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
