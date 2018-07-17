import pathToRegexp from "path-to-regexp";

const zeitPath = pathToRegexp("/zeit-callback/");
const ghRewrite = pathToRegexp("/gh-callback/:path*");

const router = {
  rewriteUrl() {
    const { pathname } = location;

    const isZeitCallback = zeitPath.exec(pathname);

    if (isZeitCallback) {
      const newPath = new URLSearchParams(location.search).get("state");
      window.history.replaceState(null, null, newPath);
    } else {
      const matches = ghRewrite.exec(pathname);
      if (matches) {
        const [_, newPath] = matches;
        window.history.replaceState(null, null, "/" + newPath);
      }
    }
  },
  rewriteBoxUrl(owner, repoName, branch) {
    const newPath = `/x/${owner}/${repoName}/${branch}`;
    window.history.replaceState(null, null, newPath);
  },
  redirectToGhAuth() {
    location.href = `https://github.com/login/oauth/authorize?scope=public_repo&client_id=${
      process.env.GH_CLIENT_ID
    }&redirect_uri=${location.origin}/gh-callback${location.pathname}`;
  },
  redirectToZeitAuth() {
    location.href = `https://zeit.co/oauth/authorize?client_id=${
      process.env.ZEIT_CLIENT_ID
    }&state=${location.pathname}`;
  }
};
export default router;
