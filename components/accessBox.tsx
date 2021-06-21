import style from "./accessBox.module.scss";
import { Button, Icon, Input } from "@equinor/eds-core-react";
import { UserDot } from "./UserDot";
import React, { useState } from "react";
import { close, link } from "@equinor/eds-icons";

const icons = {
  close,
  link,
};

Icon.add(icons);

export function AccessBox(): JSX.Element {
  return (
    <div className={style.box}>
      <TopSection title={"Admin Access"} />
      <MiddleSection />
      <BottomSection />
    </div>
  );
}

function RoleSelect() {
  return (
    <select className={style.roleSelect} id="AccessRoles" name="AccessRole">
      <option value="Reader">Reader</option>
      <option value="Admin">Admin</option>
      <option value="Contributor">Contributor</option>
    </select>
  );
}

function TopSection(props: { title: string }) {
  return (
    <div className={style.topSection}>
      <p className={style.heading}> {props.title}</p>
      <Button variant={"ghost_icon"}>
        <Icon name={"close"} />
      </Button>
    </div>
  );
}

function UserItem(props: { name: string }) {
  return (
    <div className={style.userItem}>
      <div className={style.userDotAndName}>
        <UserDot name={props.name} />
        <p className={style.userText}>{props.name}</p>
      </div>

      <RoleSelect />
    </div>
  );
}

function MiddleSection() {
  return (
    <div className={style.middleSection}>
      <div className={style.emailSection}>
        <Input type={"email"} placeholder={"Email"} />
        <span style={{ padding: 4 }} />
        <Button variant={"contained"}>Add</Button>
      </div>
      <div className={style.userListSection}>
        <div className={style.userItem}>
          <div className={style.userDotAndName}>
            <UserDot name={"HSJO@equinor.com"} />
            <p className={style.userText}>Henry S. Sjøen (You)</p>
          </div>
          <p className={style.accessText}>owner</p>
        </div>
        <UserItem name={"Henry S. Sjøen"} />
        <UserItem name={"Rebecca"} />
        <UserItem
          name={
            "Someone with a very looooooong name Someone with a very looooooong name"
          }
        />
      </div>
    </div>
  );
}

function BottomSection() {
  const [copySuccess, setCopySuccess] = useState("");
  function copyToClipboard() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopySuccess("Copied to clipboard!");
      setTimeout(() => {
        setCopySuccess("");
      }, 2000);
    });
  }

  return (
    <div className={style.bottomSection}>
      <Button variant={"outlined"} onClick={copyToClipboard}>
        <Icon name={"link"} />
        {copySuccess || "Copy link"}
      </Button>
    </div>
  );
}
