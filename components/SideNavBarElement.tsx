import { Button, Icon, Tooltip } from "@equinor/eds-core-react";
import { useRouter } from "next/router";

export function SideNavBarElement(props: {
  icon;
  title: string;
  pathname: string;
}): JSX.Element {
  const router = useRouter();
  const pathname = router.pathname;
  const isOnCurrentPage = pathname == props.pathname;

  return (
    <Tooltip title={props.title} placement="right">
      <Button
        style={{
          backgroundColor: isOnCurrentPage && "#E6FAEC",
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
