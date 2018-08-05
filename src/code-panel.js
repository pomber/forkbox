import React from "react";
import MonacoEditor from "react-monaco-editor";
import { KeyCode, KeyMod } from "monaco-editor";
import * as S from "./styles";
import { connect } from "react-redux";
import getLanguage from "./utils/language-detector";
import { saveEntry, editText } from "./dispatchers";

const options = {
  minimap: { enabled: false },
  lineNumbers: "off",
  scrollBeyondLastLine: false,
  theme: "vs-dark"
};

const CodePanel = ({ resizeEmitter, text, language, onChange, saveEntry }) => (
  <S.CodePanel>
    <MonacoEditor
      value={text}
      options={options}
      onChange={onChange}
      language={language}
      editorDidMount={editor => {
        resizeEmitter.subscribe(() => editor.layout());
        editor.addCommand(KeyMod.CtrlCmd | KeyCode.KEY_S, () => {
          saveEntry();
        });
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
  onChange: editText,
  saveEntry
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CodePanel);
