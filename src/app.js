import React from "react";
import * as S from "./styles";
import FilePanel from "./file-panel";
import CodePanel from "./code-panel";

const TerminalPanel = () => <S.TerminalPanel>Terminal</S.TerminalPanel>;

const App = () => (
  <S.Box>
    <FilePanel />
    <CodePanel text="//foo" />
    <TerminalPanel />
  </S.Box>
);

export default App;
