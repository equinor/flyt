import React, { useEffect } from "react";
import { defaultAnnouncements, DndContext, DragOverlay } from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useQuery } from "react-query";
import { getProject } from "../../../services/projectApi";
import { Loading } from "../../../components/loading";
import { ErrorMessage } from "../../../components/errorMessage";
import { MyCard } from "../../../components/card";
import { Layouts } from "../../../layouts/LayoutWrapper";
import { vsmObject } from "../../../interfaces/VsmObject";
import { useRouter } from "next/router";

function SortableContainer(props: { children: React.ReactNode; id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {props.children}
    </div>
  );
}
function CardChildrenRow(props: { parent: vsmObject }) {
  const left = props.parent.childObjects.filter(
    (child) => child.choiceGroup === "Left"
  );
  const right = props.parent.childObjects.filter(
    (child) => child.choiceGroup === "Right"
  );
  const center = props.parent.childObjects.filter(
    (child) => child.choiceGroup !== "Left" && child.choiceGroup !== "Right"
  );

  const choiceGroups = [left, center, right];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        backgroundColor: "rgba(0,0,0,0.01)",
        borderRadius: "5px",
      }}
    >
      {choiceGroups.map((choiceGroup) => (
        <div
          key={`children-of-${props.parent.vsmObjectID}-${choiceGroup[0]?.choiceGroup}`} // example: children-of-1-Left
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "rgba(0,0,0,0.01)",
            borderRadius: "5px",
          }}
        >
          {choiceGroup.map((child) => (
            <>
              <MyCard key={child.vsmObjectID} vsmObject={child} />
              <CardChildrenRow parent={child} />
            </>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function MultiListPage() {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: process,
    error,
    isLoading,
  } = useQuery(["project", id], () => getProject(id), {
    enabled: !!id,
  });

  // Store the sorting order of the cards, so we can reorder them when the user drags and drops them
  // Note, this is first done locally, without reloading the page, and then sent to the server
  const [containerIds, setContainerIds] = React.useState([]);

  // Todo: move Supplier,Input,Output and Customer cards out from the DNDContext
  //     This is because they should be static, and not be draggable (or sortable)

  // Whenever we get an update from the server, we update the local state
  // That means that the server is the source of truth for the process, we just do our best effort to keep it in sync
  useEffect(() => {
    if (process) {
      setContainerIds(
        process.objects[0].childObjects.map((o) => `${o.vsmObjectID}`)
      );
    }
  }, [process]);

  // Store the card we are currently dragging, so we can show a drag overlay
  const [activeCardId, setActiveCardId] = React.useState(null);

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage error={error} />;

  function getVsmObject(id) {
    return process.objects[0].childObjects.find((o) => o.vsmObjectID == id);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <DndContext
        onDragStart={(event) => setActiveCardId(event.active.id)}
        onDragEnd={(event) => {
          // Todo: support for multiContainer movements

          const { active, over } = event;

          if (!over) return;

          if (active.id !== over.id) {
            setContainerIds((items) => {
              const oldIndex = items.indexOf(active.id);
              const newIndex = items.indexOf(over.id);

              return arrayMove(items, oldIndex, newIndex);
            });
          }
        }}
        announcements={defaultAnnouncements}
      >
        <SortableContext
          items={containerIds}
          strategy={horizontalListSortingStrategy}
        >
          <div style={{ display: "flex", gap: 12 }}>
            {containerIds.map((id) => {
              // Might be a more efficient way to do this...
              const card = getVsmObject(id);
              return (
                <SortableContainer id={id} key={id}>
                  <MyCard // MainActivities, First row
                    vsmObject={card}
                  />
                  <CardChildrenRow parent={card} />
                </SortableContainer>
              );
            })}
          </div>
        </SortableContext>
        <DragOverlay style={{ opacity: 0.8 }}>
          {activeCardId ? (
            <MyCard vsmObject={getVsmObject(activeCardId)} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

MultiListPage.auth = true;
MultiListPage.layout = Layouts.Empty;
