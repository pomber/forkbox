import pathToRegexp from "path-to-regexp";

const forkPath = pathToRegexp("/f/:repoOwner/:repoName/:branch*");
const ghPath = pathToRegexp("/gh-callback/f/:repoOwner/:repoName/:branch*");
const zeitPath = pathToRegexp("/zeit-callback/");
const ghRewrite = pathToRegexp("/gh-callback/:path*");

//http://localhost:3000/zeit-callback/?code=PTQX0SCtHUwoA6ZzyKTTcInA&state=%2Ff%2Fforkboxlabs%2Freact-storybook-demo

export default {
  parseUrl() {
    let { pathname } = location;

    const isZeitCallback = zeitPath.exec(pathname);
    if (isZeitCallback) {
      pathname = new URLSearchParams(location.search).get("state");
    }

    const [_, repoOwner, repoName, baseBranch] =
      ghPath.exec(pathname) || forkPath.exec(pathname);

    const code = new URLSearchParams(location.search).get("code");

    return {
      repoOwner,
      repoName,
      baseBranch: baseBranch || "master",
      ghCode: !isZeitCallback && code,
      zeitCode: isZeitCallback && code
    };
  },
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
