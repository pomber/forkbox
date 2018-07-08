import * as api from "./api";
import { actions } from "./reducers";

export const fetchRepoIfNeeded = (owner, repoName, branch) => (
  dispatch,
  getState
) => {
  const { repoId } = getState();
  if (repoId) return;
  //TODO auth dance
  const token = localStorage["gh-token"];
  return api
    .getRepo({ token, owner, repoName, branch })
    .then(result => dispatch(actions.receiveRepo(result)));
};

export const toggleEntry = entry => (dispatch, getState) => {
  if (entry.isTree && !entry.loaded) {
    fetchTree(entry.path)(dispatch, getState);
  }
  if (entry.isTree) {
    dispatch(actions.toggleTree(entry));
  } else {
    dispatch(actions.selectBlob(entry));
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
