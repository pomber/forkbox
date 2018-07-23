import { fetchData } from "./utils/fetch";
import fluxify from "./utils/fluxify";
// import fluxify from "./utils/fluxify";

declare const process: { readonly env: Record<string, string> };
let ghPromise = null;
let zeitPromise = null;

interface TokenStore {
  hasGithubToken: boolean;
  hasZeitToken: boolean;
}

const { actions, reducer } = fluxify(
  {
    hasGithubToken: !!localStorage["gh-token"],
    hasZeitToken: !!localStorage["zeit-token"]
  },
  {
    receiveGithubToken(state) {
      state.hasGithubToken = true;
    },
    receiveZeitToken(state) {
      state.hasZeitToken = true;
    }
  }
);

export default reducer;

export const fetchGithubToken = code => dispatch => {
  ghPromise = fetchData<{ access_token: string }>(
    "/.netlify/functions/gh-token?code=" + code
  ).then(({ access_token }) => {
    localStorage["gh-token"] = access_token;
    dispatch(actions.receiveGithubToken());
    return localStorage["gh-token"];
  });
};

export const fetchZeitToken = code => dispatch => {
  zeitPromise = fetchData<{ access_token: string }>(
    "/.netlify/functions/zeit-token?code=" + code
  ).then(({ access_token }) => {
    localStorage["zeit-token"] = access_token;
    dispatch(actions.receiveZeitToken());
    return localStorage["zeit-token"];
  });
};

export const getGithubToken = async (): Promise<string> | never => {
  if (localStorage["gh-token"]) {
    return localStorage["gh-token"];
  }

  if (ghPromise) {
    return await ghPromise;
  }

  location.href = `https://github.com/login/oauth/authorize?scope=public_repo&client_id=${
    process.env.GH_CLIENT_ID
  }&redirect_uri=${location.origin}/gh-callback${location.pathname}`;
};

export const getZeitToken = async (): Promise<string> | never => {
  if (localStorage["zeit-token"]) {
    return localStorage["zeit-token"];
  }

  if (zeitPromise) {
    return await zeitPromise;
  }

  location.href = `https://zeit.co/oauth/authorize?client_id=${
    process.env.ZEIT_CLIENT_ID
  }&state=${location.pathname}`;
};
