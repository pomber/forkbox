import gql from "./utils/gql";

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
    configExpression: branch + ":.forkbox"
  }}
  ${({ owner }) => owner.repository}
  query(
    $owner: String!
    $repoName: String!
    $branchExpression: String!
    $configExpression: String!
  ) {
    owner: repositoryOwner(login: $owner) {
      repository(name: $repoName) {
        id
        name
        url
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

export const deployToZeit = async ({
  token,
  dockerfile,
  repoName,
  repoUrl,
  boxBranch
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
          REPO_URL: repoUrl, //TODO set forked repoUrl
          BRANCH_NAME: "master" //TODO set boxBranch
        }
      }
    }
  };
  const response = await fetch("https://api.zeit.co/v3/now/deployments", {
    method: "post",
    body: JSON.stringify(body),
    headers: new Headers({
      authorization: "Bearer " + token
    })
  });

  const data = await response.json();
  // {
  //   deploymentId: "afewf",
  //   readyState: "INITIALIZING", // "READY" if it was cached
  //   scale: {},
  //   url: "forkbox-react-storybook-demo-eemudfqtcb.now.sh",
  //   warnings: []
  // };

  return data;
};

export const getZeitDeployment = async ({ deploymentId }) => {
  const response = fetch(
    "https://api.zeit.co/v2/now/deployments/" + deploymentId
  );
  console.log(response);
};

export const stopZeitDeployment = async ({ token, deploymentId }) => {
  const response = await fetch(
    `https://api.zeit.co/v1/now/deployments/${deploymentId}/instances`,
    {
      method: "post",
      body: JSON.stringify({ min: 0, max: 0 }),
      headers: new Headers({
        authorization: "Bearer " + token
      })
    }
  );
  console.log("stop", response);
};
