import React from "react";
import * as S from "./styles";
import { connect } from "react-redux";
import { connectWithZeit, stopDeployment } from "./dispatchers";
import { startInstance } from "./instance-store";

const TerminalPanel = ({
  isReady,
  url,
  commandNames,
  isConnectedToZeit,
  connectWithZeit,
  startInstance,
  stopDeployment
}) => (
  <S.TerminalPanel>
    {isReady ? (
      <S.IframeContainer onClose={stopDeployment}>
        <S.Iframe src={url} />
      </S.IframeContainer>
    ) : (
      <S.Center>
        {!isConnectedToZeit && (
          <S.Button onClick={connectWithZeit}>Connect with Zeit</S.Button>
        )}
        {commandNames.map(commandName => (
          <S.Button
            key={commandName}
            onClick={() => startInstance({ commandName })}
            disabled={!isConnectedToZeit}
          >
            {commandName}
          </S.Button>
        ))}
      </S.Center>
    )}
  </S.TerminalPanel>
);

const mapStateToProps = (state, {}) => {
  const { isLoading, isError, isReady, url } = state.deployment;
  const isConnectedToZeit = state.hasZeitToken;

  const commandNames = state.config.commands
    ? state.config.commands.map(c => c.name)
    : [];

  return {
    isLoading,
    isError,
    isReady,
    isConnectedToZeit,
    commandNames,
    url: url && "https://" + url
  };
};

const mapDispatchToProps = {
  connectWithZeit,
  startInstance,
  stopDeployment
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TerminalPanel);
