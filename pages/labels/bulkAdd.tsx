import React from "react";
import { Chip, Typography } from "@equinor/eds-core-react";
import { useMutation, useQueryClient } from "react-query";

import { createLabel } from "services/labelsApi";
import { processLabel } from "interfaces/processLabel";
import { unknownErrorToString } from "utils/isError";
import { useState } from "react";

type processLabelType = {
  id?: number;
  text: string;
  status?: "pending" | "success" | "error";
  error?: unknown | Error;
};
export default function BulkAddLabels() {
  const [textInput, setTextInput] = useState("");
  const [labels, setLabels] = useState<processLabelType[]>([]);

  const addLabelMutation = useMutation(
    (label: processLabelType) => createLabel(label as processLabel),
    {
      onError: (err, errorLabel) => {
        //update the status of our label
        setLabels((previous) =>
          previous.map((l) => {
            if (l.text === errorLabel.text) {
              return {
                ...l,
                status: "error",
                error: unknownErrorToString(err),
              };
            }
            return l;
          })
        );
      },
      onSuccess: (label, successLabel): void => {
        //update the status of our label
        setLabels((previous) =>
          previous.map((l) => {
            if (l.text === successLabel.text) {
              return { ...l, status: "success" };
            }
            return l;
          })
        );
      },
    }
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newLabels: processLabelType[] = textInput
      .trim()
      .split("\n")
      .map((l) => ({ text: l, status: "pending" } as processLabelType))
      .filter((l) => l.text.length > 0);
    if (newLabels.length > 0) {
      setLabels(newLabels);
      setTextInput("");
      newLabels.forEach((label) => {
        addLabelMutation.mutate(label);
      });
    }
  };

  return (
    <div>
      <h1>Bulk add labels</h1>
      <p>Note: You need to be a super-user to administer labels.</p>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Bulk add labels</legend>
          <p>NB: Seperate multiple labels by adding a new line</p>
          <textarea
            rows={10}
            cols={38}
            value={textInput}
            placeholder={`Label one\nLabel two\nLabel three`}
            onChange={(e) => setTextInput(e.target.value)}
          />
          <br />
          <input type="submit" value="Submit new labels" />
        </fieldset>
      </form>
      <h2>Progress</h2>
      <table>
        <thead>
          <tr>
            <th>Label</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {labels.map((label) => (
            <tr key={label.text}>
              <td>{label.text}</td>
              <td>
                {label.status === "pending" && <Chip>Pending</Chip>}
                {label.status === "success" && <Chip>Success</Chip>}
                {label.status === "error" && (
                  <Chip>Error: {unknownErrorToString(label.error)}</Chip>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p
        style={{
          fontSize: "1.2em",
          marginTop: "1em",
          marginBottom: "1em",
          fontWeight: "bold",
          textDecoration: "underline",
        }}
      >
        {labels.filter((l) => l.status === "success").length} labels created
      </p>
      <h2>Some common error code examples</h2>
      <table>
        <thead>
          <tr>
            <th>Error code</th>
            <th>Description</th>
            <th>Remedy</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>403</td>
            <td>
              <p>The request was forbidden.</p>
            </td>
            <td>
              <p>
                Check that you have the correct permissions to perform this
                operation. You need to be a superuser to administer labels.
              </p>
            </td>
          </tr>
          <tr>
            <td>409</td>
            <td>
              <p>The request could not be completed due to a conflict.</p>
            </td>
            <td>Check that the label does not already exist.</td>
          </tr>
          <tr>
            <td>500</td>
            <td>
              <p>
                The request could not be completed due to an internal server
                error.
              </p>
            </td>
            <td>Send a message to our backend developer.</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
BulkAddLabels.auth = true;
