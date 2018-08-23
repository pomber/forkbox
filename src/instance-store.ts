import fluxify from "./utils/fluxify";
import { getZeitToken } from "./token-store";
import * as api from "./api";
import * as nowApi from "./now-api";
export enum Status {
  UNKNOWN,
  DEPLOYING,
  BUILDING,
  ERROR,
  READY,
  FROZEN
}

interface Instance {
  commandName: string;
  status: Status;
  id: string;
  url: string;
  backoff?: number;
  logs?: string;
}

interface InstanceStore {
  currentInstance?: string;
  instances?: Record<string, Instance>;
}

const { actions, reducer } = fluxify(
  {
    currentInstance: null,
    instances: null
  },
  {
    init(state, commandNames) {
      state.instances = Object.assign(
        {},
        ...commandNames.map(name => ({
          [name]: { commandName: name, status: Status.UNKNOWN }
        }))
      );
    },
    selectInstance(state, commandName: string) {
      state.currentInstance = commandName;
    },
    unselectInstance(state, commandName: string) {
      if (commandName == state.currentInstance) {
        state.currentInstance = null;
      }
    },
    updateInstance(state, patch) {
      const instance = state.instances[patch.commandName];
      state.instances[patch.commandName] = Object.assign({}, instance, patch);
    }
  }
);

export const initInstances = () => (dispatch, getState) => {
  const commands = getState().config.commands;
  const commandNames = commands.map(c => c.name);
  dispatch(actions.init(commandNames));
};

export const triggerDeploys = () => (dispatch, getState) => {
  const commands = getState().config.commands;
  const commandNames = commands.map(c => c.name);
  console.log("Trigger");
  commandNames.forEach(commandName =>
    dispatch(changeInstanceStatus({ commandName, toStatus: Status.READY }))
  );
};
export const startInstance = ({ commandName }) => (dispatch, getState) => {
  dispatch(actions.selectInstance(commandName));
  dispatch(changeInstanceStatus({ commandName, toStatus: Status.READY }));
};

export const stopInstance = ({ commandName }) => (dispatch, getState) => {
  dispatch(actions.unselectInstance(commandName));
  dispatch(changeInstanceStatus({ commandName, toStatus: Status.FROZEN }));
};

const changeInstanceStatus = ({
  commandName,
  toStatus
}: {
  commandName: string;
  toStatus: Status.READY | Status.FROZEN;
}) => (dispatch, getState) => {
  const { instances } = getState();
  const instance = instances[commandName];
  const fromStatus = instance.status;

  switch (fromStatus) {
    case Status.UNKNOWN:
    case Status.ERROR:
      dispatch(
        actions.updateInstance({ commandName, status: Status.DEPLOYING })
      );
      dispatch(deploy({ commandName }));
      break;
    case Status.READY:
      if (toStatus == Status.FROZEN) {
        dispatch(freeze({ commandName }));
      }
    case Status.FROZEN:
      if (toStatus == Status.READY) {
        dispatch(actions.updateInstance({ commandName, status: Status.READY }));
      }
    default:
      console.log("Changing", fromStatus, toStatus);
  }
};

const freeze = ({ commandName }) => async (dispatch, getState) => {
  const token = await getZeitToken();
  const { instances } = getState();
  const instance = instances[commandName];
  await nowApi.killInstances(token, instance.id);
  //TODO fix when START is called whill killInstances is still working
  dispatch(actions.updateInstance({ commandName, status: Status.FROZEN }));
};

const deploy = ({ commandName }) => async (dispatch, getState) => {
  const { repoName, config, forkedRepoUrl, boxBranchName } = getState();
  const token = await getZeitToken();
  const { env, dockerfile } = config.commands.find(c => c.name === commandName);
  const deployment = await api.deployToZeit({
    token,
    dockerfile,
    repoName,
    repoUrl: forkedRepoUrl,
    boxBranch: boxBranchName,
    env
  });
  console.log("deploy", deployment);

  if (deployment.readyState === "READY") {
    dispatch(
      actions.updateInstance({
        commandName,
        status: Status.READY,
        url: "https://" + deployment.url,
        id: deployment.deploymentId
      })
    );
  } else {
    const backoff = 500;
    setTimeout(() => {
      dispatch(pollInstance({ commandName }));
    }, backoff);
    dispatch(
      actions.updateInstance({
        commandName,
        status: Status.BUILDING,
        url: "https://" + deployment.url,
        id: deployment.deploymentId,
        backoff
      })
    );
  }

  return;
};

const pollInstance = ({ commandName }) => async (dispatch, getState) => {
  const { instances } = getState();
  const instance = instances[commandName];
  const deployment = await api.getZeitDeployment({ deploymentId: instance.id });
  console.log("poll", deployment);

  switch (deployment.state) {
    case "ERROR":
    case "BUILD_ERROR":
    case "DEPLOYMENT_ERROR":
      dispatch(
        actions.updateInstance({
          commandName,
          status: Status.ERROR
        })
      );
      return;
    case "READY":
      dispatch(
        actions.updateInstance({
          commandName,
          status: Status.READY
        })
      );
      return;
    case "FROZEN":
      dispatch(
        actions.updateInstance({
          commandName,
          status: Status.FROZEN
        })
      );
      return;
    default:
      dispatch(fetchLogs({ commandName }));
      const backoff = Math.min(instance.backoff * 1.3, 10000);
      setTimeout(() => {
        dispatch(pollInstance({ commandName }));
      }, backoff);
      dispatch(
        actions.updateInstance({
          commandName,
          backoff
        })
      );
  }
};

const fetchLogs = ({ commandName }) => async (dispatch, getState) => {
  const { instances } = getState();
  const instance = instances[commandName];
  const logs = await nowApi.getLogs(instance.id);
  dispatch(
    actions.updateInstance({
      commandName,
      logs
    })
  );
};

export default reducer;
