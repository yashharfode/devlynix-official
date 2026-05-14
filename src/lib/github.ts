export const fetchGithubProfile = async (username: string) => {
  try {
    const res = await fetch(`https://api.github.com/users/${username}`);
    if (!res.ok) throw new Error("Failed to fetch user");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchGithubRepos = async (username: string) => {
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
    if (!res.ok) throw new Error("Failed to fetch repos");
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const extractUsernameFromUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    const pathParts = parsed.pathname.split('/').filter(Boolean);
    return pathParts[0] || url.replace('@', '');
  } catch (e) {
    // If it's not a full URL, maybe they just typed their username
    return url.replace('@', '').replace('github.com/', '');
  }
};
