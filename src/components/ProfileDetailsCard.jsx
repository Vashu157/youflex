/* eslint-disable @next/next/no-img-element */
import { formatProfileLinkLabel } from "@/lib/profile.utils";
import Image from "next/image";

function formatJoinedDate(value) {
  if (!value) {
    return "Unknown";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function DetailRow({ label, value, href }) {
  if (!value) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-card-border bg-card-bg/50 backdrop-blur-sm p-5 transition-colors hover:bg-card-bg hover:shadow-sm">
      <dt className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-2 text-sm text-foreground font-semibold break-words">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:text-primary-hover transition-colors underline-offset-4 hover:underline"
          >
            {formatProfileLinkLabel(value)}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

export default function ProfileDetailsCard({ profile }) {
  const socialLinks = [
    { label: "GitHub", value: profile.githubUrl },
    { label: "LeetCode", value: profile.leetcodeUsername },
    { label: "Codeforces", value: profile.codeforcesUsername },
    { label: "LinkedIn", value: profile.linkedinUrl },
    { label: "Replit", value: profile.replitUrl },
    { label: "Website", value: profile.websiteUrl },
  ].filter((item) => item.value);

  return (
    <section className="overflow-hidden rounded-[2rem] glass-card">
      <div className="bg-gradient-to-r from-primary via-orange-500 to-amber-400 px-6 py-12" />

      <div className="px-8 pb-8">
        <div className="-mt-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex items-end gap-5">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-card-bg bg-primary/10 text-4xl font-bold text-primary shadow-md relative group">
              {profile.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt={`${profile.fullName}'s avatar`}
                  width={112}
                  height={112}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                profile.fullName?.[0]?.toUpperCase() || "U"
              )}
            </div>

            <div className="pb-3">
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                Public profile
              </p>
              <h1 className="mt-1 text-3xl font-extrabold text-foreground tracking-tight">
                {profile.fullName}
              </h1>
              <p className="text-sm font-medium text-muted-foreground">
                @{profile.username}
              </p>
            </div>
          </div>

          <div className="rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary shadow-sm backdrop-blur-md mb-3 md:mb-0">
            Joined {formatJoinedDate(profile.joinedAt)}
          </div>
        </div>

        {profile.headline ? (
          <p className="mt-8 text-xl font-medium text-foreground">
            {profile.headline}
          </p>
        ) : null}

        {profile.bio ? (
          <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
            {profile.bio}
          </p>
        ) : null}

        <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DetailRow label="Domain" value={profile.domain} />
          <DetailRow label="GitHub" value={profile.githubUrl} href={profile.githubUrl} />
          <DetailRow
            label="LeetCode"
            value={profile.leetcodeUsername}
            href={profile.leetcodeUsername}
          />
          <DetailRow
            label="Codeforces"
            value={profile.codeforcesUsername}
            href={profile.codeforcesUsername}
          />
          <DetailRow
            label="LinkedIn"
            value={profile.linkedinUrl}
            href={profile.linkedinUrl}
          />
          <DetailRow label="Replit" value={profile.replitUrl} href={profile.replitUrl} />
          <DetailRow label="Website" value={profile.websiteUrl} href={profile.websiteUrl} />
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          {socialLinks.length ? (
            socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.value}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-card-border bg-card-bg/50 px-5 py-2 text-sm font-semibold text-muted-foreground transition-all hover:border-primary hover:bg-primary hover:text-white hover:shadow-md"
              >
                {item.label}
              </a>
            ))
          ) : (
            <p className="text-sm italic text-muted-foreground">
              No public links added yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
