import { useRouter } from "next/router";

export const useProjectId = () => {
  const router = useRouter();
  const projectId = router.query.id as string;

  return { projectId };
};
