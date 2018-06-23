import React from "react";
import * as S from "./styles";
import FileTree from "./file-tree";

const FilePanel = ({ selectEntry, isDirty, isSelected }) => (
  <S.FilePanel>
    <FileTree
      path="/"
      selectEntry={selectEntry}
      isDirty={isDirty}
      isSelected={isSelected}
    />
  </S.FilePanel>
);

export default FilePanel;
