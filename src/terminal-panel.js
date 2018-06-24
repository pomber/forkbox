import React from "react";
import * as S from "./styles";
import { State, ErrorBoundary } from "./utils/state";
import DockerForm from "./docker-form";
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
            init={{ step: 0 }}
            map={(s, ss, dss) => ({ ...s, noDockerfile: "foo" })}
          >
            {() => (
              <Loader getSource={sources => sources.repo()}>
                {({ repoUrl, branchName }) => (
                  <State
                    init={{ dockerfile: null }}
                    map={(s, ss) => ({
                      ...s,
                      setDockerfile: dockerfile => ss({ dockerfile })
                    })}
                  >
                    {s =>
                      !s.dockerfile ? (
                        <DockerForm
                          onSubmit={s.setDockerfile}
                          repoUrl={repoUrl}
                          branchName={branchName}
                        />
                      ) : (
                        // <Deployer dockerfile={s.dockerfile} />
                        <pre>{s.dockerfile}</pre>
                      )
                    }
                  </State>
                )}
              </Loader>
            )}
          </State>
        )}
      </Loader>
    </ErrorBoundary>
  </S.TerminalPanel>
);

export default TerminalPanel;
