import gql from "./utils/gql";

export const getGhToken = code =>
  fetch("/.netlify/functions/gh-token?code=" + code)
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
