import React from "react";
import MonacoEditor from "react-monaco-editor";
import * as S from "./styles";

const options = {
  minimap: { enabled: false },
  lineNumbers: "off",
  scrollBeyondLastLine: false
};

const CodePanel = ({ text, language, onChange }) => (
  <S.CodePanel>
    <MonacoEditor
      value={text}
      options={options}
      onChange={onChange}
      language={language}
    />
  </S.CodePanel>
);

export default CodePanel;
