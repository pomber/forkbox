import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Box from "./box";
import { SourcesProvider } from "./utils/hitchcock";
// import sources from "./mock-sources";
import sources from "./github-sources";

storiesOf("Box", module).add("-", () => (
  <React.unstable_AsyncMode>
    <SourcesProvider sources={sources}>
      <Box
        user="pomber"
        repoName="paper-fab-speed-dial"
        boxId="1529352777163"
      />
    </SourcesProvider>
  </React.unstable_AsyncMode>
));
