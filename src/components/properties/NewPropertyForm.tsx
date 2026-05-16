"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createPropertyAction, updatePropertyAction } from "@/server/actions/property.action";
import { Minus, Plus, BedDouble, Bath, Ruler, MapPin, ImageIcon, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Property } from "@prisma/client";
import ImageGalleryUploader from "@/components/properties/ImageGalleryUploader";
import { notify } from "@/lib/toast";

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

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => Number(val) <= 99999999, "El precio máximo es 99.999.999"),
  priceType: z.enum(["sale", "rent"]),
  type: z.enum(["House", "Apartment", "Villa", "Penthouse"]),
  sqm: z
    .string()
    .min(1, "Area is required")
    .refine((val) => Number(val) <= 10000, "El tamaño máximo es 10.000 m²"),
  badge: z.string().optional(),
  description: z
    .string()
    .refine((v) => !v || v.length >= 20, "Minimum 20 characters")
    .refine((v) => !v || v.length <= 1000, "Maximum 1000 characters")
    .optional(),
  imageAlt: z.string().optional(),
  isFeatured: z.boolean().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface NewPropertyFormProps {
  property?: Property;
}

export default function NewPropertyForm({ property }: NewPropertyFormProps) {
  const serverAction = property ? updatePropertyAction : createPropertyAction;
  const [beds, setBeds] = useState(property?.beds ?? 1);
  const [baths, setBaths] = useState(property?.baths ?? 1);
  const [imageUrl, setImageUrl] = useState(property?.imageUrl ?? "");
  const [images, setImages] = useState<string[]>(property?.images ?? []);
  const [imageUrlError, setImageUrlError] = useState<string | undefined>();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: property?.title ?? "",
      address: property?.address ?? "",
      city: property?.city ?? "",
      price: property?.price?.toString() ?? "",
      priceType: (property?.priceType as "sale" | "rent") ?? "sale",
      type: (property?.type as "House" | "Apartment" | "Villa" | "Penthouse") ?? "House",
      sqm: property?.sqm?.toString() ?? "",
      badge: property?.badge ?? "",
      description: property?.description ?? "",
      imageAlt: property?.imageAlt ?? "",
      isFeatured: property?.isFeatured ?? false,
      latitude: property?.latitude?.toString() ?? "",
      longitude: property?.longitude?.toString() ?? "",
    },
  });

  function handleImageUrlChange(url: string) {
    setImageUrl(url);
    if (url) setImageUrlError(undefined);
  }

  async function onSubmit(values: FormValues) {
    if (beds > 20) {
      notify.error("El máximo de habitaciones es 20");
      return;
    }
    if (baths > 20) {
      notify.error("El máximo de baños es 20");
      return;
    }

    if (!imageUrl) {
      setImageUrlError("Please upload a main image");
      return;
    }

    const formData = new FormData();
    formData.set("title", values.title);
    formData.set("address", values.address);
    formData.set("city", values.city);
    formData.set("price", values.price);
    formData.set("priceType", values.priceType);
    formData.set("type", values.type);
    formData.set("sqm", values.sqm);
    formData.set("isFeatured", (values.isFeatured ?? false) ? "on" : "off");
    formData.set("beds", String(beds));
    formData.set("baths", String(baths));
    formData.set("imageUrl", imageUrl);
    formData.set("images", JSON.stringify(images));
    formData.set("imageAlt", values.imageAlt || values.title);
    if (values.badge) formData.set("badge", values.badge);
    if (values.description) formData.set("description", values.description);
    if (values.latitude) formData.set("latitude", values.latitude);
    if (values.longitude) formData.set("longitude", values.longitude);
    if (property) formData.set("propertyId", property.id);

    try {
      const result = await serverAction(undefined, formData);
      if ("redirectTo" in result) {
        notify.success(property ? "Property updated!" : "Property created!");
        router.push(result.redirectTo);
        return;
      }
      Object.entries(result.errors).forEach(([key, message]) => {
        if (key === "imageUrl") {
          setImageUrlError(message);
        } else {
          setError(key as keyof FormValues, { message });
        }
      });
    } catch {
      setError("root", { message: "Something went wrong. Please try again." });
    }
  }

  return (
    <form id="new-property-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-12">
        {/* Left column */}
        <div className="space-y-8 xl:col-span-8">
          {/* Basic Information */}
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-white/5 dark:bg-nordic-muted/10">
            <SectionHeader icon={Info} title="Basic Information" />
            <div className="space-y-6 p-8">
              {errors.root && <p className={errorClass}>{errors.root.message}</p>}

              <div>
                <label htmlFor="title" className={labelClass}>
                  Property Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="e.g. Modern Penthouse with Ocean View"
                  className={inputClass}
                  {...register("title")}
                />
                {errors.title && <p className={errorClass}>{errors.title.message}</p>}
              </div>

              <div>
                <label htmlFor="description" className={labelClass}>
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  placeholder="Describe the property in detail — location highlights, finishes, amenities…"
                  className={inputClass + " resize-none"}
                  {...register("description")}
                />
                {errors.description && <p className={errorClass}>{errors.description.message}</p>}
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
                      type="number"
                      min="0"
                      placeholder="0"
                      className={inputClass + " pl-7"}
                      {...register("price")}
                    />
                  </div>
                  {errors.price && <p className={errorClass}>{errors.price.message}</p>}
                </div>

                <div>
                  <label htmlFor="priceType" className={labelClass}>
                    Listing Type
                  </label>
                  <select id="priceType" className={selectClass} {...register("priceType")}>
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="type" className={labelClass}>
                    Property Type
                  </label>
                  <select id="type" className={selectClass} {...register("type")}>
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
                  <select id="badge" className={selectClass} {...register("badge")}>
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
                      className="h-4 w-4 rounded border-gray-300 text-mosque focus:ring-mosque"
                      {...register("isFeatured")}
                    />
                    <span className="text-sm font-medium text-nordic dark:text-clear-day">
                      Featured property
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-white/5 dark:bg-nordic-muted/10">
            <SectionHeader icon={ImageIcon} title="Photos" />
            <div className="space-y-4 p-8">
              <ImageGalleryUploader
                imageUrl={imageUrl}
                images={images}
                onImageUrlChange={handleImageUrlChange}
                onImagesChange={setImages}
                imageUrlError={imageUrlError}
              />
              <div>
                <label htmlFor="imageAlt" className={labelClass}>
                  Main image description
                </label>
                <input
                  id="imageAlt"
                  type="text"
                  placeholder="e.g. Front view of the property"
                  className={inputClass}
                  {...register("imageAlt")}
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
                  type="text"
                  placeholder="Street address"
                  className={inputClass}
                  {...register("address")}
                />
                {errors.address && <p className={errorClass}>{errors.address.message}</p>}
              </div>
              <div>
                <label htmlFor="city" className={labelClass}>
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  id="city"
                  type="text"
                  placeholder="City"
                  className={inputClass}
                  {...register("city")}
                />
                {errors.city && <p className={errorClass}>{errors.city.message}</p>}
              </div>
              <div>
                <p className={labelClass}>
                  Coordinates{" "}
                  <span className="font-normal text-nordic/40 dark:text-clear-day/40">
                    (optional)
                  </span>
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      id="latitude"
                      type="number"
                      step="any"
                      placeholder="40.4168"
                      className={inputClass}
                      {...register("latitude")}
                    />
                    {errors.latitude && <p className={errorClass}>{errors.latitude.message}</p>}
                    <p className="mt-1 text-xs text-nordic/40 dark:text-clear-day/40">Latitude</p>
                  </div>
                  <div>
                    <input
                      id="longitude"
                      type="number"
                      step="any"
                      placeholder="-3.7038"
                      className={inputClass}
                      {...register("longitude")}
                    />
                    {errors.longitude && <p className={errorClass}>{errors.longitude.message}</p>}
                    <p className="mt-1 text-xs text-nordic/40 dark:text-clear-day/40">Longitude</p>
                  </div>
                </div>
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
                  type="number"
                  min="1"
                  placeholder="0"
                  className={inputClass}
                  {...register("sqm")}
                />
                {errors.sqm && <p className={errorClass}>{errors.sqm.message}</p>}
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
          disabled={isSubmitting}
          className="flex-1 rounded-lg bg-mosque py-3 text-sm font-medium text-white transition-colors hover:bg-nordic disabled:opacity-60 dark:bg-hint-green dark:text-nordic"
        >
          {isSubmitting ? "Saving…" : "Save"}
        </button>
      </div>

      <div className="h-24 md:hidden" />
    </form>
  );
}
