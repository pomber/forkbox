import React from "react";
import { Loader } from "./utils/hitchcock";
import { State } from "./utils/state";
import FilePanel from "./file-panel";
import CodePanel from "./code-panel";
import * as S from "./styles";
import { getLanguage } from "./utils/gh-entry";

const BoxState = ({ children }) => (
  <State
    init={{ selectedTree: "/", selectedBlob: "/README.md", editedText: {} }}
    map={(s, ss, dss) => ({
      ...s,
      selectEntry: entry =>
        entry.isTree
          ? dss({ selectedTree: entry.path })
          : dss({ selectedBlob: entry.path, selectedTree: entry.path }),
      isDirty: path => path in s.editedText,
      isSelected: entry =>
        entry.isTree
          ? entry.path === s.selectedTree
          : entry.path === s.selectedBlob,
      updateText: text =>
        ss(ps => ({
          editedText: { ...ps.editedText, ...{ [ps.selectedBlob]: text } }
        })),
      currentText: originalText => s.editedText[s.selectedBlob] || originalText
    })}
  >
    {children}
  </State>
);

const Box = ({ user, repoName, boxId }) => (
  <S.Box>
    <Loader
      getSource={sources => sources.repo(user, repoName, boxId)}
      placeholder={<div>Loading box...</div>}
    >
      {repoInfo => (
        <BoxState>
          {({
            selectedTree,
            selectedBlob,
            selectEntry,
            updateText,
            currentText,
            isDirty,
            isSelected
          }) => (
            <React.Fragment>
              <FilePanel
                selectEntry={selectEntry}
                isDirty={isDirty}
                isSelected={isSelected}
              />
              <Loader
                getSource={sources => sources.blobText(selectedBlob)}
                placeholder={<div>Loading...</div>}
              >
                {text => (
                  <CodePanel
                    text={currentText(text)}
                    language={getLanguage(selectedBlob)}
                    onChange={updateText}
                  />
                )}
              </Loader>
            </React.Fragment>
          )}
        </BoxState>
      )}
    </Loader>
  </S.Box>
);

export default Box;
