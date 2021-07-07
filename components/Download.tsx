import { Button, Icon } from "@equinor/eds-core-react";
import { download_tree_as_png } from "./canvas/utils/downloadVSMImage";
import React, { useEffect, useState } from "react";
import { loadAssets } from "./canvas/utils/LoadAssets";
import { assets } from "./canvas/utils/AssetFactory";
import { getApp } from "./canvas/utils/PixiApp";
import { recursiveTree } from "./canvas/utils/recursiveTree";
import { useQuery } from "react-query";
import { getProject } from "../services/projectApi";
import { useRouter } from "next/router";
import { download } from "@equinor/eds-icons";
import { getTasksForProject } from "../services/taskApi";
import { downloadJSON } from "./DownloadJSON";
import { downloadProjectCardsAsCSV } from "./DownloadProjectCardsAsCSV";
import { downloadProjectTasksAsCSV } from "./DownloadProjectTasksAsCSV";

export default function Download(): JSX.Element {
  const router = useRouter();
  const { id } = router.query;
  const { data: project } = useQuery(["project", id], () => getProject(id));
  const { data: tasks } = useQuery(["tasks", id], () => getTasksForProject(id));
  const [assetsAreReady, setAssetsAreReady] = useState(false);
  const [tree, setTree] = useState(null);
  // "Constructor"
  useEffect(() => {
    const cleanupAssets = loadAssets(assets, () => setAssetsAreReady(true));
    return () => {
      cleanupAssets();
      getApp().stage.removeChildren();
      getApp()?.stop();
    };
  }, []);

  useEffect(() => {
    if (assetsAreReady && project && project.objects) {
      const newTree = recursiveTree(
        project.objects[0],
        0,
        true,
        {
          setSnackMessage: () => {
            //ignore
          },
        },
        () => {
          //ignore
        },
        () => {
          //ignore
        }
      );
      setTree(newTree);
    }
  }, [assetsAreReady, project]);

  if (!tree) {
    return <p>Generating tree</p>;
  }

  return (
    <div
    // style={{
    //   display: "flex",
    //   // justifyContent: "center",
    //   alignItems: "center",
    //   justifyContent: "space-evenly",
    //   height: 200,
    // }}
    >
      <Button
        variant={"contained"}
        title={"Download VSM as PNG"}
        onClick={() => download_tree_as_png(project, tree)}
      >
        <Icon data={download} />
        .PNG
      </Button>

      <Button
        variant={"contained"}
        title={"Download VSM as CSV"}
        onClick={() => {
          downloadProjectCardsAsCSV(project);
          downloadProjectTasksAsCSV(tasks, project);
        }}
      >
        <Icon data={download} />
        .CSV
      </Button>
      <Button
        variant={"contained"}
        title={"Download VSM as JSON"}
        onClick={() => downloadJSON(project)}
      >
        <Icon data={download} />
        .JSON
      </Button>
    </div>
  );
}
