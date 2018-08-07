import * as api from "./api";
import { actions } from "./reducers";
import { getGithubToken, getZeitToken } from "./token-store";
import { initInstances } from "./instance-store";

export const initHome = () => dispatch => {
  dispatch(actions.initHome());
};

export const initNewBox = ({
  baseRepoOwner,
  repoName,
  baseBranchName = "master"
}) => async (dispatch, getState) => {
  const { baseRepoId } = getState();
  if (baseRepoId) return;

  let token = await getGithubToken();

  const result = await api.getRepo({
    token,
    owner: baseRepoOwner,
    repoName,
    branch: baseBranchName
  });

  dispatch(actions.receiveRepo(result));
  dispatch(initInstances());

  await forkRepo()(dispatch, getState);
  await createBoxBranch()(dispatch, getState);
};

export const initBox = ({
  forkedRepoOwner,
  repoName,
  boxBranchName,
  baseBranchName
}) => async (dispatch, getState) => {
  let token = await getGithubToken();

  dispatch(
    actions.receiveBoxInfo({
      forkedRepoOwner,
      repoName,
      boxBranchName,
      baseBranchName
    })
  );

  const result = await api.getRepo({
    token,
    owner: forkedRepoOwner,
    repoName,
    branch: boxBranchName
  });

  dispatch(actions.initForkedRepo(result));
  dispatch(initInstances());
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

const fetchBlob = path => async (dispatch, getState) => {
  const state = getState();
  const repoId = state.forkedRepoId || state.baseRepoId;
  const entrySha = state.entries[path].sha;
  const token = await getGithubToken();
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

const fetchTree = path => async (dispatch, getState) => {
  const state = getState();
  const repoId = state.forkedRepoId || state.baseRepoId;
  const entrySha = state.entries[path].sha;
  const token = await getGithubToken();
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

export const connectWithZeit = () => async (dispatch, getState) => {
  await getZeitToken();
};

export const forkRepo = () => async (dispatch, getState) => {
  const token = await getGithubToken();
  const { baseRepoOwner, repoName } = getState();
  const repoInfo = await api.forkRepo({
    token,
    owner: baseRepoOwner,
    repoName
  });
  dispatch(actions.receiveForkedRepo(repoInfo));
};

const createBoxBranch = () => async (dispatch, getState) => {
  const token = await getGithubToken();
  const { forkedRepoOwner, repoName, baseBranchSha } = getState();
  const newBranch = "forkbox-" + new Date().getTime();
  await api.createBranch({
    token,
    owner: forkedRepoOwner,
    repoName,
    baseSha: baseBranchSha,
    newBranch
  });
  dispatch(actions.receiveBoxBranch(newBranch));
};

export const saveEntry = () => async (dispatch, getState) => {
  const token = await getGithubToken();
  const {
    forkedRepoOwner,
    repoName,
    boxBranchName,
    selectedBlob,
    texts,
    entries
  } = getState();
  const text = texts[selectedBlob];
  const sha = entries[selectedBlob].sha;
  const entryNewInfo = await api.commitContent({
    token,
    owner: forkedRepoOwner,
    repoName,
    path: selectedBlob,
    content: text,
    branchName: boxBranchName,
    sha
  });
  dispatch(actions.receiveCommittedEntry(entryNewInfo));
};

export const sendPullRequest = () => async (dispatchEvent, getState) => {
  const {
    baseRepoOwner,
    repoName,
    baseBranchName,
    forkedRepoOwner,
    boxBranchName
  } = getState();
  location.href = `https://github.com/${baseRepoOwner}/${repoName}/compare/${baseBranchName}...${forkedRepoOwner}:${boxBranchName}`;
};

// utils

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
