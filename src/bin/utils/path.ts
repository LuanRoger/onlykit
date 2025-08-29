export function normalizePath(p: string): string {
  return p.replace(/\\/g, "/");
}

export function isDirectory(p: string): boolean {
  return p.endsWith("/");
}

export function getFileDirectory(filePath: string): string {
  return filePath.endsWith("/")
    ? filePath
    : filePath.substring(0, filePath.lastIndexOf("/"));
}
