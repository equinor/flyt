import { useProjectId } from "../hooks/useProjectId";
import { Button, Icon } from "@equinor/eds-core-react";
import { arrow_back_ios } from "@equinor/eds-icons";
import Link from "next/link";

export function ButtonNavigateToProcess(): JSX.Element {
  const { projectId } = useProjectId();

  return (
    <Link href={`/process/${projectId}`}>
      <Button variant={"ghost"}>
        <Icon data={arrow_back_ios} color={"#007079"} />
        Back to process
      </Button>
    </Link>
  );
}
