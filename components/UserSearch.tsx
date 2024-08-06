import { searchUser } from "@/services/userApi";
import { userAccess } from "@/types/UserAccess";
import { UserAccessSearch } from "@/types/UserAccessSearch";
import { debounce } from "@/utils/debounce";
import { LinearProgress, Search, Typography } from "@equinor/eds-core-react";
import { ChangeEvent, useState } from "react";
import { useQuery } from "react-query";
import { UserItem } from "./UserItem";
import styles from "./UserSearch.module.scss";

type UserSearch = {
  isAdmin: boolean;
  users: userAccess[];
  onRoleChange: (arg1: userAccess, arg2: string) => void;
  onRemove: (arg: userAccess) => void;
  onAdd: (arg1: UserAccessSearch) => void;
};

export const UserSearch = ({
  isAdmin,
  users,
  onRoleChange,
  onRemove,
  onAdd,
}: UserSearch) => {
  const [searchText, setSearchText] = useState("");
  const { data: usersSearched, isLoading: loadingUsers } = useQuery(
    ["users", searchText],
    () => searchUser(searchText),
    {
      enabled: searchText.trim() !== "",
    }
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    debounce(() => setSearchText(e.target.value), 500, "userSearch");
  };

  const InfoNoEditAccess = () => (
    <div className={styles.infoCannotEdit}>
      <Typography variant="body_short">
        You need to be owner or admin to manage sharing
      </Typography>
    </div>
  );

  const UserItems = () =>
    users?.map((user) => (
      <UserItem
        key={user.accessId}
        shortName={user.user}
        fullName={user.fullName}
        role={user.role}
        onRoleChange={(role) => onRoleChange(user, role)}
        onRemove={() => onRemove(user)}
        disabled={!isAdmin}
      />
    ));

  const SearchedUserItems = () =>
    usersSearched
      ?.filter(
        (userSearched) =>
          !users.some(
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
      ));

  return (
    <div className={styles.container}>
      {isAdmin ? (
        <Search
          className={styles.searchBar}
          disabled={!isAdmin}
          autoFocus
          type={"text"}
          onChange={handleSearchChange}
        />
      ) : (
        <InfoNoEditAccess />
      )}
      <div className={styles.userList}>
        {<UserItems />}
        {usersSearched && usersSearched.length > 0 && (
          <div className={styles.separator} />
        )}
        {loadingUsers ? <LinearProgress /> : <SearchedUserItems />}
      </div>
    </div>
  );
};
