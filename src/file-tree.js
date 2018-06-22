import React from "react";
import { Loader } from "./utils/hitchcock";
import * as S from "./styles";
import { Toggle } from "./utils/state";

const FileNode = ({ entry, selectEntry }) => (
  <Toggle startOn={true}>
    {({ on: collapsed, toggle }) => (
      <div>
        <S.EntryNode
          collapsed={collapsed}
          name={entry.name}
          isTree={entry.isTree}
          onClick={() => {
            toggle();
            selectEntry(entry);
          }}
        />
        {entry.isTree && (
          <S.EntryChildren hide={collapsed}>
            <FileTree
              path={entry.path}
              lazy={collapsed}
              selectEntry={selectEntry}
            />
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
      entries.map(entry => (
        <FileNode entry={entry} key={entry.name} selectEntry={selectEntry} />
      ))
    }
  </Loader>
);

export default FileTree;
