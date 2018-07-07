const ForkPage = ({ owner, repoName, branch }) => (
  <React.Fragment>
    <Forking owner={owner} repoName={repoName} />
    <Box owner={owner} repoName={repoName} branch={branch} />
  </React.Fragment>
);

const BoxPage = ({ owner, repoName, branch, isRepoForked }) => (
  <React.Fragment>
    <If condition={!isRepoForked}>
      <Action
        type={FORK}
        vars={{ owner, repoName, branch }}
        then={({ user, boxBranch }) =>
          redirectTo(`/x/${user}/${repoName}/${boxBranch}`)
        }
      />
    </If>
    <Box owner={owner} repoName={repoName} branch={branch} />
  </React.Fragment>
);

// option 2: store current repo in cache, and fork it if
// por que la action devuelve cosas? esta bien, devuelve cache[REPO]
const BoxPage2 = ({ owner, repoName, branch }) => (
  <Action type={REPO} vars={{ owner, repoName, branch }}>
    {({ isRepoForked, user, boxBranch }) => (
      <React.Fragment>
        <Url
          path={
            isRepoForked
              ? `/x/${user}/${repoName}/${boxBranch}`
              : `/f/${owner}/${repoName}/${branch}`
          }
        />
        <If condition={!isRepoForked}>
          <Action type={FORK} />
        </If>
        <Box />
      </React.Fragment>
    )}
  </Action>
);

const getKey = (type, vars) => type;
const action = (type, vars, cache) => {
  const key = getKey(type, vars);
  switch (type) {
    case REPO:
      return cache.write(key, vars);
    case FORK:
      const { owner, repoName, baseBranch } = cache.readOrFail(REPO);
      const token = cache.readWaitOrFail(GH_TOKEN);
      const { repoId } = waitFor(key, actions.fork(token, owner, repoName));
      cache.write(key, { isRepoForked: true });
  }
};

const Action = ({ type, vars, children }) => (
  <CacheProvider>
    {cache => <Component didMount={() => action(type, vars, cache)} />}
  </CacheProvider>
);

/**
 * Fork(owner, repoName) -> repoId
 * Branch(repoId, baseBranchName) -> boxBranchName
 *
 */
