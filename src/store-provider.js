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
    "/": ["/src", "/readme.md", "/package.json"],
    "/src": ["/src/index.js"]
  },
  entry: {
    "/src": {
      sha: "123123",
      name: "src",
      path: "/src",
      isTree: true,
      collapsed: false
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
    },
    "/src/index.js": {
      sha: "123114",
      name: "index.js",
      path: "/src/index.js",
      isTree: false
    }
  }
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case "TOGGLE_ENTRY":
      const path = action.entry.path;
      const oldEntry = state.entry[path];
      const newEntry = { ...oldEntry, collapsed: !oldEntry.collapsed };
      const entries = { ...state.entry, [path]: newEntry };
      return { ...state, entry: entries };
    default:
      return state;
  }
};

const store = createStore(reducer);
