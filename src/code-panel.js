import React from "react";
import MonacoEditor from "react-monaco-editor";
import * as S from "./styles";
import { connect } from "react-redux";
import getLanguage from "./utils/language-detector";

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

const mapStateToProps = state => {
  const selectedPath = state.selectedBlob;
  const text = selectedPath && state.texts[selectedPath];
  return {
    text: text || "// Loading...",
    language: getLanguage(selectedPath)
  };
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CodePanel);
