import React from "react";
import * as S from "./styles";
import FilePanel from "./file-panel";
import CodePanel from "./code-panel";
import TerminalPanel from "./terminal-panel";
import SplitPane from "react-split-pane";
import { connect } from "react-redux";
import "./resizer.css";

const resizeEmitter = {
  listeners: [],
  subscribe(listener) {
    this.listeners.push(listener);
  },
  trigger() {
    this.listeners.forEach(cb => cb());
  }
};

window.addEventListener("resize", () => resizeEmitter.trigger());

const App = ({ isHome }) =>
  isHome ? (
    <h1>Comming Soon</h1>
  ) : (
    <SplitPane
      split="vertical"
      defaultSize={220}
      style={{
        background: "#222",
        height: "100%"
      }}
      onDragFinished={() => resizeEmitter.trigger()}
    >
      <FilePanel />
      <SplitPane
        split="vertical"
        defaultSize="60%"
        style={{ height: "100%" }}
        onDragFinished={() => resizeEmitter.trigger()}
      >
        <CodePanel resizeEmitter={resizeEmitter} />
        <TerminalPanel />
      </SplitPane>
    </SplitPane>
  );

const mapStateToProps = ({ isHome }) => ({ isHome });

export default connect(mapStateToProps)(App);
