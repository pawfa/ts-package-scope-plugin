export function hasPackageInName(str: string) {
  return str.startsWith("package.") || str.endsWith(".package");
}
