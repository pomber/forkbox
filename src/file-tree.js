import React from "react";
import * as S from "./styles";
import { connect } from "react-redux";
import { toggleEntry } from "./dispatchers";

const FileNode = ({ entry, toggleEntry }) => (
  <div>
    <S.EntryNode
      collapsed={entry.collapsed}
      name={entry.name}
      isTree={entry.isTree}
      isSelected={entry.isSelected}
      onClick={() => toggleEntry(entry)}
    />
    {entry.isTree && (
      <S.EntryChildren hide={entry.collapsed}>
        <FileTree path={entry.path} />
      </S.EntryChildren>
    )}
  </div>
);

const FileTreeComponent = ({ entries, toggleEntry }) => (
  <div>
    {entries.map(entry => (
      <FileNode entry={entry} key={entry.name} toggleEntry={toggleEntry} />
    ))}
  </div>
);

const mapStateToProps = (state, { path }) => {
  //TODO memoize
  const tree = state.tree[path];
  const entries = tree ? tree.map(entryPath => state.entries[entryPath]) : [];
  return { entries };
};

const mapDispatchToProps = {
  toggleEntry
};

const FileTree = connect(
  mapStateToProps,
  mapDispatchToProps
)(FileTreeComponent);

export default FileTree;
