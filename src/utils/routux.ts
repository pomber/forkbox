import pathMatch from "path-match";
import pathToRegexp from "path-to-regexp";

export const matches = (pattern: string, path: string): boolean => {
  const withoutQuery = pattern.split("?")[0];
  return pathMatch()(withoutQuery)(path);
};

export const extract = (pattern: string, path: string) => {
  const patternWithoutQuery = pattern.split("?")[0];
  const pathWithoutQuery = path.split("?")[0];
  const result = pathMatch()(patternWithoutQuery)(pathWithoutQuery);
  Object.keys(result).forEach(key => {
    const value = result[key];
    if (value instanceof Array) {
      result[key] = value.join("/");
      if (key === "_path") {
        result[key] = "/" + result[key];
      }
    }
  });
  const queryRegex = /([^=?&]+)=:([^&]+)/g;

  const queryParams = new URLSearchParams(path.split("?")[1]);
  let match = [];
  while ((match = queryRegex.exec(pattern))) {
    const [_, queryKey, keyName] = match;
    result[keyName] = queryParams.get(queryKey);
  }

  return result;
};

interface EntryPoint {
  pattern: string;
  dispatcher: (params: any) => any;
}

type EntryPoints = { [K in keyof any]: EntryPoint };

export const bind = (store, entrypoints: EntryPoints, render) => {
  const toPath = (pathName, params) =>
    pathToRegexp.compile(entrypoints[pathName].pattern)(params);

  const currentPath = window.location.pathname;
  const { pattern, dispatcher } = Object.values(entrypoints).find(entrypoint =>
    matches(entrypoint.pattern, currentPath)
  );

  const params = extract(pattern, currentPath);
  dispatcher(params)(store.dispatch, store.getState);

  // TODO fix callbacks
  // if ("_path" in params) {
  // }

  store.subscribe(() => {
    const currentPath = window.location.pathname;
    const { pathName, params } = render(store.getState());
    const newPath = toPath(pathName, params);
    console.log("newpath", newPath);
    if (newPath != currentPath) {
      window.history.replaceState(null, null, newPath);
    }
  });
};
