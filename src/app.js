import React from "react";
import * as S from "./styles";
import FilePanel from "./file-panel";
import CodePanel from "./code-panel";
import TerminalPanel from "./terminal-panel";

class App extends React.Component {
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

export default App;
