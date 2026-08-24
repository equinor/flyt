import * as userApi from "../services/userApi";

import { Button, Icon, Typography } from "@equinor/eds-core-react";
import { useState } from "react";
import { close, link } from "@equinor/eds-icons";
import { useAccount, useMsal } from "@azure/msal-react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import BaseAPIServices from "../services/BaseAPIServices";
import { accessRoles } from "@/types/AccessRoles";
import { notifyOthers } from "@/services/notifyOthers";
import style from "./AccessBox.module.scss";
import { unknownErrorToString } from "utils/isError";
import { useStoreDispatch } from "hooks/storeHooks";
import { userAccess } from "types/UserAccess";
import { UserAccessSearch } from "types/UserAccessSearch";
import { Project } from "@/types/Project";
import { useProjectId } from "@/hooks/useProjectId";
import { UserSearch } from "./UserSearch";

export function AccessBox(props: {
  project: Project;
  handleClose: () => void;
  isAdmin: boolean;
}): JSX.Element {
  const { data: userAccesses, isLoading } = useQuery(
    ["userAccesses", props.project.vsmProjectID],
    () =>
      BaseAPIServices.get(
        `/api/v2.0/userAccess/${props.project.vsmProjectID}`
      ).then((value) => {
        return value.data;
      }),
    { enabled: !!(props.project && props.project.vsmProjectID) }
  );

  if (!props.project) return <p>Missing project</p>;
  const { vsmProjectID } = props.project;

  return (
    <div className={style.box}>
      <TopSection
        title={"User access"}
        handleClose={props.handleClose}
        vsmProjectID={props.project.vsmProjectID}
      />
      <MiddleSection
        users={userAccesses}
        vsmId={vsmProjectID}
        loading={isLoading}
        isAdmin={props.isAdmin}
      />
    </div>
  );
}

export function TopSection(props: {
  title: string;
  handleClose: () => void;
  vsmProjectID: number;
}) {
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
    <div className={style.topSection}>
      <Typography> {props.title}</Typography>
      <div className={style.topSectionButtons}>
        <Button variant={"ghost"} onClick={copyToClipboard}>
          <Icon data={link} />
          {copySuccess || "Copy link"}
        </Button>
        <Button variant={"ghost_icon"} onClick={props.handleClose}>
          <Icon data={close} />
        </Button>
      </div>
    </div>
  );
}

function MiddleSection(props: {
  users: userAccess[];
  vsmId: number;
  loading: boolean;
  isAdmin: boolean;
}) {
  const dispatch = useStoreDispatch();
  const queryClient = useQueryClient();
  const [isUserAddList, setisUserAddList] = useState<string[]>([]);

  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});

  const { projectId } = useProjectId();
  const addUserMutation = useMutation(
    (newUser: {
      user: UserAccessSearch["shortName"];
      vsmId: number;
      role: string;
      fullName: UserAccessSearch["displayName"];
    }) => userApi.add(newUser),
    {
      onSuccess: (response) => {
        const updatedUserList = isUserAddList.filter(
          (id) => response.data.user !== id
        );
        setisUserAddList(updatedUserList);
        void notifyOthers("Gave access to a new user", projectId, account);
        void queryClient.invalidateQueries();
      },
      onError: (e: Error | null) =>
        dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );
  const removeUserMutation = useMutation(
    (props: { accessId: number; vsmId: number }) => userApi.remove(props),
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

  const handleSubmit = (user: UserAccessSearch) => {
    if (isUserAddList?.includes(user.email)) return;
    setisUserAddList((prev) => {
      return [...prev, user.email];
    });
    addUserMutation.mutate({
      user: user.shortName,
      vsmId: props.vsmId,
      role: accessRoles.Contributor,
      fullName: user.displayName,
    });
  };

  if (props.loading) {
    return <p style={{ paddingLeft: 10 }}>Loading...</p>;
  }
  return (
    <UserSearch
      onRoleChange={(user, role) => changeUserMutation.mutate({ user, role })}
      onRemove={(user) =>
        removeUserMutation.mutate({
          accessId: user.accessId,
          vsmId: props.vsmId,
        })
      }
      users={props.users}
      isAdmin={props.isAdmin}
      onAdd={(user) => handleSubmit(user)}
    />
  );
}
