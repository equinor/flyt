import { Button, Icon, Tooltip, Typography } from "@equinor/eds-core-react";
import { spellcheck, unfold_less } from "@equinor/eds-icons";

import Link from "next/link";
import { TooltipImproved } from "components/TooltipImproved";
import { getLabels } from "services/labelsApi";
import { useQuery } from "react-query";
import { useRouter } from "next/router";

export default function Labels() {
  const router = useRouter();

  const { data, isLoading, error } = useQuery("labels", () => getLabels(""));

  if (isLoading) {
    return <Typography variant="h1">Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="h1">Error</Typography>;
  }

  //center
  return (
    <div style={{ padding: 25 }}>
      <Typography variant={"h2"}>Labels</Typography>
      <p>This is an overview of all labels in the system.</p>
      <p>Note: You need to be an super-user to administer labels.</p>
      <p>
        You can add new labels at the{" "}
        <Link href="/labels/bulkAdd">"bulk add"-page</Link>
      </p>
      <p>Todo: rename and merge labels</p>
      <table>
        <thead>
          <tr>
            <th style={{ textAlign: "right" }}>ID</th>
            <th style={{ textAlign: "left" }}>Name</th>
            <th style={{ textAlign: "left" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((label) => (
            <tr key={label.id}>
              <td>{label.id}</td>
              <td>{label.text}</td>
              <td>
                <span style={{ display: "flex" }}>
                  <TooltipImproved title="Rename">
                    <Button
                      disabled
                      onClick={() => router.push(`/labels/${label.id}/rename`)}
                      variant="ghost_icon"
                    >
                      <Icon data={spellcheck} />
                    </Button>
                  </TooltipImproved>

                  <Tooltip title="Merge">
                    <Button
                      disabled
                      onClick={() => router.push(`/labels/${label.id}/merge`)}
                      variant="ghost_icon"
                    >
                      <Icon data={unfold_less} />
                    </Button>
                  </Tooltip>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
Labels.auth = true;
