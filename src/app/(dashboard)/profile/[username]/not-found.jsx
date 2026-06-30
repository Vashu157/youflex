import Link from "next/link";

export default function PublicProfileNotFound() {
  return (
    <div className="mx-auto max-w-2xl rounded-[2rem] border border-zinc-200 bg-white px-6 py-16 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h1 className="text-3xl font-bold text-zinc-950 dark:text-zinc-50">
        Profile not found
      </h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-300">
        That username does not have a public profile here.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 inline-flex rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
