import fluxify from "./utils/fluxify";
import { getZeitToken } from "./token-store";
import * as api from "./api";
enum Status {
  UNKNOWN,
  DEPLOYING,
  BUILDING,
  ERROR,
  READY,
  FROZEN
}

interface Instance {
  status: Status;
  id: string;
  url: string;
  timeoutId: number;
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
        ...commandNames.map(name => ({ [name]: { status: Status.UNKNOWN } }))
      );
    },
    selectInstance(state, commandName: string) {
      state.currentInstance = commandName;
    },
    updateInstance(state, { commandName, ...instancePatch }) {
      const instance = state.instances[commandName];
      state.instances[commandName] = Object.assign({}, instance, instancePatch);
    }
  }
);

export const initInstances = () => (dispatch, getState) => {
  const commands = getState().config.commands;
  const commandNames = commands.map(c => c.name);
  dispatch(actions.init(commandNames));
};

export const startInstance = ({ commandName }) => (dispatch, getState) => {
  dispatch(actions.selectInstance(commandName));
  dispatch(changeInstanceStatus({ commandName, toStatus: Status.READY }));
};

export const changeInstanceStatus = ({
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
      dispatch(deploy(commandName));
      break;
    case Status.READY:
    case Status.FROZEN:
    default:
      throw Error("Bad instance status");
  }
};

export const deploy = commandName => async (dispatch, getState) => {
  const {
    dockerfile,
    repoName,
    config,
    forkedRepoUrl,
    boxBranchName
  } = getState();
  const token = await getZeitToken();
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
    dispatch(
      actions.updateInstance({
        commandName,
        status: Status.BUILDING,
        url: "https://" + deployment.url,
        id: deployment.deploymentId
      })
    );
  }

  return;
};

export default reducer;
