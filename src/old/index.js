import React from "react";
import ReactDOM from "react-dom";
import { SourcesProvider } from "./utils/hitchcock";
import sources from "./github-sources";
import App from "./app";
import { injectGlobalStyle } from "./styles";
import "./primer.css";

injectGlobalStyle();

const root = ReactDOM.unstable_createRoot(document.getElementById("root"));
root.render(
  <SourcesProvider sources={sources}>
    <App />
  </SourcesProvider>
);