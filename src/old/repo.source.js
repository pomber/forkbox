import { storeRootEntry, storeEntries } from "./entries.source";

export default (user, repoName, branch) => ({
  hash: () => "repo",
  fetch: cache => {
    console.log("fetch", repoName);
    const token = cache.getFromSource(sources.ghToken());
    return fetchers.getRepo({ token, user, repoName, branch });
  },
  store: (repoInfo, cache) => {
    storeRootEntry(repoInfo.object.sha, cache);
    storeEntries("/", repoInfo.object.entries, cache);

    cache.set("repo", {
      id: repoInfo.id,
      user,
      name: repoName,
      branch,
      url: repoInfo.url
    });
  },
  view: cache => {
    const { user, name, boxId, url } = cache.getByKey("repo");
    return {
      user,
      repoName: name,
      repoUrl: url,
      branchName: getBranchName(boxId),
      saveText: (path, text) => {
        if (text != null) {
          cache.write(sources.blobText(path), text);
        }
      }
    };
  }
});
