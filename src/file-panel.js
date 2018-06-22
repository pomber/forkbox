import React from "react";
import * as S from "./styles";
import FileTree from "./file-tree";

const FilePanel = () => (
  <S.FilePanel>
    <FileTree path="/" selectEntry={e => console.log(e)} />
  </S.FilePanel>
);

export default FilePanel;
