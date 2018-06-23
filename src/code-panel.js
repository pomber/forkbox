import React from "react";
import MonacoEditor from "react-monaco-editor";
import { Loader } from "./utils/hitchcock";
import * as S from "./styles";

const getLanguage = () => "javascript";

const options = {
  minimap: { enabled: false },
  lineNumbers: "on",
  scrollBeyondLastLine: false
};

const CodePanel = ({ path }) => (
  <S.CodePanel>
    <Loader
      getSource={sources => sources.blobText(path)}
      placeholder={<div>Loading...</div>}
    >
      {text => (
        <MonacoEditor
          value={text}
          options={options}
          onChange={() => null}
          language={getLanguage()}
        />
      )}
    </Loader>
  </S.CodePanel>
);

export default CodePanel;
