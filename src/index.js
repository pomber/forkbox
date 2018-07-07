import React from "react";
import ReactDOM from "react-dom";
import { injectGlobalStyle } from "./styles";
import "./primer.css";
import App from "./app";
import StoreProvider from "./store-provider";

injectGlobalStyle();

//TODO get props from url
ReactDOM.render(
  <StoreProvider>
    <App
      owner="forkboxlabs"
      repoName="react-storybook-demo"
      baseBranch="master"
    />
  </StoreProvider>,
  document.getElementById("root")
);
