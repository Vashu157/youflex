export const fetchGithub = async (githubLink) => {
  try {
    const response = await fetch(githubLink);
    const data = await response.json();

    return {
      username: data.login,
      avatar: data.avatar_url,
      publicRepos: data.public_repos,
      createdAt: data.created_at,
      name: data.name,
      bio: data.bio,
    };
  } catch (err) {
    console.error("Error fetching GitHub data:", err.message);
    throw err;
  }
};
