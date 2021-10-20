import React from "react";
import { useRouter } from "next/router";
import { Layouts } from "../../../../layouts/LayoutWrapper";
import CategoriesPage from "../categories";
import { QipCard } from "../../../../components/QipCard";
import { useQuery } from "react-query";
import { getTask } from "../../../../services/taskApi";
import { unknownErrorToString } from "../../../../utils/isError";
import { Button, Checkbox, Icon } from "@equinor/eds-core-react";
import { SideBarBody } from "../../../../components/SideBarBody";
import { vsmTaskTypes } from "../../../../types/vsmTaskTypes";
import { vsmObjectTypes } from "../../../../types/vsmObjectTypes";
import { getVSMObject } from "../../../../services/vsmObjectApi";
import gfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { TaskButton } from "../../../../components/TaskButton";
import Link from "next/link";
import { arrow_back } from "@equinor/eds-icons";

function getTaskTypeString(vsmTaskTypeID: vsmTaskTypes) {
  switch (vsmTaskTypeID) {
    case vsmTaskTypes.problem:
      return "problem";
    case vsmTaskTypes.question:
      return "question";
    case vsmTaskTypes.idea:
      return "idea";
    case vsmTaskTypes.unknown:
      return "unknown thing";
  }
}

function getVSMObjectTypeColor(vsmObjectType: vsmObjectTypes) {
  switch (vsmObjectType) {
    case vsmObjectTypes.mainActivity:
      return "#00c1ff";
    case vsmObjectTypes.subActivity:
      return "#FDD835";
    case vsmObjectTypes.waiting:
    case vsmObjectTypes.choice:
      return "#FF8F00";
    case vsmObjectTypes.process:
    case vsmObjectTypes.supplier:
    case vsmObjectTypes.input:
    case vsmObjectTypes.output:
    case vsmObjectTypes.customer:
      return "#00d889";
    default:
      return "#FAFAFA";
  }
}

function VSMObjectCard(props: { vsmObjectId: number }) {
  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading, error } = useQuery(
    ["vsmObject", props.vsmObjectId],
    () => getVSMObject(props.vsmObjectId)
  );
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{unknownErrorToString(error)}</p>;
  return (
    <div>
      <div style={{ display: "flex" }}>
        <div
          style={{
            marginLeft: 8,
            paddingLeft: 8,
            paddingTop: 1,
            borderBottomLeftRadius: 6,
            borderTopLeftRadius: 6,
            width: 126,
            height: 136,
            minWidth: 126,
            minHeight: 136,
            backgroundColor: getVSMObjectTypeColor(
              data.vsmObjectType.pkObjectType
            ),
            resize: "both",
            overflow: "scroll",
          }}
        >
          <p style={{ opacity: 0.4 }}>{data.vsmObjectType.name}</p>
          <ReactMarkdown remarkPlugins={[gfm]}>{data.name}</ReactMarkdown>
          <p style={{ opacity: 0.8 }}>{data.role}</p>
          <p>{!!data.time && `${data.time}${data.timeDefinition}`}</p>
        </div>
        <div
          style={{
            backgroundColor: "white",
            borderLeft: "none",
            borderBottomRightRadius: 6,
            borderTopRightRadius: 6,
            marginRight: 8,
            paddingLeft: 8,
            paddingTop: 1,
            padding: 8,
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
          }}
        >
          {data.tasks.map((task) => (
            <div
              key={task.vsmTaskID}
              onClick={() =>
                router.push(`/process/${id}/qips/${task.vsmTaskID}`)
              }
            >
              <TaskButton task={task} selected={true} draft={false} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Category(): JSX.Element {
  const router = useRouter();
  const { id, taskId } = router.query;
  const {
    data: task,
    isLoading,
    error,
  } = useQuery(["task", id, taskId], () => getTask(id, taskId));

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{unknownErrorToString(error)}</p>;

  return (
    <div>
      <Link href={`/process/${id}/qips`}>
        <Button variant={"ghost_icon"} title={"back"}>
          <Icon data={arrow_back} />
        </Button>
      </Link>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <p>{task.name}</p>
        <QipCard task={task} />
        <Checkbox
          disabled
          label={"Solved"}
          defaultChecked={task.solved}
          onChange={(e) => {
            //todo;  mutate checked state
            console.log(e.target);
          }}
        />
        <p>{task.solvedDate}</p>
        <h2>
          Cards that have this ({task.displayIndex}){" "}
          {getTaskTypeString(task.taskType.vsmTaskTypeID)}
        </h2>
        {!task.objects.length && (
          <p>
            This {getTaskTypeString(task.taskType.vsmTaskTypeID)} is not added
            to any cards
          </p>
        )}
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {task.objects.some((o) => o.vsmObjectType)
            ? task.objects.map((o) => {
                return (
                  <SideBarBody
                    key={o.vsmObjectID}
                    selectedObject={o}
                    onChangeName={(e) => console.log(e)}
                    onChangeRole={(e) => console.log(e)}
                    onChangeTime={(e) => console.log(e)}
                    setShowNewTaskSection={(e) => console.log(e)}
                    canEdit={false}
                  />
                );
              })
            : task.objects.map((o) => (
                <VSMObjectCard
                  key={o.vsmObjectID}
                  vsmObjectId={o.vsmObjectID}
                />
              ))}
        </div>
      </div>
    </div>
  );
}

CategoriesPage.layout = Layouts.Empty;
Category.auth = true;
