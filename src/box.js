import React from "react";
import { Loader } from "./utils/hitchcock";
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
        <React.Fragment>
          <FilePanel selectEntry={e => console.log(e)} />
          <CodePanel />
        </React.Fragment>
      )}
    </Loader>
  </S.Box>
);

export default Box;
