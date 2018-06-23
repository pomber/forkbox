import React from "react";
import * as S from "./styles";
import FileTree from "./file-tree";

const FilePanel = ({ selectEntry, isDirty }) => (
  <S.FilePanel>
    <FileTree path="/" selectEntry={selectEntry} isDirty={isDirty} />
  </S.FilePanel>
);

export default FilePanel;
