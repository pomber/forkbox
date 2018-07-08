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

export const selectEntry = entry => (dispatch, getState) => {
  if (entry.isTree) {
    selectTree(entry)(dispatch, getState);
  } else {
    selectBlob(entry)(dispatch, getState);
  }
};

const selectBlob = entry => (dispatch, getState) => {
  if (!entry.loaded) {
    fetchBlob(entry.path)(dispatch, getState);
  }
  dispatch(actions.selectBlob(entry));
};

const fetchBlob = path => (dispatch, getState) => {
  const state = getState();
  const repoId = state.repoId;
  const entrySha = state.entries[path].sha;
  //TODO auth dance
  const token = localStorage["gh-token"];
  return api
    .getBlobText({ token, repoId, entrySha })
    .then(text => dispatch(actions.receiveBlobText({ path, text })));
};

const selectTree = entry => (dispatch, getState) => {
  if (!entry.loaded) {
    fetchTree(entry.path)(dispatch, getState);
  }
  dispatch(actions.toggleTree(entry));
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
