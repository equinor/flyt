import { useQuery } from "react-query";
import { getTaskTypes } from "../services/taskApi";
import { unknownErrorToString } from "../utils/isError";
import { Autocomplete } from "@equinor/eds-core-react";
import React from "react";

export function SelectTaskType(props: { onSelect: (e) => void }): JSX.Element {
  const {
    data: taskTypes,
    isLoading,
    error,
  } = useQuery(["taskTypes"], () => getTaskTypes());
  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>{unknownErrorToString(error)}</p>;
  }
  return (
    <div style={{ paddingBottom: 16 }}>
      <Autocomplete
        label={"Select type"}
        options={taskTypes.map((t) => t.name)}
        onInputChange={(e) =>
          props.onSelect(
            taskTypes.find((t) => e === t.name).vsmTaskTypeID //Wow... there must be a better way
          )
        }
        initialSelectedOptions={[taskTypes[0]?.name]}
      />
    </div>
  );
}
