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
      "Which role or system recieves the Output? List the customer(s).",
  },
  input: {
    title: "Input",
    description:
      "What triggers you to begin the process? List the input(s). (Eg. information, materials, tools, a weekly meeting.)",
  },
  supplier: {
    title: "Supplier",
    description:
      "Who or what supplies the input? List the supplier(s).(E.g. collaborators, data systems, plans, requirements)",
  },
  "main activity": {
    title: "Main activity",
    description:
      "Write one main activity in the process. More main activities can be added in the next step. One per card.",
  },
};
