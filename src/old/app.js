import React from "react";

import Box from "./box";
import { Link, Router, Redirect } from "@reach/router";
import { Writer } from "./utils/hitchcock";
import { ErrorBoundary } from "./utils/state";
import Forking from "./forking";
import ReduxApp from "./v2/app";

const ForkPage = ({ owner, repoName, branch }) => (
  <React.Fragment>
    <Forking user={owner} repoName={repoName} branch={branch}>
      {({ user, boxId }) => <Redirect to={`/x/${user}/${repoName}/${boxId}`} />}
    </Forking>
    <Box user={owner} repoName={repoName} branch={branch} />
  </React.Fragment>
);

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

const ZeitCodeWriter = props => {
  const query = new URLSearchParams(props.location.search);
  const code = query.get("code");
  const redirect = query.get("state");
  return (
    <Writer getSource={sources => sources.zeitCode(code)}>
      <Redirect to={redirect} />
    </Writer>
  );
};

const getGhAuthUrl = (origin, path) =>
  `https://github.com/login/oauth/authorize?scope=public_repo&client_id=${
    process.env.GH_CLIENT_ID
  }&redirect_uri=${origin}/gh-callback${path}`;

const BoxPage = ({ location, boxId, ...rest }) => (
  <ErrorBoundary
    when={error => error.isMissingValue && error.key === "gh-code"}
    catch={() =>
      window.location.replace(getGhAuthUrl(location.origin, location.pathname))
    }
  >
    <Box {...rest} branch={"forkbox-" + boxId} />
  </ErrorBoundary>
);

const App = () => (
  <Router style={{ height: "100%" }}>
    <Landing path="/" />
    <GhCodeWriter path="/gh-callback/*" />
    <ZeitCodeWriter path="/zeit-callback/*" />
    <ReduxApp path="/f/:owner/:repoName" branch="master" />
    <ReduxApp path="/f/:owner/:repoName/:branch" />
    <BoxPage path="/x/:user/:repoName/:boxId" />
  </Router>
);

export default App;
