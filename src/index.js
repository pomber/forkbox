import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { reducer } from "./reducers";
import "./primer.css";
import App from "./app";
import { injectGlobalStyle } from "./styles";
import { bindRouter } from "./router-new";

const store = createStore(reducer, applyMiddleware(thunk));
const StoreProvider = props => <Provider store={store} {...props} />;

bindRouter(store);

injectGlobalStyle();

ReactDOM.render(
  <StoreProvider>
    <App />
  </StoreProvider>,
  document.getElementById("root")
);
