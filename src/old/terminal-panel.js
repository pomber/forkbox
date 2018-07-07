import React from "react";
import * as S from "./styles";
import { State, ErrorBoundary } from "./utils/state";
import DockerForm from "./docker-form";
import DeployProgress from "./deploy-progress";
import { Loader } from "./utils/hitchcock";

const getZeitAuthUrl = () =>
  `https://zeit.co/oauth/authorize?client_id=${
    process.env.ZEIT_CLIENT_ID
  }&state=${window.location.pathname}`;

const ZeitLogin = ({}) => (
  <S.Button onClick={() => window.location.replace(getZeitAuthUrl())}>
    Connect with Zeit
  </S.Button>
);

const TerminalPanel = ({}) => (
  <S.TerminalPanel>
    <ErrorBoundary
      when={error => error.isMissingValue && error.key === "zeit-code"}
      catch={() => <ZeitLogin />}
    >
      <Loader getSource={sources => sources.zeit()} defaultValue={null}>
        {deploy => (
          <State
            init={{
              step: 0,
              deploymentId: null,
              deploymentUrl: null,
              dockerfile: null
            }}
            map={(s, ss, dss) => ({
              ...s,
              setDockerfile: dockerfile => ss({ dockerfile }),
              onDone: status =>
                ss({
                  deploymentUrl: "https://" + status.host,
                  deploymentId: status.deploymentId
                })
            })}
          >
            {s => (
              <Loader getSource={sources => sources.repo()}>
                {({ repoUrl, branchName }) =>
                  !s.dockerfile ? (
                    <DockerForm
                      onSubmit={s.setDockerfile}
                      repoUrl={repoUrl}
                      branchName={branchName}
                    />
                  ) : !s.deploymentUrl ? (
                    <DeployProgress
                      dockerfile={s.dockerfile}
                      deploy={deploy}
                      onDone={s.onDone}
                    />
                  ) : (
                    <iframe
                      src={s.deploymentUrl}
                      style={{
                        width: "100%",
                        height: "100%",
                        border: 0,
                        paddingTop: "14px",
                        paddingLeft: "14px",
                        boxSizing: "borderBox"
                      }}
                    />
                  )
                }
              </Loader>
            )}
          </State>
        )}
      </Loader>
    </ErrorBoundary>
  </S.TerminalPanel>
);

export default TerminalPanel;
