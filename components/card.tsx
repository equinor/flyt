import { GraphNode } from "../utils/layoutEngine";
import { vsmObjectTypes } from "../types/vsmObjectTypes";
import React from "react";
import styles from "./card.module.scss";
import { Reorder } from "framer-motion";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { vsmObject } from "../interfaces/VsmObject";
import { getColor } from "../utils/getColor";

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

function DraggableChildActivity(props: { child: vsmObject }) {
  const { child } = props;
  const { name, role, time, vsmObjectType } = child;
  return (
    <div
      style={{
        backgroundColor: "rgba(0,0,0,0.05)",
        borderRadius: "5px",
        display: "flex",
        flexDirection: "column",
        margin: "10px",
      }}
    >
      <button className={getStyle(vsmObjectType.pkObjectType)}>
        <p>{name}</p>
        <p>{role}</p>
        <p>{time}</p>
      </button>
      {child.childObjects.length ? (
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              // backgroundColor: "rgba(0,0,0,0.05)",
              // border: "solid rgba(0,0,0,0.05)",
              borderRadius: "5px",
            }}
          >
            {child.childObjects
              .filter((child) => child.choiceGroup === "Left")
              .map((child) => (
                <DraggableChildActivity key={child.vsmObjectID} child={child} />
              ))}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              // backgroundColor: "rgba(0,0,0,0.05)",
              // border: "solid rgba(0,0,0,0.05)",
              borderRadius: "5px",
            }}
          >
            {child.childObjects
              .filter((child) => child.choiceGroup === "Right")
              .map((child) => (
                <DraggableChildActivity key={child.vsmObjectID} child={child} />
              ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function DraggableMainActivity(props: { child: vsmObject }) {
  const { child } = props;
  const { name, role, time, vsmObjectType } = child;

  return (
    <div
      style={{
        // backgroundColor: "rgba(0,0,0,0.05)",
        borderRadius: "5px",
        display: "flex",
        padding: "10px",
        flexDirection: "column",
      }}
    >
      <button className={getStyle(vsmObjectType.pkObjectType)}>
        <p>{name}</p>
        <p>{role}</p>
        <p>{time}</p>
      </button>
      {child.childObjects.length ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "rgba(0,0,0,0.05)",
            // borderRadius: "5px",
          }}
        >
          {child.childObjects.map((child) => (
            <DraggableChildActivity key={child.vsmObjectID} child={child} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
