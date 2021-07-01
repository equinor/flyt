import style from "./accessBox.module.scss";
import { Button, Icon, Input } from "@equinor/eds-core-react";
import { UserDot } from "./UserDot";
import React, { useState } from "react";
import { close, link } from "@equinor/eds-icons";
import { accessRoles } from "../types/AccessRoles";
import { vsmProject } from "../interfaces/VsmProject";
import BaseAPIServices from "../services/BaseAPIServices";
import { useMutation, useQuery, useQueryClient } from "react-query";
import * as userApi from "../services/userApi";
import { unknownErrorToString } from "utils/isError";
import { useStoreDispatch } from "hooks/storeHooks";
const icons = {
  close,
  link,
};

Icon.add(icons);

export function AccessBox(props: {
  project: vsmProject;
  handleClose;
  isAdmin: boolean;
}): JSX.Element {
  const { data: userAccesses, isLoading } = useQuery(
    "userAccesses",
    () =>
      BaseAPIServices.get(
        `/api/v1.0/userAccess/${props.project.vsmProjectID}`
      ).then((value) => {
        return value.data;
      }),
    { enabled: !!(props.project && props.project.vsmProjectID) }
  );

  if (!props.project) return <p>Missing project</p>;
  const { created, vsmProjectID } = props.project;

  const owner = created.userIdentity;
  return (
    <div className={style.box}>
      <TopSection title={"Sharing"} handleClose={props.handleClose} />
      <MiddleSection
        owner={owner}
        users={userAccesses}
        vsmId={vsmProjectID}
        loading={isLoading}
        isAdmin={props.isAdmin}
      />
      <BottomSection />
    </div>
  );
}

function RoleSelect(props: {
  onChange: (arg0: string) => void;
  defaultValue: string;
  disabled: boolean;
}) {
  return (
    <select
      defaultValue={props.defaultValue}
      className={style.roleSelect}
      id="AccessRoles"
      name="AccessRole"
      onChange={(event) => props.onChange(event.target.value)}
      disabled={props.disabled}
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
  disabled: boolean;
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
        disabled={props.disabled}
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
  isAdmin: boolean;
}) {
  const dispatch = useStoreDispatch();
  const [userInput, setEmailInput] = useState("");
  const queryClient = useQueryClient();
  const addUserMutation = useMutation(
    (newUser: { user: string; vsmId: number; role: string }) =>
      userApi.add(newUser),
    {
      onSuccess: () => {
        setEmailInput("");
        queryClient.invalidateQueries("userAccesses");
      },
      onError: (e) => dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );
  const removeUserMutation = useMutation(
    (props: { accessId; vsmId }) => userApi.remove(props),
    {
      onSuccess: () => queryClient.invalidateQueries("userAccesses"),
      onError: (e) => dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );
  const changeUserMutation = useMutation(
    (props: { user: { accessId: number }; role: string }) =>
      userApi.update(props),
    {
      onSuccess: () => queryClient.invalidateQueries("userAccesses"),
      onError: (e) => dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

  /**
   * Add new user
   * @param e
   */
  function handleSubmit(e) {
    e.preventDefault();
    addUserMutation.mutate({
      user: userInput,
      vsmId: props.vsmId,
      role: accessRoles.Contributor,
    });
  }

  if (props.loading) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <form className={style.emailSection} onSubmit={handleSubmit}>
        <Input
          disabled={!props.isAdmin}
          autoFocus
          type={"text"}
          // pattern={"[Bb]anana|[Cc]herry"} //Todo: pattern match?
          placeholder={"shortname"}
          value={userInput}
          onChange={(event) => setEmailInput(event.target.value)}
        />
        <span style={{ padding: 4 }} />
        <Button type={"submit"} variant={"contained"} disabled={!props.isAdmin}>
          {props.loading ? "Adding..." : "Add"}
        </Button>
      </form>
      {!props.isAdmin && (
        <div className={style.infoCannotEdit}>
          <p>You need to be the creator or an admin to manage sharing</p>
        </div>
      )}
      <div className={style.middleSection}>
        <div className={style.userListSection}>
          <OwnerItem owner={props.owner} />
          {props.users?.map((user) => (
            <UserItem
              key={user.accessId}
              user={user}
              onRoleChange={(role) => changeUserMutation.mutate({ user, role })}
              onRemove={() =>
                removeUserMutation.mutate({
                  accessId: user.accessId,
                  vsmId: props.vsmId,
                })
              }
              disabled={!props.isAdmin}
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
