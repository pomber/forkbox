import gql from "./utils/gql";

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

export const getGhToken = code =>
  fetch("/.netlify/functions/gh-token?code=" + code)
    .then(r => r.json())
    .then(({ access_token }) => {
      return access_token;
    });
