import { GraphNode } from "../utils/layoutEngine";
import { vsmObjectTypes } from "../types/vsmObjectTypes";
import React, { CSSProperties } from "react";
import styles from "./card.module.scss";
import { Reorder } from "framer-motion";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { vsmObject } from "../interfaces/VsmObject";
import { CSS } from "@dnd-kit/utilities";

function getStyle(type: vsmObjectTypes) {
  switch (type) {
    case vsmObjectTypes.process:
      return styles.process;
    case vsmObjectTypes.supplier:
      return styles.supplier;
    case vsmObjectTypes.input:
      return styles.input;
    case vsmObjectTypes.mainActivity:
      return styles.mainActivity;
    case vsmObjectTypes.subActivity:
      return styles.subActivity;
    case vsmObjectTypes.text:
      return styles.text;
    case vsmObjectTypes.waiting:
      return styles.waiting;
    case vsmObjectTypes.output:
      return styles.output;
    case vsmObjectTypes.customer:
      return styles.customer;
    case vsmObjectTypes.choice:
      return styles.choice;
    case vsmObjectTypes.error:
      return styles.error;
  }
  return styles.card;
}

export function Card(props: { node: GraphNode; onClick: (event) => void }) {
  const { onClick, node } = props;
  if (!node) return null;
  const { role, time, type, name } = node;

  if (type === vsmObjectTypes.choice) {
    return (
      <Reorder.Item
        className={styles.cardWrapper}
        style={{
          listStyle: "none",
          border: "1px solid rgba(0,0,0,0.05)",
        }}
        onClick={onClick}
        value={node}
        drag
      >
        <button className={getStyle(type)}>
          <p>{name}</p>
          <p>{role}</p>
          <p>{time}</p>
        </button>
        {/*{node.children.map((child) => (*/}
        {/*  <Card key={child.id} node={child} onClick={onClick} />*/}
        {/*))}*/}
      </Reorder.Item>
    );
  }

  return (
    <Reorder.Item
      value={node}
      whileDrag={{
        opacity: 0.5,
      }}
      drag
      className={styles.cardWrapper}
      title={name}
      onClick={() => onClick(node.id)}
    >
      <button className={getStyle(type)}>
        <p>{name}</p>
        <p>{role}</p>
        <p>{time}</p>
      </button>
    </Reorder.Item>
  );
}

function DraggableChildActivity(props: {
  child: vsmObject;
  onClickCard: (event) => void;
  direction: "horizontal" | "vertical";
}) {
  const { child } = props;
  const { name, role, time, vsmObjectType } = child;
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `drag-${child.vsmObjectID}`,
  });
  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    backgroundColor: "rgba(0,0,0,0.01)",
    borderRadius: "5px",
    display: "flex",
    flexDirection: "column",
    margin: "8px", // consider making smaller
  };
  //

  const { setNodeRef: setDropNodeRef } = useDroppable({
    id: `drop-${props.child.vsmObjectID}`,
  });
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <button
        className={getStyle(vsmObjectType.pkObjectType)}
        onClick={props.onClickCard}
        title={name}
      >
        <p>{name || child.vsmObjectType.name}</p>
        <p>{role}</p>
        <p>{time}</p>
      </button>

      {child.vsmObjectType.pkObjectType === vsmObjectTypes.choice ? (
        <div
          style={{
            display: "flex",
          }}
        >
          {["Left", "Right"].map((choiceGroup) => (
            <div
              key={choiceGroup}
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "rgba(0,0,0,0.01)",
                borderRadius: "5px",
                // keep some space for dropZone if no children
                minWidth: 118,
                minHeight: 128,
              }}
            >
              {child.childObjects
                .filter((child) => child.choiceGroup === choiceGroup)
                .map((child) => (
                  <DraggableChildActivity
                    key={child.vsmObjectID}
                    child={child}
                    onClickCard={props.onClickCard}
                    direction={props.direction}
                  />
                ))}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function MyCard(props: { vsmObject: vsmObject }) {
  if (!props.vsmObject) {
    return (
      <div className={getStyle(vsmObjectTypes.error)}>
        No vsmObject provided to this component
      </div>
    );
  }
  const { name, role, time, vsmObjectType } = props.vsmObject;
  return (
    <button className={getStyle(vsmObjectType.pkObjectType)} title={name}>
      <p>{name || vsmObjectType.name}</p>
      <p>{role}</p>
      <p>{time}</p>
    </button>
  );
}

export function MainActivityContainer(props: {
  child: vsmObject;
  onClickCard: (event) => void;
  direction: "horizontal" | "vertical";
}) {
  const { child } = props;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    // transition, // Only for sortable
  } = useDraggable({
    id: `${child.vsmObjectID}`,
  });
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    // transition,
    backgroundColor: "rgba(0,0,0,0.01)",
    borderRadius: "5px",
    display: "flex",
    padding: "10px",
    flexDirection: "column",
    margin: "10px",
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <MyCard vsmObject={child} />
      {child.childObjects.length ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "rgba(0,0,0,0.01)",
            borderRadius: "5px",
          }}
        >
          {child.childObjects.map((child) => (
            <DraggableChildActivity
              key={child.vsmObjectID}
              child={child}
              onClickCard={props.onClickCard}
              direction={props.direction}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
