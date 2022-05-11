import { isFromTheSamePackage } from "../../src/core/isFromTheSamePackage";
import path from "path";

describe("isFromTheSamePackage", () => {
  test.each([
    [path.join("C", "Users", "domain.package", "file.ts"), path.join("C", "Users", "domain.package", "file.ts")],
    [path.join("C", "Users", "package.domain", "file.ts"), path.join("C", "Users", "package.domain", "file.ts")],
    [path.join("C", "Users", "package.domain", "file"), path.join("C", "Users", "package.domain", "file")],
    ["C:\\Users\\package.domain\\file", "C:\\Users\\package.domain\\file"],
    ["C:/Users/package.domain/file", "C:/Users/package.domain/file"],
  ])("should return true when importedFileName equals %s and fileName equals %s", (importedFileName, fileName) => {
    expect(isFromTheSamePackage(importedFileName, fileName, [])).toBeTruthy();
  });

  test.each([
    [path.join("C", "Users", "domain", "file.ts"), path.join("C", "Users", "domain", "file.ts")],
    ["C:\\Users\\domain\\file", "C:\\Users\\domain\\file"],
    ["C:/Users/domain/file", "C:/Users/domain/file"],
  ])(
    "should return true when importedFileName equals %s and fileName equals %s and package names from configuration is 'domain'",
    (importedFileName, fileName) => {
      expect(isFromTheSamePackage(importedFileName, fileName, ["domain"])).toBeTruthy();
    }
  );

  test.each([
    [path.join("C", "Users", "core.package", "file.ts"), path.join("C", "Users", "domain.package", "file.ts")],
    [path.join("C", "Users", "package.domain", "file.ts"), path.join("C", "Users", "package.interfaces", "file.ts")],
    [path.join("C", "Users", "package.test", "file"), path.join("C", "Users", "package.domain", "file")],
    [path.join("C", "Users", "test", "file"), path.join("C", "Users", "domain", "file")],
    ["C:\\Users\\test\\file", "C:\\Users\\domain\\file"],
    ["C:/Users/test/file", "C:/Users/domain/file"],
  ])("should return false when importedFileName equals %s and fileName equals %s", (importedFileName, fileName) => {
    expect(isFromTheSamePackage(importedFileName, fileName, [])).toBeFalsy();
  });

  test.each<[string, string, string[]]>([
    [
      path.join("C", "Users", "core", "file.ts"),
      path.join("C", "Users", "domain", "file.ts"),
      ["domain", "core", "interfaces", "test"],
    ],
    [
      path.join("C", "Users", "domain", "file.ts"),
      path.join("C", "Users", "interfaces", "file.ts"),
      ["domain", "core", "interfaces", "test"],
    ],
    [
      path.join("C", "Users", "test", "file"),
      path.join("C", "Users", "domain", "file"),
      ["domain", "core", "interfaces", "test"],
    ],
    [path.join("C", "Users", "test2", "file"), path.join("C", "Users", "test2", "file"), ["test"]],
    [path.join("C", "Users", "test2", "file"), path.join("C", "Users", "test2", "file"), []],
    ["C:\\Users\\test2\\file", "C:\\Users\\test2\\file", ["test"]],
    ["C:/Users/test2/file", "C:/Users/test2/file", ["test"]],
  ])(
    "should return false when importedFileName equals %s and fileName equals %s and package names from configuration are %s",
    (importedFileName, fileName, packageNames) => {
      expect(isFromTheSamePackage(importedFileName, fileName, packageNames)).toBeFalsy();
    }
  );
});
