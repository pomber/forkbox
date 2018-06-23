import React from "react";
import * as S from "./styles";
import FileTree from "./file-tree";

const FilePanel = ({ selectEntry }) => (
  <S.FilePanel>
    <FileTree path="/" selectEntry={selectEntry} />
  </S.FilePanel>
);

export default FilePanel;
