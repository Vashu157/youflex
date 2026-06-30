"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function DebouncedSearchInput({
  initialQuery = "",
  placeholder,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const trimmedValue = value.trim();
      const nextUrl = trimmedValue
        ? `${pathname}?q=${encodeURIComponent(trimmedValue)}`
        : pathname;

      startTransition(() => {
        router.replace(nextUrl);
      });
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [pathname, router, startTransition, value]);

  return (
    <div className="rounded-[2rem] border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
        Search
      </label>
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className="mt-3 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 outline-none transition focus:border-orange-400 focus:bg-white dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      />
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        {isPending ? "Searching..." : "Results update as you type."}
      </p>
    </div>
  );
}
