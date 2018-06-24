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

export const getTree = ({ token, repoId, entryId }) => gql`
  ${token}
  ${{ repoId, entryId }}
  ${({ repository }) => repository.object.entries}
  query($repoId: ID!, $entryId: GitObjectID!) {
    repository: node(id: $repoId) {
      ... on Repository {
        object(oid: $entryId) {
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

export const getRepo = ({ token, user, repoName, boxId }) => gql`
  ${token}
  ${{ user, repoName, branchExpression: "devbox-" + boxId + ":" }}
  ${({ user }) => user.repository}
  query($user: String!, $repoName: String!, $branchExpression: String!) {
    user(login: $user) {
      repository(name: $repoName) {
        id
        url
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

export const getBlobText = ({ token, repoId, entryId }) => gql`
  ${token}
  ${{ repoId, entryId }}
  ${({ repository }) => repository.object.text}
  query($repoId: ID!, $entryId: GitObjectID!) {
    repository: node(id: $repoId) {
      ... on Repository {
        object(oid: $entryId) {
          ... on Blob {
            text
          }
        }
      }
    }
  }
`;

function utoa(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}

export const commitBlobText = async ({
  token,
  user,
  repoName,
  branchName,
  path,
  text,
  sha
}) => {
  const url = `https://api.github.com/repos/${user}/${repoName}/contents${path}`;
  const body = {
    path,
    sha,
    branch: branchName,
    content: utoa(text),
    message: `Edit ${path}`
  };

  const response = await fetch(url, {
    method: "put",
    body: JSON.stringify(body),
    headers: new Headers({ authorization: "Bearer " + token })
  });

  const data = await response.json();
  console.log("updateblob", data);

  return {
    sha: data.content.sha,
    byteSize: data.content.size
  };
};
