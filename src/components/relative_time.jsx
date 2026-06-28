"use client";

import { useSyncExternalStore } from "react";

const DAY_IN_MS = 1000 * 60 * 60 * 24;

function formatRelativeTime(value) {
  const timestamp = new Date(value).getTime();

  if (Number.isNaN(timestamp)) {
    return "";
  }

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const daysDifference = Math.round((timestamp - Date.now()) / DAY_IN_MS);

  return formatter.format(daysDifference, "day");
}

export default function RelativeTime({ value, fallback, dateTime }) {
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const label = isHydrated ? formatRelativeTime(value) || fallback : fallback;

  return (
    <time dateTime={dateTime} suppressHydrationWarning>
      {label}
    </time>
  );
}
