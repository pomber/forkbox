import React from "react";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { reducer } from "./reducers";

const store = createStore(reducer, applyMiddleware(thunk));
const StoreProvider = props => <Provider store={store} {...props} />;

export default StoreProvider;
