import React from "react";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import * as actions from "./actions";

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
    case actions.TOGGLE_ENTRY:
      const path = action.entry.path;
      const oldEntry = state.entry[path];
      const newEntry = {
        ...oldEntry,
        collapsed: !oldEntry.collapsed,
        loaded: true
      };
      const entries = { ...state.entry, [path]: newEntry };
      return { ...state, entry: entries };
    case actions.RECEIVE_REPO:
      const { result } = action;
      const entryList = mapEntries("/", result.object.entries);
      const tree = { "/": entryList.map(e => e.path) };
      const entries2 = Object.assign(
        {},
        ...entryList.map(e => ({ [e.path]: e }))
      );
      return { ...state, tree, entry: entries2 };
    case actions.RECEIVE_TREE:
      console.log(action);
      return state;
    default:
      return state;
  }
};

const store = createStore(reducer, applyMiddleware(thunk));

// utils

const entryValue = e => (e.isTree ? "0" + e.name : "1" + e.name);
const entryComparer = (a, b) => entryValue(a).localeCompare(entryValue(b));
const mapEntries = (parentPath, entries) =>
  entries
    .map(entry => ({
      ...entry,
      byteSize: entry.object && entry.object.byteSize,
      isTree: entry.type === "tree",
      path: `${parentPath}${entry.name}${entry.type === "tree" ? "/" : ""}`,
      collapsed: true
    }))
    .sort(entryComparer);
