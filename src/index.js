import React from "react";
import ReactDOM from "react-dom";
import { injectGlobalStyle } from "./styles";
import "./primer.css";
import App from "./app";
import StoreProvider from "./store-provider";
import router from "./router";

injectGlobalStyle();

let result = router.parseUrl();
console.log(result);
const { repoOwner, repoName, baseBranch, ghCode, zeitCode } = result;

router.rewriteUrl();

ReactDOM.render(
  <StoreProvider>
    <App
      owner={repoOwner}
      repoName={repoName}
      baseBranch={baseBranch}
      ghCode={ghCode}
      zeitCode={zeitCode}
    />
  </StoreProvider>,
  document.getElementById("root")
);
