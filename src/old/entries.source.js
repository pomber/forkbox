export const storeRootEntry = (sha, cache) => {
  const rootEntry = {
    path: "/",
    isTree: true,
    name: "",
    sha: sha,
    type: "tree"
  };
  cache.set("entry" + rootEntry.path, rootEntry);
};

export const storeEntries = (path, ghEntries, cache) => {
  const entries = mapEntries(path, ghEntries);
  entries.forEach(entry => {
    cache.set("entry" + entry.path, entry);
  });
  cache.set("tree" + path, entries.map(entry => entry.path));
};

export default path => ({
  hash: () => "tree" + path,
  fetch: cache => {
    console.log("fetch", path);
    const token = cache.getFromSource(sources.ghToken());
    const repoId = cache.getByKey("repo").id;
    const entryId = cache.getByKey("entry" + path).sha;
    return fetchers.getTree({ token, repoId, entryId });
  },
  store: (ghEntries, cache) => storeEntries(path, ghEntries, cache),
  view: cache => {
    const paths = cache.getByKey("tree" + path);
    return paths.map(childPath => cache.getByKey("entry" + childPath));
  }
});

const getKey = (type, vars) => {
  switch (type) {
    case TREE:
    case ENTRY:
      return type + vars.path;
    case REPO:
      return type;
    default:
      return type + vars;
  }
};

const aSource = {
  fetch: (vars, cache) => fetch(vars.url),
  store: (vars, result, cache) => {
    const { a, b } = result;
    bSource.store({ key: vars.bKey }, b, cache);
    cache.write(vars.aKey, a);
  },
  view: (vars, cache) => cache.readOrUndefined(vars.aKey)
};

const bSource = {
  fetch: (vars, cache) => {
    const token = cache.readWaitOrFail(GH_TOKEN);
    const repo = cache.readOrFetch(REPO);
    return fetch(repo.url + vars.path);
  },
  store: (vars, result, cache) => {
    cache.write(ENTRY, vars, result);
    // or
    const key = getKey(ENTRY, vars);
    cache.write(key, result);
  },
  view: cache => null
};
