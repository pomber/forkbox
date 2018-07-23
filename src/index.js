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
import tokenReducer from "./token-store";

const reducers = [reducer, tokenReducer];
const mainReducer = (state, action) => {
  console.log("action", action);
  if (!state) {
    const states = reducers.map(r => r(state, action));
    const newState = Object.assign({}, ...states);
    console.log("new state", newState);
    return newState;
  } else {
    const newState = reducers.reduce((s, r) => r(s, action), state);
    console.log("new state", newState);
    return newState;
  }
};

const store = createStore(mainReducer, applyMiddleware(thunk));
const StoreProvider = props => <Provider store={store} {...props} />;

bindRouter(store);

injectGlobalStyle();

ReactDOM.render(
  <StoreProvider>
    <App />
  </StoreProvider>,
  document.getElementById("root")
);
