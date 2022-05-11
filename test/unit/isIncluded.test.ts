import { isIncluded } from "../../src/core/isIncluded";

describe("isIncluded", () => {
  describe("should correctly match different separators", () => {
    test.each([
      [
        "D:\\ts-package-scope-plugin\\project-name\\core\\domain.ts",
        "D:\\ts-package-scope-plugin\\project-name",
        ["/**/*"],
      ],
      [
        "D:\\ts-package-scope-plugin\\project-name\\core\\domain.ts",
        "D:/ts-package-scope-plugin/project-name",
        ["**/*"],
      ],
      ["D:/ts-package-scope-plugin/project-name/core/domain.ts", "D:\\ts-package-scope-plugin\\project-name", ["**/*"]],
      ["D:/ts-package-scope-plugin/project-name/core/domain.ts", "D:/ts-package-scope-plugin/project-name", ["**/*"]],
      ["D:/ts-package-scope-plugin/project-name/core/domain.ts", "D:/ts-package-scope-plugin/project-name", ["**/*"]],
    ])(
      "should return true when fileName equals %s, currentDir equals %s and include array equals %s",
      (fileName, currentDir, include) => {
        expect(isIncluded(fileName, currentDir, include)).toBeTruthy();
      }
    );
  });

  test.each([
    [
      "D:/ts-package-scope-plugin/project-name/core/domain.ts",
      "D:/ts-package-scope-plugin/project-name",
      ["core/**/*"],
    ],
    [
      "D:/ts-package-scope-plugin/project-name/core/domain/domain.ts",
      "D:/ts-package-scope-plugin/project-name",
      ["./core/**/*"],
    ],
    ["D:/ts-package-scope-plugin/project-name/core/domain.ts", "D:/ts-package-scope-plugin/project-name", ["./core/*"]],
  ])(
    "should return true when fileName equals %s, currentDir equals %s and include array equals %s",
    (fileName, currentDir, include) => {
      expect(isIncluded(fileName, currentDir, include)).toBeTruthy();
    }
  );

  test.each([
    [
      "D:/ts-package-scope-plugin/project-name/core/domain.ts",
      "D:/ts-package-scope-plugin/project-different-name",
      ["core/**/*"],
    ],
    [
      "D:/ts-package-scope-plugin/project-name/core/domain.ts",
      "D:/ts-package-scope-plugin/project-name",
      ["./different-pattern/**/*"],
    ],
    ["D:/ts-package-scope-plugin/project-name/core/domain.ts", "D:/ts-package-scope-plugin/project-name", []],
  ])(
    "should return false when fileName equals %s, currentDir equals %s and include array equals %s",
    (fileName, currentDir, include) => {
      expect(isIncluded(fileName, currentDir, include)).toBeFalsy();
    }
  );
});
