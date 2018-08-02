import gql from "./utils/gql";
import { fetchData } from "./utils/fetch";

export const getGhToken = code =>
  fetch("/.netlify/functions/gh-token?code=" + code)
    .then(r => r.json())
    .then(({ access_token }) => {
      return access_token;
    });

export const getZeitToken = code =>
  fetch("/.netlify/functions/zeit-token?code=" + code)
    .then(r => r.json())
    .then(({ access_token }) => {
      return access_token;
    });

export const getRepo = ({ token, owner, repoName, branch }) => gql`
  ${token}
  ${{
    owner,
    repoName,
    branchExpression: branch + ":",
    configExpression: branch + ":.forkbox",
    refName: "refs/heads/" + branch
  }}
  ${({ owner }) => owner.repository}
  query(
    $owner: String!
    $repoName: String!
    $branchExpression: String!
    $configExpression: String!
    $refName: String!
  ) {
    owner: repositoryOwner(login: $owner) {
      repository(name: $repoName) {
        owner {
          login
        }
        id
        name
        url
        parent {
          owner {
            login
          }
          url
          id
        }
        ref(qualifiedName: $refName) {
          name
          target {
            oid
          }
        }
        config: object(expression: $configExpression) {
          ... on Tree {
            entries {
              name
              object {
                ... on Blob {
                  text
                }
              }
            }
          }
        }
        object(expression: $branchExpression) {
          sha: oid
          ... on Tree {
            entries {
              sha: oid
              name
              type
              object {
                ... on Blob {
                  byteSize
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const getTree = ({ token, repoId, entrySha }) => gql`
  ${token}
  ${{ repoId, entrySha }}
  ${({ repository }) => repository.object.entries}
  query($repoId: ID!, $entrySha: GitObjectID!) {
    repository: node(id: $repoId) {
      ... on Repository {
        object(oid: $entrySha) {
          ... on Tree {
            entries {
              sha: oid
              name
              type
              object {
                ... on Blob {
                  byteSize
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const getBlobText = ({ token, repoId, entrySha }) => gql`
  ${token}
  ${{ repoId, entrySha }}
  ${({ repository }) => repository.object.text}
  query($repoId: ID!, $entrySha: GitObjectID!) {
    repository: node(id: $repoId) {
      ... on Repository {
        object(oid: $entrySha) {
          ... on Blob {
            text
          }
        }
      }
    }
  }
`;

export const forkRepo = async ({ token, owner, repoName }) => {
  const forkedRepo = await fetchData<{
    node_id: string;
    html_url: string;
    owner: { login: string };
  }>(`https://api.github.com/repos/${owner}/${repoName}/forks`, {
    method: "post",
    headers: new Headers({
      authorization: "Bearer " + token
    })
  });
  console.log("fork", forkedRepo);
  return {
    repoId: forkedRepo.node_id,
    repoUrl: forkedRepo.html_url,
    repoOwner: forkedRepo.owner.login
  };
};

export const createBranch = async ({
  token,
  owner,
  repoName,
  baseSha,
  newBranch
}) => {
  const url = `https://api.github.com/repos/${owner}/${repoName}/git/refs`;

  const result = await fetchData<{}>(url, {
    method: "post",
    body: JSON.stringify({
      ref: "refs/heads/" + newBranch,
      sha: baseSha
    }),
    headers: new Headers({
      authorization: "Bearer " + token
    })
  });

  console.log("newbranch", result);
};

export const deployToZeit = async ({
  token,
  dockerfile,
  repoName,
  repoUrl,
  boxBranch,
  env
}) => {
  const body = {
    public: true,
    name: "forkbox-" + repoName,
    deploymentType: "DOCKER",
    files: [{ file: "Dockerfile", data: dockerfile }],
    config: {
      scale: {
        sfo1: {
          min: 0,
          max: 1 // Should be 0 but Now doesn't support it
        }
      },
      build: {
        env: {
          REPO_URL: repoUrl,
          BRANCH_NAME: boxBranch
        }
      }
    },
    env
  };
  const data = await fetchData<{
    deploymentId: string;
    readyState: string;
    url: string;
  }>("https://api.zeit.co/v3/now/deployments", {
    method: "post",
    body: JSON.stringify(body),
    headers: new Headers({
      authorization: "Bearer " + token
    })
  });
  // {
  //   deploymentId: "afewf",
  //   readyState: "INITIALIZING", // "READY" if it was cached
  //   scale: { sfo1: { min: 0, max: 10 } },
  //   url: "forkbox-react-storybook-demo-eemudfqtcb.now.sh",
  //   warnings: []
  // };

  return data;
};

export const getZeitDeployment = async ({ deploymentId }) => {
  // {
  //   uid: "MaBryFqAOlmQwNZxWeDrVeg5",
  //   host: "forkbox-react-storybook-demo-lslnxmifaw.now.sh",
  //   scale: { min: 0, max: 10, auto: true },
  //   state: "BOOTED",
  //   stateTs: "2018-08-02T19:04:04.215Z"
  // };
  return await fetchData<{ state: string }>(
    "https://api.zeit.co/v2/now/deployments/" + deploymentId
  );
};

function utoa(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}
export const commitContent = async ({
  token,
  owner,
  repoName,
  path,
  content,
  branchName,
  sha
}) => {
  const url = `https://api.github.com/repos/${owner}/${repoName}/contents${path}`;
  const body = {
    path,
    sha,
    branch: branchName,
    content: utoa(content),
    message: `Edit ${path}`
  };
  const data = await fetchData<{
    content: {
      path: string;
      sha: string;
      size: number;
    };
  }>(url, {
    method: "put",
    body: JSON.stringify(body),
    headers: new Headers({ authorization: "Bearer " + token })
  });

  data.content.path = path;

  return data.content;
};
