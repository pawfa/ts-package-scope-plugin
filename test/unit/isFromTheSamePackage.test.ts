import { isFromTheSamePackage } from "../../src/package.core/isFromTheSamePackage";

describe("isFromTheSamePackage", () => {
  test.each([
    ["C:/Users/domain.package/file.ts", "C:/Users/domain.package/file.ts"],
    ["C:/Users/package.domain/file.ts", "C:/Users/package.domain/file.ts"],
    ["C:/Users/package.domain/file", "C:/Users/package.domain/file"],
    ["C:\\Users\\package.domain\\file", "C:\\Users\\package.domain\\file"],
  ])("should return true when importedFileName equals %s and fileName equals %s", (importedFileName, fileName) => {
    expect(isFromTheSamePackage(importedFileName, fileName)).toBeTruthy();
  });

  test.each([
    ["C:/Users/core.package/file.ts", "C:/Users/domain.package/file.ts"],
    ["C:/Users/package.domain/file.ts", "C:/Users/package.interfaces/file.ts"],
    ["C:/Users/package.test/file", "C:/Users/package.domain/file"],
    ["C:\\Users\\package.test\\file", "C:\\Users\\package.domain\\file"],
  ])("should return false when importedFileName equals %s and fileName equals %s", (importedFileName, fileName) => {
    expect(isFromTheSamePackage(importedFileName, fileName)).toBeFalsy();
  });
});
