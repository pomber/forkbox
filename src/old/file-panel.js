import React from "react";
import * as S from "./styles";
import FileTree from "./file-tree";
import { MdSave } from "react-icons/lib/md";
import { GoTrashcan, GoFileDirectory, GoFileText } from "react-icons/lib/go";

const FilePanel = ({ selectEntry, isDirty, isSelected, onSave }) => (
  <S.FilePanel>
    <S.FilePanelButtons>
      <MdSave size={20} onClick={onSave} />
      <GoFileText size={20} />
      <GoFileDirectory size={20} />
      <GoTrashcan size={20} />
    </S.FilePanelButtons>
    <FileTree
      path="/"
      selectEntry={selectEntry}
      isDirty={isDirty}
      isSelected={isSelected}
    />
  </S.FilePanel>
);

export default FilePanel;
