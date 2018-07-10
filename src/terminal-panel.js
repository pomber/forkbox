import React from "react";
import * as S from "./styles";
import { connect } from "react-redux";
import { connectWithZeit, deploy, stopDeployment } from "./dispatchers";

const TerminalPanel = ({
  isReady,
  url,
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
      </React.Fragment>
    )}
  </S.TerminalPanel>
);

const mapStateToProps = (state, {}) => {
  const { isLoading, isError, isReady, url } = state.deployment;
  const isConnectedToZeit =
    !!localStorage["zeit-token"] || state.isConnectingZeit;
  return {
    isLoading,
    isError,
    isReady,
    isConnectedToZeit,
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
