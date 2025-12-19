import { Button, Icon } from "@equinor/eds-core-react";
import { arrow_back_ios } from "@equinor/eds-icons";
import { useRouter } from "next/router";

export function BackButton(): JSX.Element {
  const router = useRouter();

  return (
    <div style={{ position: "absolute", top: "77px", left: "14px" }}>
      <Button variant="ghost" onClick={() => router.back()}>
        <Icon data={arrow_back_ios} color={"#007079"} />
        Back
      </Button>
    </div>
  );
}
