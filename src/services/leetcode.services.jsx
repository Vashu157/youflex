import { LeetCode } from "leetcode-query";

const leetcode = new LeetCode();

export async function getLeetCodeProfile(username) {
  if (!username) return null;

  try {
    const user = await leetcode.user(username);

    return {
      username: user.username ?? username,
      avatar: user.avatar ?? null,
      ranking: user.ranking ?? null,
      reputation: user.reputation ?? null,
      solved: {
        easy: user.matchedUserStats?.acSubmissionNum?.find(
          item => item.difficulty === "Easy"
        )?.count ?? 0,
        medium: user.matchedUserStats?.acSubmissionNum?.find(
          item => item.difficulty === "Medium"
        )?.count ?? 0,
        hard: user.matchedUserStats?.acSubmissionNum?.find(
          item => item.difficulty === "Hard"
        )?.count ?? 0,
      },
      recentSubmissions: user.recentSubmissionList ?? [],
    };
  } catch (error) {
    console.error("LeetCode fetch failed:", error);
    return null;
  }
}