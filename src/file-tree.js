import React from "react";
import { Loader } from "./utils/hitchcock";
import * as S from "./styles";
import { Toggle } from "./utils/state";

const FileNode = ({ entry }) => (
  <Toggle startOn={true}>
    {({ on: collapsed, toggle }) => (
      <div>
        <S.EntryNode
          collapsed={collapsed}
          name={entry.name}
          isTree={entry.isTree}
          onClick={toggle}
        />
        {entry.isTree && (
          <S.EntryChildren hidden={collapsed}>
            <FileTree path={entry.path} lazy={collapsed} />
          </S.EntryChildren>
        )}
      </div>
    )}
  </Toggle>
);

const FileTree = ({ path, lazy, selectEntry }) => (
  <Loader
    getSource={sources => sources.tree(path)}
    placeholder={<div>Loading...</div>}
    lazy={lazy}
    subscribe
  >
    {entries =>
      entries.map(entry => <FileNode entry={entry} key={entry.name} />)
    }
  </Loader>
);

export default FileTree;
