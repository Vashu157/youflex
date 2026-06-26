export async function getCodeforcesProfile(handle) {
  if (!handle) return null;

  try {
    const res = await fetch(
      `https://codeforces.com/api/user.info?handles=${handle}`,
      {
        next: { revalidate: 3600 }, // cache for 1 hour in Next.js
      }
    );

    const data = await res.json();

    if (data.status !== "OK" || !data.result?.length) {
      return null;
    }

    const user = data.result[0];

    return {
      handle: user.handle ?? null,
      rank: user.rank ?? null,
      rating: user.rating ?? null,
      maxRank: user.maxRank ?? null,
      maxRating: user.maxRating ?? null,
      avatar: user.avatar ?? null,
      titlePhoto: user.titlePhoto ?? null,
      contribution: user.contribution ?? 0,
      friendOfCount: user.friendOfCount ?? 0,
      lastOnlineTimeSeconds: user.lastOnlineTimeSeconds ?? null,
      registrationTimeSeconds: user.registrationTimeSeconds ?? null,
    };
  } catch (error) {
    console.error("Codeforces fetch failed:", error);
    return null;
  }
}