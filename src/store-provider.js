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
  entries: {
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
      const oldEntry = state.entries[path];
      const newEntry = {
        ...oldEntry,
        collapsed: !oldEntry.collapsed,
        loaded: true
      };
      const entries = { ...state.entries, [path]: newEntry };
      return { ...state, entries: entries };
    case actions.RECEIVE_REPO:
      const { result } = action;
      const entryList = mapEntries("/", result.object.entries);
      const tree = { "/": entryList.map(e => e.path) };
      const entries2 = Object.assign(
        {},
        ...entryList.map(e => ({ [e.path]: e }))
      );
      return { ...state, tree, entries: entries2, repoId: result.id };
    case actions.RECEIVE_TREE:
      console.log(action);
      const entryList2 = mapEntries(action.path, action.entries);
      const tree2 = {
        ...state.tree,
        [action.path]: entryList2.map(e => e.path)
      };
      const entries3 = Object.assign(
        {},
        state.entries,
        ...entryList2.map(e => ({ [e.path]: e }))
      );
      return { ...state, tree: tree2, entries: entries3 };
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
