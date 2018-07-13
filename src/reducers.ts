import fluxify from "./utils/fluxify";

type Path = string;
type Sha = string;
type Entry = object;

interface State {
  repoId: string;
  repoName: string;
  repoUrl: string;
  dockerfile: string;
  selectedBlob: Path;
  isConnectingZeit: boolean;
  deployment: string;
  tree: object;
  entries: object;
  texts: object;
}

export const { actions, reducer } = fluxify(
  { tree: {}, texts: {}, entries: {}, deployment: {} },
  {
    receiveRepo(state: State, { object, config, id, name, url }) {
      const entryList = mapEntries("/", object.entries);
      const dockerfileEntry = config.entries.find(
        e => e.name === "dev.dockerfile"
      );

      state.repoId = id;
      state.repoName = name;
      state.repoUrl = url;
      state.dockerfile = dockerfileEntry && dockerfileEntry.object.text;
      state.tree["/"] = entryList.map(e => e.path);
      for (const entry of entryList) {
        state.entries[entry.path] = entry;
      }
    },
    receiveTree(state: State, { path, entries }) {
      const entryList = mapEntries(path, entries);
      state.tree[path] = entryList.map(e => e.path);
      for (const entry of entryList) {
        state.entries[entry.path] = entry;
      }
    },
    toggleTree(state: State, { path }) {
      const entry = state.entries[path];
      entry.collapsed = !entry.collapsed;
      entry.loaded = true;
    },
    selectBlob(state: State, { path }) {
      if (state.selectedBlob === path) return;

      if (state.selectedBlob) {
        state.entries[state.selectedBlob].isSelected = false;
      }
      state.entries[path].isSelected = true;
      state.selectedBlob = path;
    },
    receiveBlobText(state: State, { path, text }) {
      state.texts[path] = text;
    },
    editText(state: State, { path, text }) {
      state.texts[path] = text;
      state.entries[path].isDirty = true;
    },
    connectingToZeit(state: State) {
      state.isConnectingZeit = true;
    },
    receiveDeployment(state: State, deployment) {
      state.deployment = deployment;
    }
  }
);

// Utils

const entryValue = e => (e.isTree ? "0" + e.name : "1" + e.name);
const entryComparer = (a, b) => entryValue(a).localeCompare(entryValue(b));
const mapEntries = (parentPath, entries) =>
  entries
    .map(entry => ({
      ...entry,
      byteSize: entry.object && entry.object.byteSize,
      isTree: entry.type === "tree",
      path: `${parentPath}${entry.name}${entry.type === "tree" ? "/" : ""}`,
      collapsed: true
    }))
    .sort(entryComparer);
