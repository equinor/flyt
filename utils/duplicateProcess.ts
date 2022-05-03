import { vsmProject } from "../interfaces/VsmProject";
import { NextRouter } from "next/router";

// Navigates to the duplicate-process page, that will handle the rest
export const duplicateProcess = async (
  process: vsmProject,
  router: NextRouter
) => {
  if (process?.currentProcessId) {
    await router.push(`/process/${process.currentProcessId}/duplicate`);
  } else {
    await router.push(`/process/${process.vsmProjectID}/duplicate`);
  }
};
