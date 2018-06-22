import React from "react";
import MonacoEditor from "react-monaco-editor";
import * as S from "./styles";

const getLanguage = () => "javascript";

const options = {
  minimap: { enabled: false },
  lineNumbers: "on",
  scrollBeyondLastLine: false
};

const CodePanel = () => (
  <S.CodePanel>
    <MonacoEditor
      value={"//foo"}
      options={options}
      onChange={() => null}
      language={getLanguage()}
    />
  </S.CodePanel>
);

export default CodePanel;
