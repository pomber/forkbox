import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";

const StoreProvider = props => <Provider store={store} {...props} />;

export default StoreProvider;

const defaultState = {
  baseRepo: {
    owner: "forkboxlabs",
    name: "sb-todo-sample"
  },
  boxRepo: {
    id: 123123
  },
  boxInfo: {
    baseBranch: "master",
    id: null, //123123
    boxBranch: null //"forkbox-123123"
  },
  tree: {
    "/": ["/foo", "/readme.md", "/package.json"]
  },
  entry: {
    "/foo": {
      sha: "123123",
      name: "foo",
      path: "/foo",
      isTree: true
    },
    "/readme.md": {
      sha: "123124",
      name: "readme.md",
      path: "/readme.md",
      isTree: false
    },
    "/package.json": {
      sha: "123114",
      name: "package.json",
      path: "/package.json",
      isTree: false
    }
  }
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case "foo":
      return state;
    default:
      return state;
  }
};

const store = createStore(reducer);
