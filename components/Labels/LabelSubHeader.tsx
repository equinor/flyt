import { Chip } from "@equinor/eds-core-react";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import { getLabel } from "services/labelsApi";
import { getQueryObject } from "utils/getQueryObject";
import { getUpdatedLabel } from "utils/getUpdatedLabel";
import { unknownErrorToString } from "utils/isError";
import ButtonClearAll from "./ButtonClearAll";

export default function LabelSubHeader(props: {
  labelsID: string[];
}): JSX.Element {
  const { labelsID } = props;

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {labelsID.map((id) => (
        <SingleLabel key={id} id={id} />
      ))}
      <ButtonClearAll />
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
    const rl = getUpdatedLabel(id, router.query.rl);
    const queryObject = getQueryObject(router.query, { rl });
    router.replace({
      pathname: router.pathname,
      query: { ...queryObject },
    });
  };

  if (isLoading) {
    return <Chip>Loading...</Chip>;
  }

  if (error) {
    return <Chip>{unknownErrorToString(error)}</Chip>;
  }

  return (
    <Chip
      style={{ backgroundColor: "#ffffff" }}
      onDelete={() => handleClickDelete(label.id.toString())}
    >
      {label.text}
    </Chip>
  );
}
