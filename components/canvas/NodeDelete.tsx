import { canDeleteNode } from "@/utils/canDeleteNode";
import { Button, Icon } from "@equinor/eds-core-react";
import { delete_forever } from "@equinor/eds-icons";
import { Node } from "reactflow";

type NodeDelete = {
  data: Node["data"];
  userCanEdit?: boolean;
  handleNodeDelete?: () => void;
  title: string;
};

export const NodeDelete = ({
  data,
  userCanEdit,
  handleNodeDelete,
  title,
}: NodeDelete) => {
  return (
    <Button
      disabled={!canDeleteNode(data) || !userCanEdit}
      variant="ghost_icon"
      title={title}
      color="danger"
      onClick={(event) => {
        handleNodeDelete && handleNodeDelete();
        event.stopPropagation();
      }}
    >
      <Icon data={delete_forever} />
    </Button>
  );
};
