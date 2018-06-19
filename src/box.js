import React from "react";
import { Loader } from "./utils/hitchcock";
import FileTree from "./file-tree";
import * as S from "./styles";

const Box = ({ user, repoName, boxId }) => (
  <Loader
    getSource={sources => sources.repo(user, repoName, boxId)}
    placeholder={<div>Loading...</div>}
  >
    {repoInfo => <FileTree path="/" />}
  </Loader>
);

export default Box;
