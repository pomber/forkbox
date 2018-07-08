import * as api from "./api";
import { actions } from "./reducers";

export const fetchTreeIfNeeded = path => (dispatch, getState) => {
  const state = getState();
  const tree = state.trees[path];
  if (!tree) {
    return dispatch(fetchTree(path));
  }
};

const fetchTree = path => (dispatch, getState) => {
  const state = getState();
  const repoId = state.repoId;
  const entrySha = state.entries[path].sha;
  //TODO auth dance
  const token = localStorage["gh-token"];
  return api
    .getTree({ token, repoId, entrySha })
    .then(result => dispatch(actions.receiveTree({ path, entries: result })));
};

export const fetchRepoIfNeeded = (owner, repoName, branch) => (
  dispatch,
  getState
) => {
  const { repoId } = getState();
  if (!repoId) {
    return dispatch(fetchRepo(owner, repoName, branch));
  }
};

const fetchRepo = (owner, repoName, branch) => dispatch => {
  //TODO auth dance
  const token = localStorage["gh-token"];
  return api
    .getRepo({ token, owner, repoName, branch })
    .then(result => dispatch(actions.receiveRepo(result)));
};

export const toggleEntry = entry => (dispatch, getState) => {
  if (entry.isTree && !entry.loaded) {
    dispatch(fetchTree(entry.path));
  }
  dispatch(actions.toggleEntry(entry));
};

// utils

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
