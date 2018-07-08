import React from "react";
import * as S from "./styles";
import FilePanel from "./file-panel";
import CodePanel from "./code-panel";
import { connect } from "react-redux";
import * as api from "./api";
import { fetchRepoIfNeeded } from "./dispatchers";

const TerminalPanel = () => <S.TerminalPanel>Terminal</S.TerminalPanel>;

class App extends React.Component {
  componentDidMount() {
    const { owner, repoName, baseBranch } = this.props;
    this.props.fetchRepoIfNeeded(owner, repoName, baseBranch);
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

const mapDispatchToProps = {
  fetchRepoIfNeeded
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
