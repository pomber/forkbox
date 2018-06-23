import React from "react";
import { Loader } from "./utils/hitchcock";
import { State } from "./utils/state";
import FilePanel from "./file-panel";
import CodePanel from "./code-panel";
import * as S from "./styles";

const Box = ({ user, repoName, boxId }) => (
  <S.Box>
    <Loader
      getSource={sources => sources.repo(user, repoName, boxId)}
      placeholder={<div>Loading box...</div>}
    >
      {repoInfo => (
        <State
          init={{ selectedTree: "/", selectedBlob: "/README.md" }}
          map={(s, ss) => ({
            ...s,
            selectEntry: entry =>
              entry.isTree
                ? ss({ selectedTree: entry.path })
                : ss({ selectedBlob: entry.path, selectedTree: entry.path })
          })}
        >
          {({ selectedTree, selectedBlob, selectEntry }) => (
            <React.Fragment>
              <FilePanel selectEntry={selectEntry} />
              <CodePanel path={selectedBlob} />
            </React.Fragment>
          )}
        </State>
      )}
    </Loader>
  </S.Box>
);

export default Box;
