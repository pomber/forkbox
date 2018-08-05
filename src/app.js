import React from "react";
import * as S from "./styles";
import FilePanel from "./file-panel";
import CodePanel from "./code-panel";
import TerminalPanel from "./terminal-panel";
import SplitPane from "react-split-pane";
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

class App extends React.Component {
  render() {
    return (
      <SplitPane
        split="vertical"
        defaultSize="33%"
        style={{
          background: "#222",
          height: "100%"
        }}
        onDragFinished={() => resizeEmitter.trigger()}
      >
        <FilePanel />
        <SplitPane
          split="vertical"
          defaultSize="50%"
          style={{ height: "100%" }}
          onDragFinished={() => resizeEmitter.trigger()}
        >
          <CodePanel resizeEmitter={resizeEmitter} />
          <TerminalPanel />
        </SplitPane>
      </SplitPane>
    );
  }
}

export default App;
