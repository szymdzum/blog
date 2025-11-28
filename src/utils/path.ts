interface FormatUrlOptions {
  trailingSlash?: boolean;
  leadingSlash?: boolean;
}

const DEFAULT_FORMAT_OPTIONS: FormatUrlOptions = {
  trailingSlash: true,
  leadingSlash: true,
};

function stripSlashes(path: string): string {
  return path.replace(/^\/+|\/+$/g, "");
}

function removeTrailingSlash(path: string): string {
  return path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path;
}

export function formatUrl(path: string, options: FormatUrlOptions = {}): string {
  const { trailingSlash, leadingSlash } = { ...DEFAULT_FORMAT_OPTIONS, ...options };
  const cleanPath = stripSlashes(path);

  let url = cleanPath;
  if (leadingSlash) url = `/${url}`;
  if (trailingSlash) url = `${url}/`;

  return url;
}

export function isPathActive(currentPath: string, targetPath: string): boolean {
  if (targetPath === "/" && currentPath !== "/") {
    return false;
  }

  const normalizedCurrent = removeTrailingSlash(currentPath);
  const normalizedTarget = removeTrailingSlash(targetPath);

  return (
    normalizedCurrent === normalizedTarget ||
    (normalizedTarget !== "/" && normalizedCurrent.startsWith(normalizedTarget))
  );
}
