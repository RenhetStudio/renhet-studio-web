import { fail } from "@sveltejs/kit";
import { appendApplication, getPublishedPositions } from "$lib/careers/google-sheets";
import { applicationSchema } from "$lib/careers/validation";
import type { CareerPosition } from "$lib/careers/types";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, setHeaders }) => {
  setHeaders({ "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400" });
  let positions: CareerPosition[] = [];
  try { positions = await getPublishedPositions(); }
  catch (error) { console.error("Career positions could not be loaded", error); }
  const role = url.searchParams.get("role") ?? "open-application";
  return { positions, initialPosition: positions.some((position) => position.slug === role) ? role : "open-application" };
};

export const actions = {
  default: async ({ request }) => {
    const parsed = applicationSchema.safeParse(Object.fromEntries(await request.formData()));
    if (!parsed.success) return fail(400, { status: "error", message: "Check the highlighted fields and try again.", errors: parsed.error.flatten().fieldErrors });
    try {
      const positions = await getPublishedPositions();
      const selected = positions.find((position) => position.slug === parsed.data.positionId);
      if (!selected && parsed.data.positionId !== "open-application") return fail(400, { status: "error", message: "That position is no longer accepting applications. Choose another role.", errors: undefined });
      await appendApplication({ ...parsed.data, positionTitle: selected?.title ?? "Open application" });
      return { status: "success", message: "Application received. Thanks for taking the time to introduce yourself.", errors: undefined };
    } catch (error) {
      console.error("Career application submission failed", error);
      return fail(503, { status: "error", message: "Applications are temporarily unavailable. Please try again in a little while.", errors: undefined });
    }
  },
} satisfies Actions;
