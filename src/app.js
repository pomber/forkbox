import React from "react";
import * as S from "./styles";
import FilePanel from "./file-panel";
import CodePanel from "./code-panel";
import { connect } from "react-redux";
import * as api from "./api";

const TerminalPanel = () => <S.TerminalPanel>Terminal</S.TerminalPanel>;

class App extends React.Component {
  componentDidMount() {
    this.props.fetchRepo();
  }
  render() {
    return (
      <S.Box>
        <FilePanel />
        <CodePanel text="//foo" />
        <TerminalPanel />
      </S.Box>
    );
  }
}

const mapStateToProps = (state, {}) => ({});

const mapDispatchToProps = (dispatch, { owner, repoName, baseBranch }) => ({
  fetchRepo: async _ => {
    const token = localStorage["gh-token"];
    const result = await api.getRepo({
      token,
      owner,
      repoName,
      branch: baseBranch
    });
    dispatch({ type: "STORE_REPO", result });
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
