"use client";

import dynamic from "next/dynamic";

const PropertyMap = dynamic(() => import("./PropertyMap"), { ssr: false });

interface Props {
  latitude: number;
  longitude: number;
  address: string;
}

export default function PropertyMapWrapper(props: Props) {
  return <PropertyMap {...props} />;
}
