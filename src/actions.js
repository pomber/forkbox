import * as api from "./api";

export const TOGGLE_ENTRY = "TOGGLE_ENTRY";
export const RECEIVE_REPO = "RECEIVE_REPO";
export const RECEIVE_TREE = "RECEIVE_TREE";

const receiveTree = (path, result) => ({
  type: RECEIVE_TREE,
  path,
  entries: result
});

const fetchTree = path => (dispatch, getState) => {
  const state = getState();
  const repoId = state.repoId;
  const entrySha = state.entries[path].sha;
  //TODO auth dance
  const token = localStorage["gh-token"];
  return api
    .getTree({ token, repoId, entrySha })
    .then(result => dispatch(receiveTree(path, result)));
};

export const fetchTreeIfNeeded = path => (dispatch, getState) => {
  const state = getState();
  const tree = state.trees[path];
  if (!tree) {
    return dispatch(fetchTree(path));
  }
};

const receiveRepo = result => ({
  type: RECEIVE_REPO,
  result
});

const fetchRepo = (owner, repoName, branch) => dispatch => {
  //TODO auth dance
  const token = localStorage["gh-token"];
  return api
    .getRepo({ token, owner, repoName, branch })
    .then(result => dispatch(receiveRepo(result)));
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

export const toggleEntry = entry => (dispatch, getState) => {
  if (entry.isTree && !entry.loaded) {
    dispatch(fetchTree(entry.path));
  }
  dispatch({
    type: TOGGLE_ENTRY,
    entry
  });
};
