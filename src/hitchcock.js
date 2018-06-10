import React from "react";

let promises = {};

let cache = {};

const get = loader => {
  const key = loader.hash();
  const value = cache[key];
  if (value) return value;

  if (!promises[key]) {
    promises[key] = loader.load().then(tree => (cache[key] = tree));
  }
  throw promises[key];
};

const ProviderContext = React.createContext();

const Wrapper = ({ loader, children }) =>
  loader ? children(get(loader)) : children;

export const Loader = ({ load, placeholder, children }) => (
  <ProviderContext.Consumer>
    {provider => (
      <React.Timeout ms={0}>
        {didTimeout =>
          didTimeout ? (
            <Wrapper>{placeholder}</Wrapper>
          ) : (
            <Wrapper loader={load(provider)}>{children}</Wrapper>
          )
        }
      </React.Timeout>
    )}
  </ProviderContext.Consumer>
);

export const LoaderProvider = ({ provider, children }) => (
  <ProviderContext.Provider value={provider}>
    {children}
  </ProviderContext.Provider>
);
