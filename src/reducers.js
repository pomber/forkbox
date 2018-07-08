import fluxify from "./utils/fluxify";

export const { actions, reducer } = fluxify(
  { tree: {} },
  {
    receiveRepo(state, result) {
      const entryList = mapEntries("/", result.object.entries);
      const tree = { "/": entryList.map(e => e.path) };
      const entries = Object.assign(
        {},
        ...entryList.map(e => ({ [e.path]: e }))
      );
      return { ...state, tree, entries, repoId: result.id };
    },
    receiveTree(state, { path, entries }) {
      const entryList = mapEntries(path, entries);
      const tree = { ...state.tree, [path]: entryList.map(e => e.path) };
      const newEntries = Object.assign(
        {},
        state.entries,
        ...entryList.map(e => ({ [e.path]: e }))
      );
      return { ...state, tree, entries: newEntries };
    },
    toggleTree(state, entry) {
      const path = entry.path;
      const oldEntry = state.entries[path];
      const newEntry = {
        ...oldEntry,
        collapsed: !oldEntry.collapsed,
        loaded: true
      };
      const entries = { ...state.entries, [path]: newEntry };
      return { ...state, entries: entries };
    },
    selectBlob(state, entry) {
      const path = entry.path;
      if (state.selectedBlob === path) {
        return state;
      }
      const oldSelectedBlob = state.entries[state.selectedBlob];
      const oldUnselectedBlob = state.entries[path];
      const newSelectedBlob = { ...oldUnselectedBlob, isSelected: true };
      const newUnselectedBlob = { ...oldSelectedBlob, isSelected: false };

      const entries = {
        ...state.entries,
        [newSelectedBlob.path]: newSelectedBlob,
        [newUnselectedBlob.path]: newUnselectedBlob
      };

      return { ...state, entries, selectedBlob: path };
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
