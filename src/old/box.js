import React from "react";
import { Loader } from "./utils/hitchcock";
import { State } from "./utils/state";
import FilePanel from "./file-panel";
import CodePanel from "./code-panel";
import TerminalPanel from "./terminal-panel";
import * as S from "./styles";
import { getLanguage } from "./utils/gh-entry";

const BoxState = ({ saveText, children }) => (
  <State
    init={{ selectedTree: "/", selectedBlob: "/README.md", editedText: {} }}
    map={(s, ss, dss) => ({
      ...s,
      selectEntry: entry =>
        entry.isTree
          ? dss({ selectedTree: entry.path })
          : dss({ selectedBlob: entry.path, selectedTree: entry.path }),
      isDirty: path => s.editedText[path],
      isSelected: entry =>
        entry.isTree
          ? entry.path === s.selectedTree
          : entry.path === s.selectedBlob,
      updateText: text =>
        ss(ps => ({
          editedText: { ...ps.editedText, ...{ [ps.selectedBlob]: text } }
        })),
      currentText: originalText => s.editedText[s.selectedBlob] || originalText,
      onSave: () => {
        saveText(s.selectedBlob, s.editedText[s.selectedBlob]);
        dss(ps => ({
          editedText: { ...ps.editedText, [s.selectedBlob]: null }
        }));
      }
    })}
  >
    {children}
  </State>
);

const Box = ({ user, repoName, branch }) => (
  <S.Box>
    <Loader
      getSource={sources => sources.repo(user, repoName, branch)}
      placeholder={<div>Loading box...</div>}
    >
      {({ repoInfo, saveText }) => (
        <BoxState saveText={saveText}>
          {({
            selectedTree,
            selectedBlob,
            selectEntry,
            updateText,
            currentText,
            isDirty,
            isSelected,
            onSave
          }) => (
            <React.Fragment>
              <FilePanel
                selectEntry={selectEntry}
                isDirty={isDirty}
                isSelected={isSelected}
                onSave={onSave}
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
              <TerminalPanel />
            </React.Fragment>
          )}
        </BoxState>
      )}
    </Loader>
  </S.Box>
);

export default Box;
