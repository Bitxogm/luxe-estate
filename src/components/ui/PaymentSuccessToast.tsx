"use client";

import { useEffect } from "react";
import { notify } from "@/lib/toast";

interface Props {
  message: string;
}

export default function PaymentSuccessToast({ message }: Props) {
  useEffect(() => {
    notify.success(message);
  }, [message]);

  return null;
}
