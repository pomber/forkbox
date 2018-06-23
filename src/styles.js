import styled from "react-emotion";
import { injectGlobal } from "emotion";
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

export const Box = ({ children }) => (
  <div
    css={`
      display: flex;
      flex-direction: row;
      background: #222;
      color: #fafafa;
      height: 100%;
    `}
  >
    {children}
  </div>
);

export const FilePanel = ({ children }) => (
  <div
    css={`
      width: 200px;
      height: 100%;
      padding: 10px;
    `}
  >
    {children}
  </div>
);

export const FilePanelButtons = ({ children }) => (
  <div
    css={`
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
    `}
  >
    {children}
  </div>
);

export const CodePanel = ({ children }) => (
  <div
    css={`
      flex: 1;
      overflow: hidden;
    `}
  >
    {children}
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

export const EntryChildren = ({ children, hide, ...rest }) => (
  <div
    css={`
      overflow-y: auto;
      margin-left: 16px;
      display: ${hide && "none"};
    `}
    {...rest}
  >
    {children}
  </div>
);
