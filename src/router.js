import pathToRegexp from "path-to-regexp";

const forkPath = pathToRegexp("/f/:repoOwner/:repoName/:branch*");
const ghPath = pathToRegexp("/gh-callback/f/:repoOwner/:repoName/:branch*");

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
    return;
  }
};
