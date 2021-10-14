import { useRouter } from "next/router";
import React from "react";
import { Button, Icon, Tooltip } from "@equinor/eds-core-react";
import { arrow_back_ios } from "@equinor/eds-icons";
import Link from "next/link";

export function ButtonNavigateToProcess(): JSX.Element {
  const router = useRouter();
  const { id } = router.query;

  // Note - EDS Tooltip bug: does not work with Link tag without some wrapping
  return (
    <Tooltip title={"Go to the process overview."}>
      <span>
        <Link href={`/projects/${id}`}>
          <Button variant={"ghost"}>
            <Icon data={arrow_back_ios} color={"#007079"} />
            Back to Process
          </Button>
        </Link>
      </span>
    </Tooltip>
  );
}
