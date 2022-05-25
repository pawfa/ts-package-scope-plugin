import { isPackageScoped } from "../../src/core/isPackageScoped";
import path from "path";

describe("isPackageScoped", () => {
  test.each([
    "package.domain",
    "domain.package",
    path.join("..", "domain.package", "file.ts"),
    path.join("C", "Users", "domain.package", "file.ts"),
    path.join("C", "Users", "package.domain", "file.ts"),
    "C:\\Users\\package.domain\\file.ts",
    "C:/Users/package.domain/file.ts",
  ])("should return true when fileName equals %s", (fileName) => {
    expect(isPackageScoped(fileName, [])).toBeTruthy();
  });

  test.each([
    "domain",
    path.join("..", "domain", "file.ts"),
    path.join("C", "Users", "domain", "file.ts"),
    path.join("C", "Users", "domain.package", "file.ts"),
    path.join("C", "Users", "package.domain", "file.ts"),
    "C:\\Users\\domain\\file.ts",
    "C:/Users/domain/file.ts",
  ])("should return true when fileName equals %s and is included in package names option", (fileName) => {
    expect(isPackageScoped(fileName, ["core", "domain"])).toBeTruthy();
  });

  test.each([
    ".domain",
    "domain.",
    path.join("C", "Users", "domain.packag", "file.ts"),
    path.join("C", "Users", "domain", "file.ts"),
    "C:\\Users\\domain\\file.ts",
    "C:/Users/domain/file.ts",
  ])("should return false when fileName equals %s", (fileName) => {
    expect(isPackageScoped(fileName, [])).toBeFalsy();
  });

  test.each(["domain", "infrastructure"])(
    "should return false when fileName equals %s and is not in package names option",
    (fileName) => {
      expect(isPackageScoped(fileName, ["core"])).toBeFalsy();
    }
  );

  test("should return false when fileName contains substring of package name from package names option", () => {
    expect(isPackageScoped(path.join("C", "Users", "infrastructureconcat", "file.ts"), ["infrastructure"])).toBeFalsy();
  });

  test("should return false when fileName contains 'package' substring", () => {
    expect(isPackageScoped(path.join("C", "Users", "package-something", "file.ts"), ["infrastructure"])).toBeFalsy();
  });

  test("should return false when file name contains package name from package names option", () => {
    expect(isPackageScoped(path.join("C", "Users", "infra", "infrastructure-file.ts"), ["infrastructure"])).toBeFalsy();
  });

  test("should return false when file name without extension contains package name from package names option", () => {
    expect(
      isPackageScoped(path.relative("project/utils", "../utils/infrastructure-util"), ["infrastructure"])
    ).toBeFalsy();
  });
});
