import React from "react";
import { Loader } from "./hitchcock";

const TreeLoader = ({ path, children }) => (
  <Loader
    load={provider => provider.loadTree(path)}
    hash={"tree" + path}
    children={children}
    placeholder={<div>Loading...</div>}
  />
);

const FileNode = ({ entry }) => <div>{entry.name}</div>;

const FileTree = ({ path, selectEntry }) => (
  <TreeLoader path={path}>
    {entries => entries.map(entry => <FileNode entry={entry} />)}
  </TreeLoader>
);

export default FileTree;
