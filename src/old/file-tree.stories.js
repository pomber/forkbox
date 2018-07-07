import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import FileTree from "./file-tree";
import { SourcesProvider } from "./utils/hitchcock";
// import sources from "./mock-sources";
import sources from "./fetchers/github-sources";

storiesOf("FileTree", module).add("with text", () => (
  <React.unstable_AsyncMode>
    <SourcesProvider sources={sources}>
      <FileTree path="/" />
    </SourcesProvider>
  </React.unstable_AsyncMode>
));
