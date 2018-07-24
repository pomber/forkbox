import React from "react";
import * as S from "./styles";
import FileTree from "./file-tree";
import { MdSave } from "react-icons/lib/md";
import { GoTrashcan, GoFileDirectory, GoFileText } from "react-icons/lib/go";
import { connect } from "react-redux";
import { saveEntry } from "./dispatchers";

const FilePanel = ({ saveEntry }) => (
  <S.FilePanel>
    <S.FilePanelButtons>
      <MdSave size={20} onClick={saveEntry} />
      <GoFileText size={20} />
      <GoFileDirectory size={20} />
      <GoTrashcan size={20} />
    </S.FilePanelButtons>
    <FileTree path="/" />
  </S.FilePanel>
);

export default connect(
  null,
  {
    saveEntry
  }
)(FilePanel);
