import React from "react";
import * as S from "./styles";
import FileTree from "./file-tree";
import { MdSave } from "react-icons/lib/md";
import { GoTrashcan, GoFileDirectory, GoFileText } from "react-icons/lib/go";
import { connect } from "react-redux";
import { saveEntry, sendPullRequest } from "./dispatchers";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

const FilePanel = ({ saveEntry, sendPullRequest }) => (
  <S.FilePanel>
    {/* <S.FilePanelButtons>
      <S.NewFileButton />
      <S.NewFolderButton />
    </S.FilePanelButtons> */}
    <PerfectScrollbar>
      <FileTree path="/" />
    </PerfectScrollbar>
    <S.Button style={{ marginTop: "7px" }} onClick={sendPullRequest}>
      Send Pull Request
    </S.Button>
  </S.FilePanel>
);

export default connect(
  null,
  {
    saveEntry,
    sendPullRequest
  }
)(FilePanel);
