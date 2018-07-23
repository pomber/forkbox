import { matches, extract } from "./routux";

const newBoxPattern = "/f/:baseRepoOwner/:repoName/:baseBranchName*";
const boxPattern =
  "/x/:forkedRepoOwner/:repoName/:boxBranchName/:baseBranchName*";
const ghCallbackPattern = "/gh-callback/:_path*?code=:ghCode";
const zeitCallbackPattern = "/zeit-callback/*?code=:zeitCode&state=:_path";

const newBoxPath = "/f/owner/repo/branch";
const boxPath = "/x/owner/repo/branch/base";
const ghCallbackPath = "/gh-callback/foo/bar?code=1235";
const zeitCallbackPath = "/zeit-callback/?code=1234&state=/foo/bar";

it("matches new box pattern", () => {
  expect(matches(newBoxPattern, newBoxPath)).toBeTruthy();
  expect(matches(newBoxPattern, boxPath)).toBeFalsy();
});

it("matches box pattern", () => {
  expect(matches(boxPattern, boxPath)).toBeTruthy();
  expect(matches(boxPattern, ghCallbackPath)).toBeFalsy();
});

it("matches gh callback pattern", () => {
  expect(matches(ghCallbackPattern, ghCallbackPath)).toBeTruthy();
  expect(matches(ghCallbackPattern, boxPath)).toBeFalsy();
});

it("matches zeit callback pattern", () => {
  expect(matches(zeitCallbackPattern, zeitCallbackPath)).toBeTruthy();
  expect(matches(zeitCallbackPattern, boxPath)).toBeFalsy();
});
