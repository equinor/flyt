import { Button, Icon } from "@equinor/eds-core-react";
import { download_tree_as_png } from "./utils/downloadVSMImage";
import React, { useEffect, useState } from "react";
import { loadAssets } from "./utils/LoadAssets";
import { assets } from "./utils/AssetFactory";
import { getApp } from "./utils/PixiApp";
import { recursiveTree } from "./utils/recursiveTree";
import { useQuery } from "react-query";
import { getProject } from "../../services/projectApi";
import { useRouter } from "next/router";
import { download } from "@equinor/eds-icons";
import { vsmProject } from "../../interfaces/VsmProject";
import { flattenProject } from "../../utils/flattenProject";
import { getVsmTypeName } from "../GetVsmTypeName";
import { vsmObject } from "../../interfaces/VsmObject";
import { vsmObjectTypes } from "../../types/vsmObjectTypes";
import { taskObject } from "../../interfaces/taskObject";
import { getTasksForProject } from "../../services/taskApi";

const date = new Date().toLocaleDateString(undefined, {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

function mergeAndDownload(
  csvHeaders: string,
  csvFileData: (number | "Left" | "Right" | string)[][],
  fileName: string
) {
  //merge the data into a CSV-string
  let csv = csvHeaders;
  csvFileData.forEach((row) => {
    csv += row.join(",");
    csv += "\n";
  });

  const hiddenElement = document.createElement("a");
  hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
  hiddenElement.target = "_blank";

  //provide the name for the CSV file to be downloaded
  hiddenElement.download = fileName;
  hiddenElement.click();
  hiddenElement.remove();
}

function downloadProjectCardsAsCSV(project: vsmProject) {
  const flatProject = flattenProject(project);

  const csvHeaders = `id,Description,ChoiceGroup,Type,Parent,Children,Tasks\n`;
  const csvFileData = flatProject.map((o) => {
    const id = o.vsmObjectID;
    const description = `"${o.name}"`;
    const type = getVsmTypeName(o.vsmObjectType.pkObjectType);
    const parentObject = o.parent;
    const choiceGroup = o.choiceGroup || "";
    const children = `"${o.childObjects.map((c) => c.vsmObjectID)}"`;
    const tasks = `"${o.tasks.map((t) => t.displayIndex)}"`;

    return [id, description, choiceGroup, type, parentObject, children, tasks];
  });

  mergeAndDownload(
    csvHeaders,
    csvFileData,
    `Flyt CARDS (${project.vsmProjectID}) - ${project.name} - ${date}.csv`
  );
}

function downloadProjectTasksAsCSV(
  tasks: Array<taskObject>,
  project: vsmProject
) {
  const csvHeaders = `id,Description\n`;
  const csvFileData = tasks.map((o) => {
    const id = o.displayIndex;
    const description = `"${o.description}"`;

    return [id, description];
  });
  mergeAndDownload(
    csvHeaders,
    csvFileData,
    `Flyt TASKS (${project.vsmProjectID}) - ${project.name} - ${date}.csv`
  );
}

function downloadCSV(project: vsmProject, tasks: Array<taskObject>) {
  downloadProjectCardsAsCSV(project);
  downloadProjectTasksAsCSV(tasks, project);
}

function stripGarbage({
  childObjects,
  choiceGroup,
  name,
  vsmObjectType: { pkObjectType },
}: vsmObject) {
  const newObj = {};
  if (name) newObj["name"] = name;
  if (choiceGroup) newObj["choiceGroup"] = choiceGroup;
  if (childObjects?.length > 0)
    newObj["childObjects"] = childObjects.map((o) => stripGarbage(o));

  return {
    ...newObj,
    fkObjectType: pkObjectType,
  };
}

function downloadJSON(project: vsmProject) {
  const formattedProject = {
    name: project.name,
    objects: [
      {
        parent: 0,
        name: project.name,
        fkObjectType: vsmObjectTypes.process,
        childObjects: project.objects[0].childObjects.map((o) =>
          stripGarbage(o)
        ),
      },
    ],
  } as vsmProject;

  const json = JSON.stringify(formattedProject);
  const hiddenElement = document.createElement("a");
  hiddenElement.href = "data:text/json;charset=utf-8," + encodeURI(json);
  hiddenElement.target = "_blank";

  //provide the name for the CSV file to be downloaded

  const date = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  hiddenElement.download = `Flyt ${project.vsmProjectID} CARDS - ${project.name} - ${date}.json`;

  hiddenElement.click();
}

export default function Download() {
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
        onClick={() => downloadCSV(project, tasks)}
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
