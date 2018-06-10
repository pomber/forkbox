import React from "react";

let promises = {};

let cache = {};

const get = (load, hash) => {
  const key = hash;
  const value = cache[key];
  if (value) return value;

  if (!promises[key]) {
    promises[key] = load().then(tree => (cache[key] = tree));
  }
  throw promises[key];
};

const Wrapper = ({ load, hash, children }) =>
  load ? children(get(load, hash)) : children;

export const Loader = ({ load, hash, placeholder, children }) => (
  <React.Timeout ms={0}>
    {didTimeout =>
      didTimeout ? (
        <Wrapper>{placeholder}</Wrapper>
      ) : (
        <Wrapper load={load} hash={hash}>
          {children}
        </Wrapper>
      )
    }
  </React.Timeout>
);
