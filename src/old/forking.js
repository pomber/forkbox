import React from "react";
import { Loader } from "./utils/hitchcock";

const Forking = ({ owner, repoName, branch, children }) => (
  <Loader getSource={sources => sources.fork(owner, repoName, branch)}>
    {boxId => children(boxId)}
  </Loader>
);

export default Forking;
