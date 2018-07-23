import { initBox, initNewBox } from "./dispatchers";
import { bind } from "./utils/routux";
import { loadGithubToken, loadZeitToken } from "./token-store";

enum Path {
  NewBox,
  Box,
  GhCallback,
  ZeitCallback
}

const entrypoints = {
  [Path.NewBox]: {
    pattern: "/f/:baseRepoOwner/:repoName/:baseBranchName*",
    dispatcher: initNewBox
  },
  [Path.Box]: {
    pattern: "/x/:forkedRepoOwner/:repoName/:boxBranchName/:baseBranchName*",
    dispatcher: initBox
  },
  [Path.GhCallback]: {
    pattern: "/gh-callback/:_path*?code=:ghCode",
    dispatcher: loadGithubToken
  },
  [Path.ZeitCallback]: {
    pattern: "/zeit-callback/*?code=:zeitCode&state=:_path",
    dispatcher: loadZeitToken
  }
};

export const bindRouter = store => {
  bind(store, entrypoints, state => {
    const {
      baseRepoOwner,
      forkedRepoOwner,
      repoName,
      boxBranchName,
      baseBranchName
    } = state;
    if (boxBranchName) {
      return {
        pathName: Path.Box,
        params: {
          forkedRepoOwner,
          repoName,
          boxBranchName,
          baseBranchName
        }
      };
    } else if (repoName) {
      return {
        pathName: Path.NewBox,
        params: {
          baseRepoOwner,
          repoName,
          baseBranchName
        }
      };
    } else {
      return null;
      // throw new Error("Why we don't have a repoName in the redux store?");
    }
  });
};
