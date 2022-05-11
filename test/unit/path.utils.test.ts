import { concatPathsWithPosixSeparator, makePathPosix, removeLeadingSlash } from "../../src/utils/path.utils";

describe("path.utils.ts", () => {
  test.each([
    ["C:\\Users\\package.domain\\file.ts", "C:/Users/package.domain/file.ts"],
    ["C:/Users/package.domain/file.ts", "C:/Users/package.domain/file.ts"],
    ["C:/Users/package.domain/file.ts", "C:/Users/package.domain/file.ts"],
  ])("should return %s path with forward slashes", (path, result) => {
    expect(makePathPosix(path)).toBe(result);
  });

  test.each([["C:/Users/package.domain", "project/test", "C:/Users/package.domain/project/test"]])(
    "should join %s and %s path with forward slashes",
    (path1, path2, result) => {
      expect(concatPathsWithPosixSeparator(path1, path2)).toBe(result);
    }
  );

  test.each([
    ["/users", "users"],
    ["\\users", "users"],
  ])("should remove leading slash for %s", (path, result) => {
    expect(removeLeadingSlash(path)).toBe(result);
  });
});
