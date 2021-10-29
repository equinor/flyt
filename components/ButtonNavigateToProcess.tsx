import { useRouter } from "next/router";
import React from "react";
import { Button, Icon } from "@equinor/eds-core-react";
import { arrow_back_ios } from "@equinor/eds-icons";
import Link from "next/link";

export function ButtonNavigateToProcess(): JSX.Element {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Link href={`/process/${id}`}>
      <Button variant={"ghost"}>
        <Icon data={arrow_back_ios} color={"#007079"} />
        Back to process
      </Button>
    </Link>
  );
}
