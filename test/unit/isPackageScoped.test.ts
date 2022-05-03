import { isPackageScoped } from '../../src/package.core/isPackageScoped';

describe('isPackageScoped',()=> {
  test.each([
    "package.domain",
    "domain.package",
    "C:/Users/domain.package/file.ts",
    "C:\\Users\\domain.package\\file.ts",
    "C:\\Users\\package.domain\\file.ts",
  ])('should return true when fileName equals %s',(fileName)=> {
    expect(isPackageScoped(fileName)).toBeTruthy()
  })

  test.each([
    ".domain",
    "domain.",
    "C:/Users/domain.packag/file.ts",
    "C:\\Users\\domain\\file.ts",
  ])('should return false when fileName equals %s',(fileName)=> {
    expect(isPackageScoped(fileName)).toBeFalsy()
  })
})
