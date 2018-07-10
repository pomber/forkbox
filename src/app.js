import React from "react";
import * as S from "./styles";
import FilePanel from "./file-panel";
import CodePanel from "./code-panel";
import TerminalPanel from "./terminal-panel";
import { connect } from "react-redux";
import { initBox } from "./dispatchers";

class App extends React.Component {
  componentDidMount() {
    const {
      owner,
      repoName,
      baseBranch,
      ghCode,
      zeitCode,
      initBox
    } = this.props;
    initBox(owner, repoName, baseBranch, ghCode, zeitCode);
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
  initBox
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
