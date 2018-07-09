import * as api from "./api";
import { actions } from "./reducers";
import router from "./router";

export const initBox = (owner, repoName, branch, ghCode) => async (
  dispatch,
  getState
) => {
  const { repoId } = getState();
  if (repoId) return;
  let token = localStorage["gh-token"];

  if (!token && !ghCode) {
    router.redirectToGhAuth();
  }

  if (!token) {
    token = await api.getGhToken(ghCode);
    localStorage["gh-token"] = token;
  }

  const result = await api.getRepo({ token, owner, repoName, branch });

  dispatch(actions.receiveRepo(result));
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
  const token = localStorage["gh-token"];
  return api
    .getTree({ token, repoId, entrySha })
    .then(result => dispatch(actions.receiveTree({ path, entries: result })));
};

export const editText = text => (dispatch, getState) => {
  const path = getState().selectedBlob;
  if (path) {
    dispatch(actions.editText({ path, text }));
  }
};
