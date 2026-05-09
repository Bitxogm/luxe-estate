export type PropertyStatus = "FOR SALE" | "FOR RENT";
export type PropertyType = "House" | "Apartment" | "Villa" | "Penthouse";
export type PropertyBadge = "Exclusive" | "New Arrival" | "Price Drop";

export interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  price: number;
  priceType: "sale" | "rent";
  beds: number;
  baths: number;
  sqm: number;
  type: PropertyType;
  status: PropertyStatus;
  imageUrl: string;
  imageAlt: string;
}

export interface FeaturedProperty extends Property {
  badge: PropertyBadge;
}
