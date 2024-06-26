import * as userApi from "../services/userApi";

import { Button, Icon, Input } from "@equinor/eds-core-react";
import { ChangeEvent, useState } from "react";
import { close, link } from "@equinor/eds-icons";
import { useAccount, useMsal } from "@azure/msal-react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import BaseAPIServices from "../services/BaseAPIServices";
import { UserDot } from "./UserDot";
import { accessRoles } from "@/types/AccessRoles";
import { getOwner } from "utils/getOwner";
import { notifyOthers } from "@/services/notifyOthers";
import style from "./AccessBox.module.scss";
import { unknownErrorToString } from "utils/isError";
import { useStoreDispatch } from "hooks/storeHooks";
import { userAccess } from "types/UserAccess";
import { Project } from "@/types/Project";
import { useProjectId } from "@/hooks/useProjectId";

export function AccessBox(props: {
  project: Project;
  handleClose: () => void;
  isAdmin: boolean;
}): JSX.Element {
  const { data: userAccesses, isLoading } = useQuery(
    ["userAccesses", props.project.vsmProjectID],
    () =>
      BaseAPIServices.get(
        `/api/v1.0/userAccess/${props.project.vsmProjectID}`
      ).then((value) => {
        return value.data;
      }),
    { enabled: !!(props.project && props.project.vsmProjectID) }
  );

  if (!props.project) return <p>Missing project</p>;
  const { vsmProjectID } = props.project;

  return (
    <div className={style.box}>
      <TopSection title={"User access"} handleClose={props.handleClose} />
      <MiddleSection
        owner={getOwner(props.project) ?? ""}
        users={userAccesses}
        vsmId={vsmProjectID}
        loading={isLoading}
        isAdmin={props.isAdmin}
      />
      <BottomSection vsmProjectID={props.project.vsmProjectID} />
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

function TopSection(props: { title: string; handleClose: () => void }) {
  return (
    <div className={style.topSection}>
      <p className={style.heading}> {props.title}</p>
      <Button variant={"ghost_icon"} onClick={props.handleClose}>
        <Icon data={close} />
      </Button>
    </div>
  );
}

function UserItem(props: {
  user: { accessId: number; user: string; role: string };
  onRoleChange: (role: string) => void;
  onRemove: () => void;
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
      <p className={style.accessText}>Owner</p>
    </div>
  );
}

function MiddleSection(props: {
  owner: string;
  users: userAccess[];
  vsmId: number;
  loading: boolean;
  isAdmin: boolean;
}) {
  const dispatch = useStoreDispatch();
  const [userInput, setEmailInput] = useState("");
  const queryClient = useQueryClient();

  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});

  const { projectId } = useProjectId();
  const addUserMutation = useMutation(
    (newUser: { user: string; vsmId: number; role: string }) =>
      userApi.add(newUser),
    {
      onSuccess: () => {
        setEmailInput("");
        void notifyOthers("Gave access to a new user", projectId, account);
        void queryClient.invalidateQueries();
      },
      onError: (e: Error | null) =>
        dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );
  const removeUserMutation = useMutation(
    (props: { accessId: string; vsmId: number }) => userApi.remove(props),
    {
      onSuccess: () => {
        void notifyOthers("Removed access for user", projectId, account);
        return queryClient.invalidateQueries();
      },
      onError: (e: Error | null) =>
        dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );
  const changeUserMutation = useMutation(
    (props: { user: { accessId: number }; role: string }) =>
      userApi.update(props),
    {
      onSuccess() {
        void notifyOthers("Updated access for some user", projectId, account);
        return queryClient.invalidateQueries("userAccesses");
      },
      onError: (e: Error | null) =>
        dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

  function handleSubmit() {
    userInput
      .split(",") // Split by comma
      .filter((user) => !!user.trim()) // remove empty strings
      .map((user) => user.trim()) // remove whitespace
      .forEach((user) => {
        // add each user
        addUserMutation.mutate({
          user: user,
          vsmId: props.vsmId,
          role: accessRoles.Contributor,
        });
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
          placeholder={"shortname"}
          value={userInput}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setEmailInput(event.target.value)
          }
        />
        <span style={{ padding: 4 }} />
        <Button type={"submit"} variant={"contained"} disabled={!props.isAdmin}>
          {props.loading ? "Adding..." : "Add"}
        </Button>
      </form>
      {!props.isAdmin && (
        <div className={style.infoCannotEdit}>
          <p>You need to be owner or admin to manage sharing</p>
        </div>
      )}
      <div className={style.middleSection}>
        <div className={style.userListSection}>
          {/* 
            Filter away the owner. 
            This could be changed to support giving away ownership of a process.
          */}
          <OwnerItem owner={props.owner} />
          {props.users
            ?.filter((user) => user.user !== props.owner)
            .map((user) => (
              <UserItem
                key={user.accessId}
                user={user}
                onRoleChange={(role: any) =>
                  changeUserMutation.mutate({ user, role })
                }
                onRemove={() =>
                  removeUserMutation.mutate({
                    accessId: user.accessId.toString(),
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

function BottomSection(props: { vsmProjectID: number }) {
  const [copySuccess, setCopySuccess] = useState("");

  function copyToClipboard() {
    navigator.clipboard
      .writeText(`${window.location.origin}/process/${props.vsmProjectID}`)
      .then(() => {
        setCopySuccess("Copied to clipboard!");
        setTimeout(() => {
          setCopySuccess("");
        }, 2000);
      });
  }

  return (
    <div className={style.bottomSection}>
      <Button variant={"outlined"} onClick={copyToClipboard}>
        <Icon data={link} />
        {copySuccess || "Copy link"}
      </Button>
    </div>
  );
}
