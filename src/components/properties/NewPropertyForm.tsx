"use client";

import { useActionState, useState, useRef } from "react";
import { createPropertyAction, updatePropertyAction } from "@/server/actions/property.action";
import { uploadPropertyImageAction } from "@/server/actions/upload.action";
import {
  Minus,
  Plus,
  BedDouble,
  Bath,
  Ruler,
  MapPin,
  ImageIcon,
  Info,
  Upload,
  X,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Property } from "@prisma/client";

const inputClass =
  "w-full rounded-lg border border-nordic/10 bg-white px-4 py-2.5 text-sm text-nordic placeholder-nordic/30 outline-none transition-all focus:border-mosque focus:ring-1 focus:ring-mosque dark:border-white/10 dark:bg-nordic-muted/20 dark:text-clear-day dark:placeholder-clear-day/30 dark:focus:border-hint-green dark:focus:ring-hint-green";

const selectClass =
  "w-full rounded-lg border border-nordic/10 bg-white px-4 py-2.5 text-sm text-nordic outline-none transition-all focus:border-mosque focus:ring-1 focus:ring-mosque dark:border-white/10 dark:bg-nordic-muted/20 dark:text-clear-day dark:focus:border-hint-green dark:focus:ring-hint-green cursor-pointer";

const labelClass = "mb-1.5 block text-sm font-medium text-nordic dark:text-clear-day";
const errorClass = "mt-1 text-xs text-red-500";

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-hint-green/30 bg-gradient-to-r from-hint-green/10 to-transparent px-8 py-6">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-hint-green text-nordic">
        <Icon size={18} />
      </div>
      <h2 className="text-xl font-bold text-nordic dark:text-clear-day">{title}</h2>
    </div>
  );
}

function Counter({
  label,
  icon: Icon,
  value,
  onChange,
}: {
  label: string;
  icon: React.ElementType;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <label className="flex items-center gap-2 text-sm font-medium text-nordic dark:text-clear-day">
        <Icon size={16} className="text-nordic/40" />
        {label}
      </label>
      <div className="flex items-center overflow-hidden rounded-lg border border-nordic/10 bg-white shadow-sm dark:border-white/10 dark:bg-nordic-muted/20">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="flex h-8 w-8 items-center justify-center border-r border-nordic/10 text-nordic/60 transition-colors hover:bg-nordic/5 dark:border-white/10 dark:text-clear-day/60"
        >
          <Minus size={14} />
        </button>
        <span className="w-10 text-center text-sm font-medium text-nordic dark:text-clear-day">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="flex h-8 w-8 items-center justify-center border-l border-nordic/10 text-nordic/60 transition-colors hover:bg-nordic/5 dark:border-white/10 dark:text-clear-day/60"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

const initialState = { errors: {} as Record<string, string> };

interface NewPropertyFormProps {
  property?: Property;
}

export default function NewPropertyForm({ property }: NewPropertyFormProps) {
  const formAction = property ? updatePropertyAction : createPropertyAction;
  const [state, action, isPending] = useActionState(formAction, initialState);
  const [beds, setBeds] = useState(property?.beds ?? 1);
  const [baths, setBaths] = useState(property?.baths ?? 1);
  const [imageUrl, setImageUrl] = useState(property?.imageUrl ?? "");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleImageFile(file: File) {
    setIsUploadingImage(true);
    setImageUploadError(null);

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadPropertyImageAction(formData);
    setIsUploadingImage(false);

    if ("error" in result) {
      setImageUploadError(result.error);
    } else {
      setImageUrl(result.url);
    }
  }

  function handleImageInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file);
  }

  return (
    <form id="new-property-form" action={action}>
      {property && <input type="hidden" name="propertyId" value={property.id} />}
      <input type="hidden" name="beds" value={beds} />
      <input type="hidden" name="baths" value={baths} />

      <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-12">
        {/* Left column */}
        <div className="space-y-8 xl:col-span-8">
          {/* Basic Information */}
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-white/5 dark:bg-nordic-muted/10">
            <SectionHeader icon={Info} title="Basic Information" />
            <div className="space-y-6 p-8">
              <div>
                <label htmlFor="title" className={labelClass}>
                  Property Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="e.g. Modern Penthouse with Ocean View"
                  defaultValue={property?.title ?? ""}
                  className={inputClass}
                />
                {state.errors.title && <p className={errorClass}>{state.errors.title}</p>}
              </div>

              <div>
                <label htmlFor="description" className={labelClass}>
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Describe the property in detail — location highlights, finishes, amenities…"
                  defaultValue={property?.description ?? ""}
                  className={inputClass + " resize-none"}
                />
                {state.errors.description && (
                  <p className={errorClass}>{state.errors.description}</p>
                )}
                <p className="mt-1 text-xs text-nordic/40 dark:text-clear-day/40">
                  Min 20 characters · max 1000
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <label htmlFor="price" className={labelClass}>
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-nordic/40 dark:text-clear-day/40">
                      $
                    </span>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      placeholder="0"
                      defaultValue={property?.price ?? ""}
                      className={inputClass + " pl-7"}
                    />
                  </div>
                  {state.errors.price && <p className={errorClass}>{state.errors.price}</p>}
                </div>

                <div>
                  <label htmlFor="priceType" className={labelClass}>
                    Listing Type
                  </label>
                  <select
                    id="priceType"
                    name="priceType"
                    defaultValue={property?.priceType ?? "sale"}
                    className={selectClass}
                  >
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="type" className={labelClass}>
                    Property Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    defaultValue={property?.type ?? "House"}
                    className={selectClass}
                  >
                    <option value="House">House</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Penthouse">Penthouse</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="badge" className={labelClass}>
                    Badge
                  </label>
                  <select
                    id="badge"
                    name="badge"
                    defaultValue={property?.badge ?? ""}
                    className={selectClass}
                  >
                    <option value="">None</option>
                    <option value="Exclusive">Exclusive</option>
                    <option value="New Arrival">New Arrival</option>
                    <option value="Price Drop">Price Drop</option>
                  </select>
                </div>

                <div className="flex items-end pb-1">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      defaultChecked={property?.isFeatured ?? false}
                      className="h-4 w-4 rounded border-gray-300 text-mosque focus:ring-mosque"
                    />
                    <span className="text-sm font-medium text-nordic dark:text-clear-day">
                      Featured property
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Image upload */}
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-white/5 dark:bg-nordic-muted/10">
            <SectionHeader icon={ImageIcon} title="Main Image" />
            <div className="space-y-4 p-8">
              <input type="hidden" name="imageUrl" value={imageUrl} />

              {imageUrl ? (
                <div className="relative overflow-hidden rounded-lg">
                  <Image
                    src={imageUrl}
                    alt="Property preview"
                    width={800}
                    height={450}
                    className="h-56 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl("");
                      setImageUploadError(null);
                      if (imageInputRef.current) imageInputRef.current.value = "";
                    }}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-nordic/80 text-white transition-colors hover:bg-nordic"
                  >
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  disabled={isUploadingImage}
                  className={`flex w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed py-12 transition-colors ${
                    isDragging
                      ? "border-mosque bg-hint-green/20"
                      : "border-nordic/20 bg-clear-day hover:bg-hint-green/20 dark:border-white/10 dark:bg-white/5 dark:hover:bg-hint-green/10"
                  } disabled:opacity-60`}
                >
                  {isUploadingImage ? (
                    <Loader2 size={28} className="animate-spin text-mosque dark:text-hint-green" />
                  ) : (
                    <Upload size={28} className="text-nordic/40 dark:text-clear-day/40" />
                  )}
                  <span className="text-sm font-medium text-nordic dark:text-clear-day">
                    {isUploadingImage ? "Uploading…" : "Click to upload or drag & drop"}
                  </span>
                  {!isUploadingImage && (
                    <span className="text-xs text-nordic/40 dark:text-clear-day/40">
                      JPG, PNG or WebP — max 5MB
                    </span>
                  )}
                </button>
              )}

              <input
                ref={imageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleImageInputChange}
              />

              {imageUploadError && <p className={errorClass}>{imageUploadError}</p>}
              {state.errors.imageUrl && <p className={errorClass}>{state.errors.imageUrl}</p>}

              <div>
                <label htmlFor="imageAlt" className={labelClass}>
                  Image description
                </label>
                <input
                  id="imageAlt"
                  name="imageAlt"
                  type="text"
                  placeholder="e.g. Front view of the property"
                  defaultValue={property?.imageAlt ?? ""}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-8 xl:col-span-4">
          {/* Location */}
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-white/5 dark:bg-nordic-muted/10">
            <SectionHeader icon={MapPin} title="Location" />
            <div className="space-y-4 p-6">
              <div>
                <label htmlFor="address" className={labelClass}>
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Street address"
                  defaultValue={property?.address ?? ""}
                  className={inputClass}
                />
                {state.errors.address && <p className={errorClass}>{state.errors.address}</p>}
              </div>
              <div>
                <label htmlFor="city" className={labelClass}>
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="City"
                  defaultValue={property?.city ?? ""}
                  className={inputClass}
                />
                {state.errors.city && <p className={errorClass}>{state.errors.city}</p>}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="sticky top-24 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-white/5 dark:bg-nordic-muted/10">
            <SectionHeader icon={Ruler} title="Details" />
            <div className="space-y-6 p-6">
              <div>
                <label htmlFor="sqm" className={labelClass}>
                  Area (m²) <span className="text-red-500">*</span>
                </label>
                <input
                  id="sqm"
                  name="sqm"
                  type="number"
                  min="1"
                  placeholder="0"
                  defaultValue={property?.sqm ?? ""}
                  className={inputClass}
                />
                {state.errors.sqm && <p className={errorClass}>{state.errors.sqm}</p>}
              </div>

              <hr className="border-nordic/5 dark:border-white/5" />

              <div className="space-y-4">
                <Counter label="Bedrooms" icon={BedDouble} value={beds} onChange={setBeds} />
                <Counter label="Bathrooms" icon={Bath} value={baths} onChange={setBaths} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex gap-3 border-t border-gray-200 bg-white p-4 shadow-xl dark:border-white/10 dark:bg-nordic md:hidden">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 rounded-lg border border-nordic/20 py-3 text-sm font-medium text-nordic transition-colors hover:bg-nordic/5 dark:border-white/20 dark:text-clear-day"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 rounded-lg bg-mosque py-3 text-sm font-medium text-white transition-colors hover:bg-nordic disabled:opacity-60 dark:bg-hint-green dark:text-nordic"
        >
          {isPending ? "Saving…" : "Save"}
        </button>
      </div>

      {/* Bottom padding for mobile bar */}
      <div className="h-24 md:hidden" />
    </form>
  );
}
