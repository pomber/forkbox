import { fetchData } from "./utils/fetch";

export const getDeployment = async (deploymentId: string) => {
  return await fetchData<{
    uid: string;
    host: string;
    state: string;
  }>("https://api.zeit.co/v4/now/deployments/" + deploymentId);
};

export const createDockerDeployment = async (
  token: string,
  name: string,
  dockerfile: string,
  buildEnv?: object,
  env?: object
) => {
  const body = {
    name,
    deploymentType: "DOCKER",
    files: [{ file: "Dockerfile", data: dockerfile }],
    config: {
      env,
      build: {
        env: buildEnv
      }
    }
  };
  return await fetchData<{
    deploymentId: string;
    readyState: string;
    url: string;
  }>("https://api.zeit.co/v3/now/deployments", {
    method: "post",
    body: JSON.stringify(body),
    headers: new Headers({
      authorization: "Bearer " + token
    })
  });
};

export const killInstances = async (token: string, deploymentId: string) => {
  await fetchData(
    `https://api.zeit.co/v1/now/deployments/${deploymentId}/instances`,
    {
      method: "post",
      body: JSON.stringify({ min: 0, max: 0 }),
      headers: new Headers({
        authorization: "Bearer " + token
      })
    }
  );
  await fetchData(
    `https://api.zeit.co/v1/now/deployments/${deploymentId}/instances`,
    {
      method: "post",
      body: JSON.stringify({ min: 0, max: "auto" }),
      headers: new Headers({
        authorization: "Bearer " + token
      })
    }
  );
};

type Log = { text: string };
export const getLogs = async (deploymentId: string) => {
  const logs = await fetchData<Log[]>(
    `https://api.zeit.co/v1/now/deployments/${deploymentId}/events`
  );
  return logs
    .slice(-10)
    .map(log => log.text)
    .join("\n");
};
