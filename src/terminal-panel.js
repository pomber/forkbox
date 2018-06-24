import React from "react";
import * as S from "./styles";
import { State } from "./utils/state";
import DockerForm from "./docker-form";
import { Loader } from "./utils/hitchcock";

const TerminalPanel = ({}) => (
  <Loader getSource={sources => sources.repo()}>
    {({ repoUrl, branchName }) => (
      <S.TerminalPanel>
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
      </S.TerminalPanel>
    )}
  </Loader>
);

export default TerminalPanel;
