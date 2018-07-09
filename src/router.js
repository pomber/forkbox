import pathToRegexp from "path-to-regexp";

const forkPath = pathToRegexp("/f/:repoOwner/:repoName/:branch*");
const ghPath = pathToRegexp("/gh-callback/f/:repoOwner/:repoName/:branch*");
const ghRewrite = pathToRegexp("/gh-callback/:path*");

export default {
  parseUrl() {
    const { pathname } = location;

    const [_, repoOwner, repoName, baseBranch] =
      ghPath.exec(pathname) || forkPath.exec(pathname);

    const ghCode = new URLSearchParams(location.search).get("code");

    return {
      repoOwner,
      repoName,
      baseBranch: baseBranch || "master",
      ghCode
    };
  },
  rewriteUrl() {
    const { pathname } = location;
    const matches = ghRewrite.exec(pathname);
    if (matches) {
      const [_, newPath] = matches;
      window.history.replaceState(null, null, "/" + newPath);
    }
  },
  redirectToGhAuth() {
    location.href = `https://github.com/login/oauth/authorize?scope=public_repo&client_id=${
      process.env.GH_CLIENT_ID
    }&redirect_uri=${location.origin}/gh-callback${location.pathname}`;
  }
};
