import styled from "react-emotion";
import { injectGlobal, cx } from "emotion";
import { withClass } from "./utils/tools";
import React from "react";

export const injectGlobalStyle = () => injectGlobal`
  * {
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
  }
`;

export const FilePanel = styled.div`
  width: 100%;
  height: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
`;

export const FilePanelButtons = styled.div`
  color: rgba(120, 120, 120, 1);
  border-bottom: 1px solid rgba(120, 120, 120, 0.5);
  margin-bottom: 3px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  & > * {
    cursor: pointer;
    margin: 2px 2px 4px 2px;
  }
`;

export const CodePanel = styled.div`
  flex: 1;
  overflow: hidden;
  height: 100%;
`;

export const TerminalPanel = styled.div`
  flex: 0.7;
  overflow: hidden;
  height: 100%;
`;

export const DockerForm = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  & > * {
    width: 400px;
  }
`;

export const FormGroup = ({ label, children }) => (
  <dl
    css={`
      margin: 15px 0;
    `}
  >
    <dt
      css={`
        margin: 0 0 6px;
      `}
    >
      <label
        css={`
          position: static;
          font-weight: 800;
        `}
      >
        {label}
      </label>
    </dt>
    <dd>{children}</dd>
  </dl>
);

export const FormActions = withClass("form-actions")(styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`);

export const Select = withClass("form-select")(styled.select`
  width: 100%;
`);

export const Button = ({ large, transparent, children, ...rest }) => (
  <button
    className={cx(
      "btn",
      large && "btn-large",
      transparent && "btn-transparent"
    )}
    {...rest}
  >
    {children}
  </button>
);

export const Center = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  & > * {
    margin: 4px;
    width: 60%;
    max-width: 300px;
  }
`;

export const Picker = styled.div`
  display: flex;
  flex-flow: wrap;
  justify-content: center;
  max-width: 400px;
`;

export const Choice = ({
  icon,
  label,
  selected,
  color = "#0078d4",
  onSelect
}) => (
  <div
    css={`
      background-color: #fafafa;
      color: #222;
      display: inline-flex;
      position: relative;
      align-items: center;
      margin: 0 4px 4px 0;
    `}
  >
    <label
      onClick={onSelect}
      className={selected ? "selected" : ""}
      css={`
        border: 2px solid;
        border-color: ${selected ? color : "transparent"};
        padding-top: 22px;
        cursor: pointer;
        text-align: center;
        box-sizing: content-box;
        &:hover {
          border-color: ${color};
        }
        &:hover::before,
        &.selected::before {
          border: 1px solid ${color};
          right: 6px;
          top: 6px;
          content: "";
          display: inline-block;
          width: 18px;
          height: 18px;
          position: absolute;
          background-color: #fafafa;
          border-radius: 50%;
        }
        &::after {
          border: 5px solid ${color};
          right: 11px;
          top: 11px;
          content: ${selected ? "''" : ""};
          display: inline-block;
          width: 0;
          height: 0;
          position: absolute;
          border-radius: 50%;
        }
      `}
    >
      <div
        css={`
          padding-left: 30px;
          padding-right: 30px;
        `}
      >
        {icon}
      </div>
      <div
        css={`
          margin: 4px 8px;
          position: relative;
          height: 30px;
          line-height: 15px;
          overflow: hidden;
          font-size: 14px;
          font-weight: 400;
        `}
      >
        <span>{label}</span>
      </div>
    </label>
  </div>
);

const Truncate = ({ text }) => (
  <span
    className="branch-ref css-truncate css-truncate-target"
    title={text}
    style={{ maxWidth: "unset" }}
  >
    {text}
  </span>
);

export const EntryNode = ({
  collapsed,
  name,
  isTree,
  isDirty,
  isSelected,
  ...rest
}) => (
  <div
    css={`
      display: flex;
      cursor: pointer;
      color: ${isDirty ? "#eee" : "#aaa"};
      font-style: ${isDirty && "italic"};
      background: ${isSelected && !isTree && "rgba(120,120,120,0.25)"};
    `}
    {...rest}
  >
    <span
      css={`
        transform: ${collapsed && "rotate(-90deg)"};
        visibility: ${!isTree && "hidden"};
        &::after {
          content: "▾";
        }
      `}
    />
    <Truncate text={name} />
  </div>
);

export const EntryChildren = styled.div`
  overflow-y: auto;
  margin-left: 16px;
  display: ${({ hide }) => hide && "none"};
`;

export const Step = ({ label, current, done }) => (
  <div
    css={`
      width: 300px;
      padding-bottom: 15px;
    `}
  >
    <span className="text-mono">{done ? "[x] " : "[ ] "}</span>
    <span>{label}</span>
    <span>{current ? "..." : ""}</span>
  </div>
);

export const Iframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: 0;
  padding-top: 14px;
  padding-left: 14px;
  box-sizing: borderBox;
`;

export const IframeContainer = ({ onClose, children }) => (
  <div
    css={`
      position: relative;
      width: 100%;
      height: 100%;
    `}
  >
    <div
      css={`
        position: absolute;
        right: 10px;
        top: 10px;
      `}
    >
      <Button transparent onClick={onClose}>
        Close
      </Button>
    </div>
    {children}
  </div>
);
