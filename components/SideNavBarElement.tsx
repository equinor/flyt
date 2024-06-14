import { Button, Icon, Tooltip } from "@equinor/eds-core-react";
import { useRouter } from "next/router";
import { IconData } from "@equinor/eds-icons";

export function SideNavBarElement(props: {
  icon: IconData;
  title: string;
  pathname: string;
}) {
  const router = useRouter();
  const pathname = router.pathname;
  const isOnCurrentPage = pathname == props.pathname;

  return (
    <Tooltip title={props.title} placement="right">
      <Button
        style={{
          backgroundColor: isOnCurrentPage ? "#E6FAEC" : "transparent",
          height: "56px",
        }}
        variant="ghost"
        onClick={() =>
          router.push({
            pathname: props.pathname,
            query: router.query,
          })
        }
      >
        <Icon data={props.icon}></Icon>
      </Button>
    </Tooltip>
  );
}
