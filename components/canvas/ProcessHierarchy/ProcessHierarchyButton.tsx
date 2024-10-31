import { ButtonWrapper } from "@/components/ButtonWrapper";
import { tag_relations } from "@equinor/eds-icons";
import { useRouter } from "next/router";

export const ProcessHierarchyButton = () => {
  const router = useRouter();

  return (
    <ButtonWrapper
      icon={tag_relations}
      title={"Process Hierarchy"}
      onClick={() => router.push(`${router.asPath}/hierarchy`)}
    />
  );
};
