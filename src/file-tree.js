import React from "react";

const TreeLoader = ({ path, children }) =>
  children({
    entries: [{ name: "foo" }, { name: "bar.txt" }, { name: "baz.txt" }]
  });

const FileNode = ({ entry }) => <div>{entry.name}</div>;

const FileTree = ({ path, selectEntry }) => (
  <TreeLoader path={path}>
    {({ entries }) => entries.map(entry => <FileNode entry={entry} />)}
  </TreeLoader>
);

export default FileTree;
