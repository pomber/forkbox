import React from "react";

import Box from "./box";
import { Link, Router, Redirect } from "@reach/router";
import { Writer } from "./utils/hitchcock";
import { ErrorBoundary } from "./utils/state";

const Landing = () => (
  <div>
    <Link to="/x/pomber/paper-fab-speed-dial/1529352777163">Sample Repo</Link>
  </div>
);

const GhCodeWriter = props => {
  const code = new URLSearchParams(props.location.search).get("code");
  const redirect = "/" + props["*"];
  return (
    <Writer getSource={sources => sources.code(code)}>
      <Redirect to={redirect} />
    </Writer>
  );
};

const getGhAuthUrl = (origin, path) =>
  `https://github.com/login/oauth/authorize?scope=public_repo&client_id=${
    process.env.GH_CLIENT_ID
  }&redirect_uri=${origin}/gh-callback${path}`;

const BoxPage = ({ location, ...rest }) => (
  <ErrorBoundary
    when={error => error.isMissingValue && error.key === "gh-code"}
    catch={() =>
      window.location.replace(getGhAuthUrl(location.origin, location.pathname))
    }
  >
    <Box {...rest} />
  </ErrorBoundary>
);

const App = () => (
  <Router>
    <Landing path="/" />
    <GhCodeWriter path="/gh-callback/*" />
    <BoxPage path="/x/:user/:repoName/:boxId" />
  </Router>
);

export default App;
