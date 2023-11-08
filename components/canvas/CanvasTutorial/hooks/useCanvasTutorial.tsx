import useLocalStorage from "hooks/useLocalStorage";
import { useRouter } from "next/router";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";

const sectionQueryValues = [
  "add-new-main-activity",
  "add-new-sub-activity",
  "add-new-wait",
  "add-new-choice",
  "merge-activities",
] as const;

export type SectionQueryValue = (typeof sectionQueryValues)[number];

const isSectionValid = (section: unknown): section is SectionQueryValue => {
  if (typeof section === "string") {
    return sectionQueryValues.includes(section as SectionQueryValue);
  }
  return false;
};

export const useCanvasTutorial = () => {
  const router = useRouter();
  const isOpen = router.query.canvasTutorial === "true" ? true : false;

  const section = router.query.section;
  const isValidSection = isSectionValid(section);

  const refs = useSectionRefs();
  const ref = (isOpen && isValidSection && refs[section]) || undefined;

  const handleClose = () => router.replace(`/process/${router.query.id}`);

  const handleInitialOpen = useCallback(() => {
    router.query.canvasTutorial = "true";
    router.query.section = "add-new-main-activity";
    router.replace(router);
  }, [router]);

  useInitialOpen(handleInitialOpen, isOpen, isValidSection);

  useScrollIntoView(ref);

  return {
    handleClose,
    handleInitialOpen,
    isOpen,
    onSectionButtonClick: (section: SectionQueryValue) => {
      router.query.canvasTutorial = "true";
      router.query.section = section;
      router.replace(router);
    },
    refs,
  };
};

const useSectionRefs = () => {
  const addNewMainActivityRef = useRef<HTMLDivElement>(null);
  const addNewSubActivityRef = useRef<HTMLDivElement>(null);
  const addNewWaitRef = useRef<HTMLDivElement>(null);
  const addNewChoiceRef = useRef<HTMLDivElement>(null);
  const mergeActivitiesRef = useRef<HTMLDivElement>(null);

  const refs: { [key in SectionQueryValue]: RefObject<HTMLDivElement> } = {
    "add-new-main-activity": addNewMainActivityRef,
    "add-new-sub-activity": addNewSubActivityRef,
    "add-new-wait": addNewWaitRef,
    "add-new-choice": addNewChoiceRef,
    "merge-activities": mergeActivitiesRef,
  };

  return refs;
};

const useInitialOpen = (
  handleInitialOpen: () => void,
  isOpen: boolean,
  isValidSection: boolean
) => {
  const [isFirstTimeUser, setIsFirstTimeUser] = useLocalStorage(
    "isFirstTimeUser",
    true
  );

  useEffect(() => {
    if (isFirstTimeUser) {
      handleInitialOpen();
      setIsFirstTimeUser(false);
    } else if (isOpen && !isValidSection) {
      handleInitialOpen();
    }
  }, []);
};

const useScrollIntoView = (ref: RefObject<HTMLDivElement> | undefined) => {
  const [isInitialScroll, setIsInitialScroll] = useState(true);
  useEffect(() => {
    if (isInitialScroll) {
      // @ts-expect-error - TypeScript 4.5.5 don't know about behavior: "instant"
      ref?.current?.scrollIntoView({ behavior: "instant" });
      setIsInitialScroll(false);
    } else {
      ref?.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [ref]);
};
