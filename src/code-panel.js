import React from "react";
import MonacoEditor from "react-monaco-editor";
import * as S from "./styles";
import { connect } from "react-redux";
import getLanguage from "./utils/language-detector";
import { editText } from "./dispatchers";

const options = {
  minimap: { enabled: false },
  lineNumbers: "off",
  scrollBeyondLastLine: false,
  theme: "vs-dark"
};

const CodePanel = ({ text, language, onChange }) => (
  <S.CodePanel>
    <MonacoEditor
      value={text}
      options={options}
      onChange={onChange}
      language={language}
      editorDidMount={editor => {
        window.addEventListener("resize", () => editor.layout());
      }}
    />
  </S.CodePanel>
);

const mapStateToProps = state => {
  const selectedPath = state.selectedBlob;
  const text = selectedPath && state.texts[selectedPath];
  return {
    text: text || "",
    language: getLanguage(selectedPath)
  };
};

const mapDispatchToProps = {
  onChange: editText
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CodePanel);
