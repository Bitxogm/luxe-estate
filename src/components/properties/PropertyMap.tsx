"use client";

import { useEffect, useRef, useId } from "react";
import type { Map } from "leaflet";

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  address: string;
}

export default function PropertyMap({ latitude, longitude, address }: PropertyMapProps) {
  const rawId = useId();
  const mapId = `map-${rawId.replace(/:/g, "")}`;
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function initMap() {
      await import("leaflet/dist/leaflet.css");
      const L = (await import("leaflet")).default;
      const { maptilerLayer } = await import("@maptiler/leaflet-maptilersdk");

      if (cancelled) return;

      const container = document.getElementById(mapId);
      if (!container) return;

      mapRef.current = L.map(container).setView([latitude, longitude], 15);

      maptilerLayer({
        apiKey: process.env.NEXT_PUBLIC_MAPTILER_KEY ?? "",
        style: "streets-v2",
      }).addTo(mapRef.current);

      L.marker([latitude, longitude]).addTo(mapRef.current).bindPopup(address).openPopup();
    }

    initMap();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [latitude, longitude, address, mapId]);

  return <div id={mapId} className="h-64 w-full overflow-hidden rounded-lg md:h-80" />;
}
