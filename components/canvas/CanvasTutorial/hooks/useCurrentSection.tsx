import { useRouter } from "next/router";
import { SectionQueryValue } from "./useCanvasTutorial";

export const useCurrentSection = (section: SectionQueryValue) => {
  const router = useRouter();
  const isCurrentSection = router.query.section === section;

  return {
    isCurrentSection,
  };
};
