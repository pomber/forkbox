import { matches, extract } from "./routux";

const newBoxPattern = "/f/:baseRepoOwner/:repoName/:baseBranchName*";
const newBoxPath = "/f/owner/repo/branch";

it("matches new box pattern", () => {
  expect(matches(newBoxPattern, newBoxPath)).toBeTruthy();
  expect(matches(newBoxPattern, boxPath)).toBeFalsy();
});

it("extract new box params", () => {
  expect(extract(newBoxPattern, "/f/owner/repo/branch")).toEqual({
    baseRepoOwner: "owner",
    repoName: "repo",
    baseBranchName: "branch"
  });
});

it("extract new box params without branch", () => {
  expect(extract(newBoxPattern, "/f/owner/repo")).toEqual({
    baseRepoOwner: "owner",
    repoName: "repo"
  });
});

it.skip("extract new box params with long branch", () => {
  expect(extract(newBoxPattern, "/f/owner/repo/foo/bar")).toEqual({
    baseRepoOwner: "owner",
    repoName: "repo",
    baseBranchName: "foo/bar"
  });
});

const boxPattern =
  "/x/:forkedRepoOwner/:repoName/:boxBranchName/:baseBranchName*";
const boxPath = "/x/owner/repo/branch/base";

it("matches box pattern", () => {
  expect(matches(boxPattern, boxPath)).toBeTruthy();
  expect(matches(boxPattern, ghCallbackPath)).toBeFalsy();
});

it("extract box params", () => {
  expect(extract(boxPattern, boxPath)).toEqual({
    baseBranchName: "base",
    boxBranchName: "branch",
    forkedRepoOwner: "owner",
    repoName: "repo"
  });
});

const ghCallbackPattern = "/gh-callback/:_path*?code=:ghCode";
const ghCallbackPath = "/gh-callback/foo/bar?code=1235";

it("matches gh callback pattern", () => {
  expect(matches(ghCallbackPattern, ghCallbackPath)).toBeTruthy();
  expect(matches(ghCallbackPattern, boxPath)).toBeFalsy();
});

it("extract gh callback params", () => {
  expect(extract(ghCallbackPattern, ghCallbackPath)).toEqual({
    _path: "/foo/bar",
    ghCode: "1235"
  });
});

const zeitCallbackPattern = "/zeit-callback/*?code=:zeitCode&state=:_path";
const zeitCallbackPath = "/zeit-callback/?code=1234&state=/foo/bar";

it("matches zeit callback pattern", () => {
  expect(matches(zeitCallbackPattern, zeitCallbackPath)).toBeTruthy();
  expect(matches(zeitCallbackPattern, boxPath)).toBeFalsy();
});

it("extract zeit callback params", () => {
  expect(extract(zeitCallbackPattern, zeitCallbackPath)).toEqual({
    _path: "/foo/bar",
    zeitCode: "1234"
  });
});
