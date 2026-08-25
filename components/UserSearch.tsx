import { ChangeEvent, useEffect, useRef, useState, useMemo } from "react";
import { useQuery } from "react-query";
import { LinearProgress, Search, Typography } from "@equinor/eds-core-react";

import { searchUser } from "@/services/userApi";
import { userAccess } from "@/types/UserAccess";
import { UserAccessSearch } from "@/types/UserAccessSearch";
import { debounce } from "@/utils/debounce";
import { UserItem } from "./UserItem";
import styles from "./UserSearch.module.scss";
import { accessRoles } from "@/types/AccessRoles";

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
  const [debounceSearchText, setDebounceSearchText] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const targetIndexRef = useRef<HTMLDivElement | null>(null);

  const { data: usersSearched, isLoading: loadingUsers } = useQuery(
    ["usersSearched", debounceSearchText],
    () => searchUser(debounceSearchText),
    {
      enabled: debounceSearchText.trim() !== "",
    }
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    debounce(() => setDebounceSearchText(e.target.value), 500, "userSearch");
  };

  const InfoNoEditAccess = () => (
    <div className={styles.infoCannotEdit}>
      <Typography variant="body_short">
        You need to be {accessRoles.Contributor} to manage sharing
      </Typography>
    </div>
  );

  const UserItems = () => {
    const isSingleUser = users && users.length === 1;
    return (
      users &&
      users.map((user) => (
        <UserItem
          key={user.accessId}
          selectedUser={selectedUser?.toUpperCase()}
          shortName={user.user}
          fullName={user.fullName}
          role={user.role}
          onRoleChange={(role) => onRoleChange(user, role)}
          onRemove={() => onRemove(user)}
          disabled={isSingleUser}
        />
      ))
    );
  };

  useEffect(() => {
    if (selectedUser) {
      const timer = setTimeout(() => {
        setSelectedUser(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [selectedUser]);

  const addHandler = (user: UserAccessSearch) => {
    setSelectedUser(user.shortName);
    onAdd(user);
    setSearchText("");
    setDebounceSearchText("");
    inputRef.current?.focus();
  };

  const filteredSearchResults = useMemo(
    () =>
      usersSearched?.filter(
        (userSearched) =>
          !users.some(
            (userWithRole) =>
              userWithRole.user.toLowerCase() === userSearched.shortName
          )
      ),

    [usersSearched, users]
  );

  const resultCount = filteredSearchResults?.length ?? 0;
  const targetIndex = resultCount >= 4 ? 3 : resultCount - 1;

  useEffect(() => {
    if (resultCount >= 0) {
      targetIndexRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [resultCount]);

  const SearchedUserItems = () => (
    <>
      {filteredSearchResults?.map((user, index) => (
        <UserItem
          key={user.shortName}
          ref={index === targetIndex ? targetIndexRef : null}
          selectedUser={selectedUser?.toUpperCase()}
          shortName={user.shortName.toUpperCase()}
          fullName={user.displayName}
          disabled={!isAdmin}
          onAdd={() => addHandler(user)}
        />
      ))}
    </>
  );

  return (
    <div className={styles.container}>
      <Typography className={styles.sectionTitle}>User who can edit</Typography>
      {<UserItems />}
      <div className={styles.separator} />
      <Typography className={[styles.sectionTitle, styles.marginTop].join(" ")}>
        Add Contributor
      </Typography>
      {isAdmin ? (
        <Search
          ref={inputRef}
          className={styles.searchBar}
          disabled={!isAdmin}
          autoFocus
          type={"text"}
          value={searchText}
          onChange={handleSearchChange}
        />
      ) : (
        <InfoNoEditAccess />
      )}
      <div className={styles.userList}>
        {loadingUsers ? <LinearProgress /> : <SearchedUserItems />}
      </div>
    </div>
  );
};
