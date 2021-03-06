import React from "react";
const neverResolve = new Promise(() => {});

let cache = {
  resources: {},
  promises: {},
  set: (key, value) => (cache.resources[key] = value),
  getFromSource: (source, lazy) => {
    const key = source.hash();
    console.log("getFromSource", key);

    const value = source.get ? source.get(cache) : cache.resources[key];

    if (value !== undefined) {
      console.log("value", value);
      return source.view ? source.view(cache) : value;
    }

    if (!cache.promises[key] && lazy) {
      throw neverResolve;
    }

    if (!cache.promises[key]) {
      console.log("new promise", key);
      cache.promises[key] = source
        .fetch(cache)
        .then(value => {
          console.log("done", key);
          if (source.store) {
            source.store(value, cache);
          } else {
            cache.resources[key] = value;
          }
          console.log("cache", cache.resources);
        })
        .catch(error => console.error(error));
    }
    throw cache.promises[key];
  },
  getByKey: key => {
    return cache.resources[key];
  },
  write: (source, value) => {
    const key = source.hash();
    if (source.store) {
      source.store(value, cache);
    } else {
      cache.resources[key] = value;
    }
    source.write(value, cache);
  }
};

const Wrapper = ({ source, lazy, children }) =>
  source ? children(cache.getFromSource(source, lazy)) : children;

const SourcesContext = React.createContext();

export const Loader = ({
  getSource,
  placeholder,
  lazy,
  defaultValue,
  children
}) => (
  <SourcesContext.Consumer>
    {sources => (
      // TODO check https://developers.google.com/web/fundamentals/performance/rail
      <React.Timeout ms={300}>
        {didTimeout =>
          didTimeout ? (
            defaultValue !== undefined ? (
              <Wrapper>{children(defaultValue)}</Wrapper>
            ) : (
              <Wrapper>{placeholder}</Wrapper>
            )
          ) : (
            <Wrapper source={getSource(sources)} lazy={lazy}>
              {children}
            </Wrapper>
          )
        }
      </React.Timeout>
    )}
  </SourcesContext.Consumer>
);

export const Writer = ({ getSource, children }) => (
  <SourcesContext.Consumer>
    {sources => {
      getSource(sources).store(cache);
      return children;
    }}
  </SourcesContext.Consumer>
);

export const SourcesProvider = ({ sources, children }) => (
  <SourcesContext.Provider value={sources}>{children}</SourcesContext.Provider>
);

export function MissingValue(key) {
  this.key = key;
  this.isMissingValue = true;
}
