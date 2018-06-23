import React from "react";
import { Loader } from "./utils/hitchcock";
import * as S from "./styles";
import { Toggle } from "./utils/state";

const FileNode = ({ entry, selectEntry, isDirty }) => (
  // TODO: I think deferred doesn't work here because FileTree Loader is lazy
  // so the timeout is already expired when collapsed is toggled
  <Toggle startOn={true} deferred>
    {({ on: collapsed, toggle }) => (
      <div>
        <S.EntryNode
          collapsed={collapsed}
          name={entry.name}
          isTree={entry.isTree}
          isDirty={isDirty(entry.path)}
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
              isDirty={isDirty}
            />
          </S.EntryChildren>
        )}
      </div>
    )}
  </Toggle>
);

const FileTree = ({ path, lazy, selectEntry, isDirty }) => (
  <Loader
    getSource={sources => sources.tree(path)}
    placeholder={<div>Loading...</div>}
    lazy={lazy}
    subscribe
  >
    {entries =>
      entries.map(entry => (
        <FileNode
          entry={entry}
          key={entry.name}
          selectEntry={selectEntry}
          isDirty={isDirty}
        />
      ))
    }
  </Loader>
);

export default FileTree;
