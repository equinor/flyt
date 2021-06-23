import style from "./accessBox.module.scss";
import { Button, Icon, Input } from "@equinor/eds-core-react";
import { UserDot } from "./UserDot";
import React, { useEffect, useState } from "react";
import { close, link } from "@equinor/eds-icons";
import { accessRoles } from "../types/AccessRoles";
import { vsmProject } from "../interfaces/VsmProject";
import BaseAPIServices from "../services/BaseAPIServices";

const icons = {
  close,
  link,
};

Icon.add(icons);

//Do we need to use our store? I'm contemplating to just add the request and store everything locally....
export function AccessBox(props: {
  project: vsmProject;
  handleClose;
}): JSX.Element {
  const [userAccesses, setUserAccesses] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    BaseAPIServices.get(`/api/v1.0/userAccess/${vsmProjectID}`)
      .then((value) => {
        setUserAccesses(value.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [props.project]);

  if (!props.project) return <></>;
  const { created, vsmProjectID } = props.project;

  const owner = created.userIdentity;
  return (
    <div className={style.box}>
      <TopSection title={"Sharing"} handleClose={props.handleClose} />
      <MiddleSection
        owner={owner}
        users={userAccesses}
        vsmId={vsmProjectID}
        loading={loading}
      />
      <BottomSection />
    </div>
  );
}

function RoleSelect(props: {
  onChange: (arg0: string) => void;
  defaultValue: string;
}) {
  return (
    <select
      defaultValue={props.defaultValue}
      className={style.roleSelect}
      id="AccessRoles"
      name="AccessRole"
      onChange={(event) => props.onChange(event.target.value)}
    >
      <option value="Admin">Admin</option>
      <option value="Contributor">Contributor</option>
      <option value="Remove">Remove</option>
    </select>
  );
}

function TopSection(props: { title: string; handleClose }) {
  return (
    <div className={style.topSection}>
      <p className={style.heading}> {props.title}</p>
      <Button variant={"ghost_icon"} onClick={props.handleClose}>
        <Icon name={"close"} />
      </Button>
    </div>
  );
}

function UserItem(props: {
  user: { accessId: number; user: string; role: string };
  onRoleChange;
  onRemove;
}) {
  function handleChange(role: string) {
    if (role === "Remove") {
      props.onRemove();
    } else {
      props.onRoleChange(role);
    }
  }

  return (
    <div className={style.userItem}>
      <div className={style.userDotAndName}>
        <UserDot name={props.user.user} />
        <p className={style.userText}>{props.user.user}</p>
      </div>

      <RoleSelect
        onChange={(role) => handleChange(role)}
        defaultValue={props.user.role}
      />
    </div>
  );
}

function OwnerItem(props: { owner: string }) {
  return (
    <div className={style.userItem}>
      <div className={style.userDotAndName}>
        <UserDot name={props.owner} />
        {/*Todo: If you are the owner, add "(You)" to the paragraph under  */}
        <p className={style.userText}>{props.owner}</p>
      </div>
      <p className={style.accessText}>owner</p>
    </div>
  );
}

function MiddleSection(props: {
  owner: string;
  users: { accessId: number; user: string; role: string }[];
  vsmId: number;
  loading: boolean;
}) {
  const [userInput, setEmailInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState(props.users);
  useEffect(() => setUsers(props.users), [props.users]);

  /**
   * Add new user
   * @param e
   */
  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const oldInput = userInput;
    setEmailInput("");

    BaseAPIServices.post(`/api/v1.0/userAccess`, {
      user: userInput,
      vsmId: props.vsmId,
      role: accessRoles.Contributor,
    })
      .then((value) => {
        setUsers([...users, value.data]);
      })
      .catch((error) => {
        setEmailInput(oldInput);
        console.error(error);
        //todo: snackbar error message
      })
      .finally(() => setLoading(false));
  }

  if (props.loading) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <form className={style.emailSection} onSubmit={handleSubmit}>
        <Input
          type={"text"}
          // pattern={"[Bb]anana|[Cc]herry"}
          placeholder={"shortname"}
          value={userInput}
          onChange={(event) => setEmailInput(event.target.value)}
        />
        <span style={{ padding: 4 }} />
        <Button type={"submit"} variant={"contained"}>
          {loading ? "Adding..." : "Add"}
        </Button>
      </form>
      <div className={style.middleSection}>
        <div className={style.userListSection}>
          <OwnerItem owner={props.owner} />
          {users.map((user, index) => (
            <UserItem
              key={user.accessId}
              user={user}
              onRemove={() => {
                BaseAPIServices.delete(
                  `/api/v1.0/userAccess/${props.vsmId}/${user.accessId}`
                )
                  .then(() => {
                    const newUsers = [...users];
                    newUsers.splice(
                      newUsers.findIndex((u) => u.accessId === user.accessId),
                      1
                    );
                    setUsers(newUsers);
                    //Todo: snack-message
                    // alert(
                    //   `Removed "${user.user}". They still have read access`
                    // );
                  })
                  .catch((reason) => console.error(reason));
              }}
              onRoleChange={(role) => {
                //Todo: patch user
                BaseAPIServices.patch(`/api/v1.0/userAccess`, {
                  accessId: user.accessId,
                  role: role,
                })
                  .then((value) => console.log(value.data))
                  .catch((reason) => console.error(reason));
                // console.log(`${user} -> ${role}`);
              }}
            />
          ))}
        </div>
      </div>
    </>
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
