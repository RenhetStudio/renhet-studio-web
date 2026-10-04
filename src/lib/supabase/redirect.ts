const redirectBase = "https://localhost.invalid";

export function safeReturnPath(value: string | null | undefined) {
  if (!value?.startsWith("/") || value.startsWith("//")) return "/blog";
  try {
    const url = new URL(value, redirectBase);
    return url.origin === redirectBase ? `${url.pathname}${url.search}${url.hash}` : "/blog";
  } catch {
    return "/blog";
  }
}
