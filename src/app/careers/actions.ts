"use server";

import { appendApplication, getPublishedPositions } from "@/lib/careers/google-sheets";
import { applicationSchema } from "@/lib/careers/validation";
import type { ApplicationState } from "./application-state";

export async function submitApplication(
  _previousState: ApplicationState,
  formData: FormData,
): Promise<ApplicationState> {
  const parsed = applicationSchema.safeParse({
    positionId: formData.get("positionId"),
    name: formData.get("name"),
    email: formData.get("email"),
    location: formData.get("location"),
    portfolioUrl: formData.get("portfolioUrl"),
    linkedinUrl: formData.get("linkedinUrl"),
    resumeUrl: formData.get("resumeUrl"),
    message: formData.get("message"),
    consent: formData.get("consent"),
    website: formData.get("website"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted fields and try again.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const positions = await getPublishedPositions();
    const selected = positions.find((position) => position.slug === parsed.data.positionId);
    const isOpenApplication = parsed.data.positionId === "open-application";

    if (!selected && !isOpenApplication) {
      return {
        status: "error",
        message: "That position is no longer accepting applications. Choose another role.",
      };
    }

    await appendApplication({
      ...parsed.data,
      positionTitle: selected?.title ?? "Open application",
    });

    return {
      status: "success",
      message: "Application received. Thanks for taking the time to introduce yourself.",
    };
  } catch (error) {
    console.error("Career application submission failed", error);
    return {
      status: "error",
      message: "Applications are temporarily unavailable. Please try again in a little while.",
    };
  }
}
