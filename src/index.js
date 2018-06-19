import React from "react";
import ReactDOM from "react-dom";
import { SourcesProvider } from "./utils/hitchcock";
import sources from "./github-sources";
import App from "./app";

ReactDOM.render(
  <React.unstable_AsyncMode>
    <SourcesProvider sources={sources}>
      <App />
    </SourcesProvider>
  </React.unstable_AsyncMode>,
  document.getElementById("root")
);
