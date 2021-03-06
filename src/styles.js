import styled from "react-emotion";
import { injectGlobal, fontFace, cx } from "emotion";
import { withClass } from "./utils/tools";
import React from "react";
import "./seti.woff";

export const injectGlobalStyle = () => injectGlobal`
  * {
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  @font-face {
    font-family: 'seti';
    src: url('/fonts/seti.woff');
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
  display: flex;
  margin: 0 auto;
  padding: 0;
  width: 100%;
  justify-content: flex-end;
`;

export const NewFileButton = styled.div`
  width: 28px;
  height: 22px;
  background-size: 16px;
  background-position: 50%;
  background-repeat: no-repeat;
  margin-right: 0;
  background: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Cpath fill='%23C5C5C5' d='M12 3H8v1h3v3h3v7H6V8H5v7h10V6z'/%3E%3Cpath fill='%2389D185' d='M7 3.018H5V1H3.019v2.018H1V5h2.019v2H5V5h2V3.018z'/%3E%3C/svg%3E")
    50% no-repeat;
  cursor: pointer;
`;

export const NewFolderButton = styled.div`
  width: 28px;
  height: 22px;
  background-size: 16px;
  background-position: 50%;
  background-repeat: no-repeat;
  margin-right: 0;
  cursor: pointer;
  background: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Cpath fill='%23C5C5C5' d='M14 4H9.618l-1 2H6v2H3v6h12V4h-1zm0 2h-3.882l.5-1H14v1z'/%3E%3Cpath fill='%2389D185' d='M7 3.018H5V1H3.019v2.018H1V5h2.019v2H5V5h2z'/%3E%3C/svg%3E")
    50% no-repeat;
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
  color: #ccc;
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
  icon,
  ...rest
}) => (
  <div
    css={`
      height: 22px;
      display: flex;
      cursor: pointer;
      color: ${isDirty ? "#e2c08d" : "#ccc"};
      font-size: 13px;
      line-height: 22px;
      user-select: none;
      font-family: -apple-system, BlinkMacSystemFont, Segoe WPC, Segoe UI,
        HelveticaNeue-Light, Ubuntu, Droid Sans, sans-serif;
      background: ${isSelected && !isTree && "rgba(120,120,120,0.25)"};
    `}
    {...rest}
  >
    {isTree ? (
      <span
        css={`
        box-sizing: content-box;
          background-size: 16px;
          background-position: 50% 50%;
          background-repeat: no-repeat;
          padding-right: 6px;
          width: 16px;
          height: 22px;
          display: inline-block;
          vertical-align: top;
          content: " ";
          background-image: url("${
            collapsed
              ? "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%23E8E8E8' d='M6 4v8l4-4-4-4zm1 2.414L8.586 8 7 9.586V6.414z'/%3E%3C/svg%3E"
              : "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%23E8E8E8' d='M11 10H5.344L11 4.414V10z'/%3E%3C/svg%3E"
          }");
        `}
      />
    ) : (
      <span
        css={`
          &::after {
            background-size: 16px;
            background-position: 0;
            background-repeat: no-repeat;
            padding-right: 6px;
            width: 16px;
            height: 22px;
            display: inline-block;
            -webkit-font-smoothing: antialiased;
            vertical-align: top;
            flex-shrink: 0;

            font-family: seti;
            font-size: 150%;
            content: "${icon.fontCharacter}";
            color: ${icon.fontColor};
          }
        `}
      />
    )}

    <Truncate text={name} />
  </div>
);

export const EntryChildren = styled.div`
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
  padding: 0;
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
