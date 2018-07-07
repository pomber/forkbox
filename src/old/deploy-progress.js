import React from "react";
import { State } from "./utils/state";
import * as S from "./styles";

const getStep = status =>
  status === null || status.state === DEPLOYING
    ? 0
    : status.state === BOOTED
      ? 1
      : status.state === BUILDING
        ? 2
        : 3;

const isDone = status =>
  status.state === READY ||
  status.state === DEPLOYMENT_ERROR ||
  status.state === BUILD_ERROR;

const Progress = ({ step }) => (
  <React.Fragment>
    <S.Step
      current={step === 0}
      done={step > 0}
      label={"Uploading Dockerfile"}
    />
    <S.Step current={step === 1} done={step > 1} label={"Booting"} />
    <S.Step current={step === 2} done={step > 2} label={"Building Image"} />
  </React.Fragment>
);

const observeDeployment = async (deploymentId, callback) => {
  const response = await fetch(
    "https://api.zeit.co/v2/now/deployments/" + deploymentId
  );
  const status = await response.json();
  console.log("status", status);
  callback(status);
  if (!isDone(status)) {
    setTimeout(() => {
      observeDeployment(deploymentId, callback);
    }, 300);
  }
};

const DeployProgress = ({ dockerfile, deploy, onDone }) => (
  <State
    init={{ status: null }}
    didMount={(s, ss) =>
      deploy(dockerfile).then(data =>
        observeDeployment(
          data.deploymentId,
          status =>
            isDone(status)
              ? onDone({ ...status, deploymentId: data.deploymentId })
              : ss({ status })
        )
      )
    }
    map={s => ({ step: getStep(s.status) })}
  >
    {s => <Progress step={s.step} />}
  </State>
);

export default DeployProgress;

const REQUESTING = "REQUESTING";
const INITIALIZING = "INITIALIZING";
const DEPLOYING = "DEPLOYING";
const DEPLOYMENT_ERROR = "DEPLOYMENT_ERROR";
const BOOTED = "BOOTED";
const BUILDING = "BUILDING";
const BUILD_ERROR = "BUILD_ERROR";
const READY = "READY";
const FROZEN = "FROZEN";
