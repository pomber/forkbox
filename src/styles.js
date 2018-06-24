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

export const Box = styled.div`
  display: flex;
  flex-direction: row;
  background: #222;
  color: #fafafa;
  height: 100%;
`;

export const FilePanel = styled.div`
  width: 200px;
  height: 100%;
  padding: 10px;
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
`;

export const TerminalPanel = styled.div`
  flex: 0.7;
  overflow: hidden;
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

export const Button = ({ large, transparent, children }) => (
  <button
    className={cx(
      "btn",
      large && "btn-large",
      transparent && "btn-transparent"
    )}
  >
    {children}
  </button>
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
