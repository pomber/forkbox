const cache = {};

function getRepository(owner, repoName, branch) {
  return cache.readOrFetch(REPO, { owner, repoName, branch });
}

function getTree(path) {
  return cache.readOrFetch(TREE, { path });
}

function getEntry(path) {
  return cache.readOrFetch(ENTRY, { path });
}

function commit(path, content) {
  return cache.write(COMMMIT, { path, content });
}

function fork(owner, repoName) {
  return cache.write(FORK, { owner, repoName });
}
