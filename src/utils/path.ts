/**
 * Formats a path segment into a properly structured URL path
 * Ensures consistent leading/trailing slashes and handles edge cases
 * @param path - The path segment to format (e.g., "blog/my-post", "about", "/contact/")
 * @param options - Configuration options for URL formatting
 * @returns A normalized URL path with consistent slash handling
 */
export function formatUrl(
  path: string,
  options: { trailingSlash?: boolean; leadingSlash?: boolean } = {},
): string {
  const { trailingSlash = true, leadingSlash = true } = options;

  // Remove all leading/trailing slashes
  const cleanPath = path.replace(/^\/+|\/+$/g, "");

  // Build URL with configured slashes
  let url = cleanPath;
  if (leadingSlash) url = `/${url}`;
  if (trailingSlash) url = `${url}/`;

  return url;
}

/**
 * Checks if a given path should be considered "active" based on the current URL
 * Handles nested routes and normalizes trailing slashes
 */
export function isPathActive(currentPath: string, targetPath: string): boolean {
  // Handle root path as a special case
  if (targetPath === "/" && currentPath !== "/") {
    return false;
  }

  // Normalize paths to remove trailing slashes
  const normalizedCurrent = currentPath.endsWith("/") && currentPath !== "/"
    ? currentPath.slice(0, -1)
    : currentPath;

  const normalizedTarget = targetPath.endsWith("/") && targetPath !== "/"
    ? targetPath.slice(0, -1)
    : targetPath;

  // Check if current path is the target or a subpath of target
  return normalizedCurrent === normalizedTarget ||
    (normalizedTarget !== "/" && normalizedCurrent.startsWith(normalizedTarget));
}
