import fluxify from "./utils/fluxify";

type Path = string;
type Sha = string;

interface Entry {
  path: string;
  name: string;
  sha: Sha;
  isDirty: boolean;
  collapsed: boolean;
  loaded: boolean;
  isSelected: boolean;
}

interface State {
  repoId?: string;
  repoName?: string;
  repoUrl?: string;
  dockerfile?: string;
  selectedBlob?: Path;
  isConnectingZeit?: boolean;
  deployment: object;
  tree: { [x: string]: string[] };
  entries: { [x: string]: Entry };
  texts: { [x: string]: string };
}

let initialState: State = { tree: {}, texts: {}, entries: {}, deployment: {} };

export const { actions, reducer } = fluxify(initialState, {
  receiveRepo(state, { object, config, id, name, url }) {
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
  receiveTree(state, { path, entries }) {
    const entryList = mapEntries(path, entries);
    state.tree[path] = entryList.map(e => e.path);
    for (const entry of entryList) {
      state.entries[entry.path] = entry;
    }
  },
  toggleTree(state, { path }) {
    const entry = state.entries[path];
    entry.collapsed = !entry.collapsed;
    entry.loaded = true;
  },
  selectBlob(state, { path }) {
    if (state.selectedBlob === path) return;

    if (state.selectedBlob) {
      state.entries[state.selectedBlob].isSelected = false;
    }
    state.entries[path].isSelected = true;
    state.selectedBlob = path;
  },
  receiveBlobText(state, { path, text }) {
    state.texts[path] = text;
  },
  editText(state, { path, text }) {
    state.texts[path] = text;
    state.entries[path].isDirty = true;
  },
  connectingToZeit(state) {
    state.isConnectingZeit = true;
  },
  receiveDeployment(state, deployment: object) {
    state.deployment = deployment;
  }
});

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