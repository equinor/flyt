import { type OptionalGuideStage } from "@/hooks/useOptionalGuide";
export const GUIDE_STAGE_TEXT: Record<
  OptionalGuideStage,
  { title: string; description: string }
> = {
  output: {
    title: "Output",
    description:
      "What are the key deliverables or results of the process? List the output(s).",
  },
  customer: {
    title: "Customer",
    description:
      "Who receives or benefits from the output of this process? Describe the customer(s).",
  },
  input: {
    title: "Input",
    description:
      "What is needed for the process to start or continue? List the essential input(s).",
  },
  supplier: {
    title: "Supplier",
    description:
      "Who or what provides the required inputs for this process? Describe the supplier(s).",
  },
  "main activity": {
    title: "Main activity",
    description:
      "Describe the primary activity that transforms the input into the expected output.",
  },
};
