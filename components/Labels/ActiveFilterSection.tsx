import { Button, Chip } from "@equinor/eds-core-react";

import React from "react";
import { getLabel } from "services/labelsApi";
import { getUpdatedLabel } from "utils/getUpdatedLabel";
import { getUserById } from "services/userApi";
import { stringToArray } from "utils/stringToArray";
import { toggleQueryParam } from "utils/toggleQueryParam";
import { unknownErrorToString } from "utils/isError";
import { useQuery } from "react-query";
import { useRouter } from "next/router";

export default function ActiveFilterSection(): JSX.Element {
  const router = useRouter();
  const { rl, user } = router.query;

  // rl stands for "required label"
  const labelIdArray = stringToArray(rl);
  const userIdArray = stringToArray(user);

  return (
    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
      {labelIdArray?.map((id) => (
        <SingleLabel key={`Label-${id}`} id={id} />
      ))}
      {userIdArray?.map((id) => (
        <SingleUser key={`User-${id}`} id={id} />
      ))}
      {(labelIdArray?.length > 0 || userIdArray?.length > 0) && (
        <Button
          color="primary"
          variant="ghost"
          onClick={() =>
            router.replace({
              query: { ...router.query, rl: [], user: [] },
            })
          }
          style={{ minWidth: "90px" }}
        >
          Clear all
        </Button>
      )}
    </div>
  );
}

export function SingleLabel(props: { id: string }): JSX.Element {
  const { id } = props;
  const router = useRouter();
  const {
    data: label,
    isLoading,
    error,
  } = useQuery(["label", id], () => getLabel(id));

  const handleClickDelete = (id: string) => {
    // rl stands for "required label"
    const labelIdArray = getUpdatedLabel(id, router.query.rl);
    router.replace({
      query: { ...router.query, rl: labelIdArray },
    });
  };

  if (isLoading) {
    return <Chip>Loading...</Chip>;
  }

  if (error) {
    return (
      <Chip onDelete={() => handleClickDelete(id)}>
        {unknownErrorToString(error)}
      </Chip>
    );
  }

  if (!label) {
    return (
      <Chip onDelete={() => handleClickDelete(id)}>Label {id} not found</Chip>
    );
  }

  return (
    <Chip
      style={{ backgroundColor: "#ffffff" }}
      onDelete={() => handleClickDelete(id)}
    >
      {label.text}
    </Chip>
  );
}
export function SingleUser(props: { id: string }): JSX.Element {
  const { id } = props;
  const router = useRouter();
  const {
    data: user,
    isLoading,
    error,
  } = useQuery(["user", id], () => getUserById(id));

  if (isLoading) {
    return <Chip>Loading...</Chip>;
  }

  if (error) {
    return <Chip>{unknownErrorToString(error)}</Chip>;
  }

  if (!user) {
    return (
      <Chip onDelete={() => toggleQueryParam("user", id, router)}>
        User-{id}
      </Chip>
    );
  }

  return (
    <Chip
      style={{ backgroundColor: "#ffffff" }}
      onDelete={() => toggleQueryParam("user", id, router)}
    >
      {user.userName}
    </Chip>
  );
}
