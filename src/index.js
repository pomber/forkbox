import React from "react";
import ReactDOM from "react-dom";
import { injectGlobalStyle } from "./styles";
import "./primer.css";
import App from "./app";
import StoreProvider from "./store-provider";

injectGlobalStyle();

ReactDOM.render(
  <StoreProvider>
    <App />
  </StoreProvider>,
  document.getElementById("root")
);
