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
import { downloadJSON } from "../utils/DownloadJSON";
import { downloadProjectCardsAsCSV } from "../utils/DownloadProjectCardsAsCSV";
import { downloadProjectTasksAsCSV } from "../utils/DownloadProjectTasksAsCSV";

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
    <>
      <Button
        variant={"contained"}
        title={"Download process as PNG"}
        onClick={() => download_tree_as_png(project, tree)}
      >
        <Icon data={download} />
        Flyt.png
      </Button>

      <Button
        variant={"contained"}
        title={"Download process as CSV"}
        onClick={() => {
          downloadProjectTasksAsCSV(tasks, project);
        }}
      >
        <Icon data={download} />
        QIPs.csv
      </Button>
      <Button
        variant={"contained"}
        title={"Download process as CSV"}
        onClick={() => {
          downloadProjectCardsAsCSV(project);
        }}
      >
        <Icon data={download} />
        Cards.csv
      </Button>
      <Button
        variant={"contained"}
        title={"Download process as JSON"}
        onClick={() => downloadJSON(project)}
      >
        <Icon data={download} />
        Flyt.json
      </Button>
    </>
  );
}
