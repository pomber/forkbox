import React from "react";
import * as S from "./styles";
import { connect } from "react-redux";
import { connectWithZeit, deploy, stopDeployment } from "./dispatchers";

const TerminalPanel = ({
  isReady,
  url,
  commandNames,
  isConnectedToZeit,
  connectWithZeit,
  deploy,
  stopDeployment
}) => (
  <S.TerminalPanel>
    {isReady ? (
      <S.IframeContainer onClose={stopDeployment}>
        <S.Iframe src={url} />
      </S.IframeContainer>
    ) : (
      <React.Fragment>
        {!isConnectedToZeit && (
          <S.Button onClick={connectWithZeit}>Connect with Zeit</S.Button>
        )}
        <S.Button onClick={deploy} disabled={!isConnectedToZeit}>
          Launch Terminal
        </S.Button>
        <pre>{JSON.stringify(commandNames)}</pre>
      </React.Fragment>
    )}
  </S.TerminalPanel>
);

const mapStateToProps = (state, {}) => {
  const { isLoading, isError, isReady, url } = state.deployment;
  const isConnectedToZeit =
    !!localStorage["zeit-token"] || state.isConnectingZeit;

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
  deploy,
  stopDeployment
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TerminalPanel);
