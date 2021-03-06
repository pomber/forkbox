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

interface Command {
  name: string;
  env?: Record<string, string>;
  dockerfile: string;
}

interface State {
  isHome?: boolean;
  repoName?: string;
  baseRepoId?: string;
  baseRepoUrl?: string;
  baseRepoOwner?: string;
  baseBranchSha?: string;
  baseBranchName?: string;

  forkedRepoId?: string;
  forkedRepoUrl?: string;
  forkedRepoOwner?: string;
  boxBranchName?: string;

  config: { commands?: Command[] };
  deployment: object;

  selectedBlob?: Path;
  tree: Record<string, string[]>;
  entries: Record<string, Entry>;
  texts: Record<string, string>;
}

let initialState: State = {
  tree: {},
  texts: {},
  entries: {},
  deployment: {},
  config: {}
};

export const { actions, reducer } = fluxify(initialState, {
  initHome(state) {
    state.isHome = true;
  },
  initForkedRepo(state, { object, ref, config, id, name, url, owner, parent }) {
    const entryList = mapEntries("/", object.entries);

    const configFile = JSON.parse(
      config.entries.find(e => e.name === "config.json").object.text
    );

    const newConfig = {
      commands: configFile.commands.map(command => ({
        name: command.name,
        env: command.env || {},
        dockerfile: command.dockerhub
          ? `FROM ${command.dockerhub}`
          : config.entries.find(
              e => e.name === (command.dockerfile || "dev.dockerfile")
            ).object.text
      }))
    };

    state.forkedRepoId = id;
    state.forkedRepoOwner = owner.login;
    state.forkedRepoUrl = url;
    state.baseBranchSha = ref.target.oid;

    state.repoName = name;
    // FIX the base repo isn't always the parent
    state.baseRepoId = parent ? parent.id : id;
    state.baseRepoUrl = parent ? parent.url : url;
    state.baseRepoOwner = parent ? parent.owner.login : owner.login;

    state.config = newConfig;
    state.tree["/"] = entryList.map(e => e.path);
    for (const entry of entryList) {
      state.entries[entry.path] = entry;
    }
  },
  receiveRepo(state, { object, ref, config, id, name, url, owner }) {
    const entryList = mapEntries("/", object.entries);

    const configFile = JSON.parse(
      config.entries.find(e => e.name === "config.json").object.text
    );

    const newConfig = {
      commands: configFile.commands.map(command => ({
        name: command.name,
        env: command.env || {},
        dockerfile: command.dockerhub
          ? `FROM ${command.dockerhub}`
          : config.entries.find(
              e => e.name === (command.dockerfile || "dev.dockerfile")
            ).object.text
      }))
    };

    state.baseRepoId = id;
    state.repoName = name;
    state.baseRepoUrl = url;
    state.baseRepoOwner = owner.login;
    state.baseBranchSha = ref.target.oid;
    state.baseBranchName = ref.name;
    state.config = newConfig;
    state.tree["/"] = entryList.map(e => e.path);
    for (const entry of entryList) {
      state.entries[entry.path] = entry;
    }
  },
  receiveForkedRepo(state, { repoId, repoOwner, repoUrl }) {
    state.forkedRepoId = repoId;
    state.forkedRepoOwner = repoOwner;
    state.forkedRepoUrl = repoUrl;
  },
  receiveBoxInfo(
    state,
    { repoName, boxBranchName, forkedRepoOwner, baseBranchName }
  ) {
    state.boxBranchName = boxBranchName;
    state.forkedRepoOwner = forkedRepoOwner;
    state.baseBranchName = baseBranchName;
    state.repoName = repoName;
  },
  receiveBoxBranch(state, boxBranchName: string) {
    state.boxBranchName = boxBranchName;
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
    state.entries[path].loaded = true;
  },
  editText(state, { path, text }) {
    state.texts[path] = text;
    state.entries[path].isDirty = true;
  },
  receiveDeployment(state, deployment: object) {
    state.deployment = deployment;
  },
  receiveCommittedEntry(state, { path, sha }) {
    const entry = state.entries[path];
    entry.sha = sha;
    entry.isDirty = false;
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
