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

  const currentPath = window.location.pathname + window.location.search;
  const { pattern, dispatcher } = Object.values(entrypoints).find(entrypoint =>
    matches(entrypoint.pattern, currentPath)
  );

  const params = extract(pattern, currentPath);
  console.log("params", params);
  dispatcher(params)(store.dispatch, store.getState);

  if ("_path" in params) {
    const newPath = params["_path"];
    const newEntrypoint = Object.values(entrypoints).find(entrypoint =>
      matches(entrypoint.pattern, newPath)
    );
    const newParams = extract(newEntrypoint.pattern, newPath);
    console.log("newParams", newParams);
    newEntrypoint.dispatcher(newParams)(store.dispatch, store.getState);
  }

  store.subscribe(() => {
    const currentPath = window.location.pathname;
    const newRoute = render(store.getState());
    if (!newRoute) {
      return;
    }
    const { pathName, params } = newRoute;
    const newPath = toPath(pathName, params);
    console.log("newpath", newPath);
    if (newPath != currentPath) {
      window.history.replaceState(null, null, newPath);
    }
  });
};
