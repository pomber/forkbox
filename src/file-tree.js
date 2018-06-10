import React from "react";
import { Loader } from "./hitchcock";

const loadTree = path => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{ name: "foo" }, { name: "bar.txt" }, { name: "baz.txt" }]);
    }, 1000);
  });
};

const TreeLoader = ({ path, children }) => (
  <Loader
    load={() => loadTree(path)}
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
