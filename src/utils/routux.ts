import pathMatch from "path-match";
import pathToRegexp from "path-to-regexp";

export const matches = (pattern: string, path: string): boolean => {
  const withoutQuery = pattern.split("?")[0];
  return pathMatch()(withoutQuery)(path);
};

export const extract = (pattern: string, path: string) => {
  return pathMatch()(pattern)(path);
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
