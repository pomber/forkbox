import * as api from "./api";
import { actions } from "./reducers";
import router from "./router";
import { killInstances } from "./now-api";

export const initBox = (owner, repoName, branch, ghCode, zeitCode) => async (
  dispatch,
  getState
) => {
  const { baseRepoId } = getState();
  if (baseRepoId) return;
  let token = localStorage["gh-token"];

  if (!token && !ghCode) {
    router.redirectToGhAuth();
  }

  if (!token) {
    token = await api.getGhToken(ghCode);
    localStorage["gh-token"] = token;
  }

  console.log(zeitCode);
  if (!localStorage["zeit-token"] && zeitCode) {
    dispatch(actions.connectingToZeit());
    api
      .getZeitToken(zeitCode)
      .then(zeitToken => (localStorage["zeit-token"] = zeitToken));
  }

  const result = await api.getRepo({ token, owner, repoName, branch });

  dispatch(actions.receiveRepo(result));

  await forkRepo()(dispatch, getState);
  await createBoxBranch()(dispatch, getState);
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

export const connectWithZeit = () => (dispatch, getState) => {
  router.redirectToZeitAuth();
};

export const deploy = commandName => async (dispatch, getState) => {
  const {
    dockerfile,
    repoName,
    config,
    forkedRepoUrl,
    boxBranchName
  } = getState();
  const token = localStorage["zeit-token"];
  const env = config.commands.find(c => c.name === commandName).env;
  const deployment = await api.deployToZeit({
    token,
    dockerfile,
    repoName,
    repoUrl: forkedRepoUrl,
    boxBranch: boxBranchName,
    env
  });
  console.log("deploy", deployment);
  let deploymentState = deployment.readyState;
  updateDeployment(deployment, deploymentState, dispatch);
  while (deployment.isLoading) {
    //TODO I think this doesn't work
    await wait(500);
    let update = await api.getZeitDeployment({
      deploymentId: deployment.deploymentId
    });
    console.log("update", deployment);
    deploymentState = update.state;
    updateDeployment(deployment, deploymentState, dispatch);
  }
  if (deployment.isError) {
    throw new Error(deployment);
  }

  return;
};

const updateDeployment = (deployment, deploymentState, dispatch) => {
  deployment.isLoading = ["DEPLOYING", "BOOTED", "BUILDING"].includes(
    deploymentState
  );
  deployment.isReady = ["READY", "FROZEN"].includes(deploymentState);
  deployment.isError = ["BUILD_ERROR", "DEPLOYMENT_ERROR"].includes(
    deploymentState
  );
  dispatch(actions.receiveDeployment(deployment));
};

export const stopDeployment = () => async (dispatch, getState) => {
  console.log("stop deployment");
  const token = localStorage["zeit-token"];
  const { deploymentId } = getState().deployment;
  dispatch(actions.receiveDeployment({}));
  // const result = await api.stopZeitDeployment({ token, deploymentId });
  await killInstances(token, deploymentId);
  console.log("stopped");
};

export const forkRepo = () => async (dispatch, getState) => {
  const token = localStorage["gh-token"];
  const { baseRepoOwner, repoName } = getState();
  const repoInfo = await api.forkRepo({
    token,
    owner: baseRepoOwner,
    repoName
  });
  dispatch(actions.receiveForkedRepo(repoInfo));
};

const createBoxBranch = () => async (dispatch, getState) => {
  const token = localStorage["gh-token"];
  const { forkedRepoOwner, repoName, baseBranchSha } = getState();
  const newBranch = "forkbox-" + new Date().getTime();
  // TODO rewrite url
  await api.createBranch({
    token,
    owner: forkedRepoOwner,
    repoName,
    baseSha: baseBranchSha,
    newBranch
  });
  dispatch(actions.receiveBoxBranch(newBranch));
};

// utils

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
