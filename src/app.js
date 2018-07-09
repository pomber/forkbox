import React from "react";
import * as S from "./styles";
import FilePanel from "./file-panel";
import CodePanel from "./code-panel";
import { connect } from "react-redux";
import * as api from "./api";
import { initBox } from "./dispatchers";

class App extends React.Component {
  componentDidMount() {
    const { owner, repoName, baseBranch, ghCode, initBox } = this.props;
    initBox(owner, repoName, baseBranch, ghCode);
  }
  render() {
    return (
      <S.Box>
        <FilePanel />
        <CodePanel text="//foo" />
        <S.TerminalPanel>Terminal</S.TerminalPanel>
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
