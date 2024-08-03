import * as userApi from "../services/userApi";

import {
  Button,
  Chip,
  Icon,
  LinearProgress,
  Search,
  Typography,
} from "@equinor/eds-core-react";
import { ChangeEvent, useState } from "react";
import { close, link, add } from "@equinor/eds-icons";
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
import { UserAccessSearch } from "types/UserAccessSearch";
import { Project } from "@/types/Project";
import colors from "@/theme/colors";
import { debounce } from "@/utils/debounce";
import { searchUser } from "../services/userApi";
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

export function TopSection(props: { title: string; handleClose: () => void }) {
  return (
    <div className={style.topSection}>
      <Typography> {props.title}</Typography>
      <Button variant={"ghost_icon"} onClick={props.handleClose}>
        <Icon data={close} />
      </Button>
    </div>
  );
}

type userItem = {
  shortName: string;
  fullName: string | null;
  role?: string;
  onRoleChange?: (role: string) => void;
  onRemove?: () => void;
  onAdd?: () => void;
  disabled: boolean;
};

function UserItem({
  shortName,
  fullName,
  role,
  onRoleChange,
  onRemove,
  onAdd,
  disabled,
}: userItem) {
  function handleChange(role: string) {
    if (role === "Remove" && onRemove) {
      onRemove();
    } else {
      onRoleChange && onRoleChange(role);
    }
  }

  return (
    <div className={style.userItem}>
      <div className={style.userDotAndName}>
        <UserDot name={shortName} />
        <Chip>{shortName}</Chip>
        <Typography color={colors.EQUINOR_PROMINENT}>
          {fullName || ""}
        </Typography>
      </div>

      {role ? (
        role === "Owner" ? (
          "Owner"
        ) : (
          <RoleSelect
            onChange={(role) => handleChange(role)}
            defaultValue={role}
            disabled={disabled}
          />
        )
      ) : (
        <Button
          type={"submit"}
          variant={"contained_icon"}
          onClick={onAdd}
          disabled={disabled}
          className={style.addButton}
        >
          <Icon data={add} size={16} />
        </Button>
      )}
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
  const queryClient = useQueryClient();

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
      onSuccess: () => {
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
    addUserMutation.mutate({
      user: user.shortName,
      vsmId: props.vsmId,
      role: accessRoles.Contributor,
      fullName: user.displayName,
    });
  };

  if (props.loading) {
    return <p>Loading...</p>;
  }
  return (
    <UserListAndSearch
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

type UserListAndSearch = {
  isAdmin: boolean;
  users: userAccess[];
  onRoleChange: (arg1: userAccess, arg2: string) => void;
  onRemove: (arg: userAccess) => void;
  onAdd: (arg1: UserAccessSearch) => void;
};

export const UserListAndSearch = ({
  isAdmin,
  users,
  onRoleChange,
  onRemove,
  onAdd,
}: UserListAndSearch) => {
  const [searchText, setSearchText] = useState("");
  const { data: usersSearched, isLoading: loadingUsers } = useQuery(
    ["users", searchText],
    () => searchUser(searchText),
    {
      enabled: searchText.trim() !== "",
    }
  );

  return (
    <div className={style.middleSection}>
      {isAdmin ? (
        <Search
          className={style.searchBar}
          disabled={!isAdmin}
          autoFocus
          type={"text"}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            debounce(
              () => setSearchText(`${e.target.value}`),
              500,
              "userSearch"
            );
          }}
        />
      ) : (
        <div className={style.infoCannotEdit}>
          <Typography variant="body_short">
            You need to be owner or admin to manage sharing
          </Typography>
        </div>
      )}
      <div className={style.userListSection}>
        {users?.map((user) => (
          <UserItem
            key={user.accessId}
            shortName={user.user}
            fullName={user.fullName}
            role={user.role}
            onRoleChange={(role) => onRoleChange(user, role)}
            onRemove={() => onRemove(user)}
            disabled={!isAdmin}
          />
        ))}
        {usersSearched && usersSearched?.length > 0 && (
          <div className={style.separator} />
        )}
        {loadingUsers ? (
          <LinearProgress />
        ) : (
          usersSearched
            ?.filter(
              (userSearched) =>
                !users.find(
                  (userWithRole) =>
                    userWithRole.user.toLowerCase() === userSearched.shortName
                )
            )
            .map((user) => (
              <UserItem
                key={user.shortName}
                shortName={user.shortName.toUpperCase()}
                fullName={user.displayName}
                disabled={!isAdmin}
                onAdd={() => onAdd(user)}
              />
            ))
        )}
      </div>
    </div>
  );
};

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
