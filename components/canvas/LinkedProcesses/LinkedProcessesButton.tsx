import { ButtonWrapper } from "@/components/ButtonWrapper";
import { tag_relations } from "@equinor/eds-icons";
import { useRouter } from "next/router";

export const LinkedProcessesButton = () => {
  const router = useRouter();

  return (
    <ButtonWrapper
      icon={tag_relations}
      title={"Linked processes"}
      onClick={() => router.push(`${router.asPath}/linked-processes`)}
    />
  );
};
