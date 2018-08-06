import React from "react";
import * as S from "./styles";
import { connect } from "react-redux";
import { connectWithZeit } from "./dispatchers";
import { startInstance, stopInstance, Status } from "./instance-store";

const TerminalPanel = ({
  commandNames,
  instance,
  isConnectedToZeit,
  connectWithZeit,
  startInstance,
  stopInstance
}) => (
  <S.TerminalPanel>
    {instance && instance.status == Status.READY ? (
      <S.IframeContainer
        onClose={() => stopInstance({ commandName: instance.commandName })}
      >
        <S.Iframe src={instance.url} />
      </S.IframeContainer>
    ) : (
      <S.Center>
        {!isConnectedToZeit && (
          <S.Button onClick={connectWithZeit}>Connect with Zeit</S.Button>
        )}
        {!instance ? (
          commandNames.map(commandName => (
            <S.Button
              key={commandName}
              onClick={() => startInstance({ commandName })}
              disabled={!isConnectedToZeit}
            >
              {commandName}
            </S.Button>
          ))
        ) : instance.url ? (
          <div>
            <p>Building...</p>
            {instance.logs && <pre>{instance.logs}</pre>}
            <a target="_blank" rel="noopener noreferrer" href={instance.url}>
              Full logs
            </a>
          </div>
        ) : (
          <pre>{JSON.stringify(instance, null, 2)}</pre>
        )}
      </S.Center>
    )}
  </S.TerminalPanel>
);

const mapStateToProps = (state, {}) => {
  const instanceName = state.currentInstance;
  const instance =
    state.instances && instanceName && state.instances[instanceName];

  const isConnectedToZeit = state.hasZeitToken;

  const commandNames = state.config.commands
    ? state.config.commands.map(c => c.name)
    : [];

  return {
    instance,
    isConnectedToZeit,
    commandNames
  };
};

const mapDispatchToProps = {
  connectWithZeit,
  startInstance,
  stopInstance
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TerminalPanel);
