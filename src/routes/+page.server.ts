import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ setHeaders, cookies }) => {
  const hasAuthCookie = cookies
    .getAll()
    .some((c) => c.name.startsWith("sb-") && c.name.includes("-auth-token"));

  if (!hasAuthCookie) {
    setHeaders({ "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400" });
  }
  return {};
};
