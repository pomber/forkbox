import React from "react";
import * as S from "./styles";
import { connect } from "react-redux";
import { selectEntry } from "./dispatchers";
import { getIcon } from "./utils/gh-entry";

const FileNode = ({ entry, selectEntry }) => (
  <div>
    <S.EntryNode
      collapsed={entry.collapsed}
      name={entry.name}
      isTree={entry.isTree}
      isDirty={entry.isDirty}
      isSelected={entry.isSelected}
      icon={getIcon(entry.path)}
      onClick={() => selectEntry(entry)}
    />
    {entry.isTree && (
      <S.EntryChildren hide={entry.collapsed}>
        <FileTree path={entry.path} />
      </S.EntryChildren>
    )}
  </div>
);

const FileTreeComponent = ({ entries, selectEntry }) => (
  <div>
    {entries.map(entry => (
      <FileNode entry={entry} key={entry.name} selectEntry={selectEntry} />
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
  selectEntry
};

const FileTree = connect(
  mapStateToProps,
  mapDispatchToProps
)(FileTreeComponent);

export default FileTree;
