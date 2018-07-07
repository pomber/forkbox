import React from "react";
import * as S from "./styles";
import { connect } from "react-redux";

const FileNode = ({ entry }) => (
  <div>
    <S.EntryNode collapsed={true} name={entry.name} isTree={entry.isTree} />
  </div>
);

const FileTree = ({ entries }) => (
  <div>{entries.map(entry => <FileNode entry={entry} key={entry.name} />)}</div>
);

const mapStateToProps = (state, { path }) => {
  const tree = state.tree[path];
  const entries = tree.map(entryPath => state.entry[entryPath]);
  return { entries };
};

export default connect(mapStateToProps)(FileTree);
