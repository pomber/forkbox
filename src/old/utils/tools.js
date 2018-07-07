import React from "react";

export const withClass = className => Component => props => {
  const { originalClassName, ...rest } = props;
  const newClassName = originalClassName
    ? originalClassName + " " + className
    : className;
  const newProps = { ...rest, className: newClassName };
  return <Component {...newProps} />;
};
