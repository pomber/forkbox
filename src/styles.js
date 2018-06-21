import styled from "react-emotion";
import React from "react";

const Truncate = ({ text }) => (
  <span
    className="branch-ref css-truncate css-truncate-target"
    title={text}
    style={{ maxWidth: "unset" }}
  >
    {text}
  </span>
);

export const EntryNode = ({ collapsed, name, isTree, ...rest }) => (
  <div
    css={`
      display: flex;
      cursor: pointer;
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
