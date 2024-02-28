import { KeyboardEvent, useState } from "react";
import styles from "./UserMenu.module.scss";
import { Button, Menu } from "@equinor/eds-core-react";
import { useAccount, useMsal } from "@azure/msal-react";
import { UserDot } from "../UserDot";
import { getUserShortName } from "../../utils/getUserShortName";
import packageJson from "../../package.json";
import Link from "next/link";
import getConfig from "next/config";

export const UserMenu = () => {
  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const { publicRuntimeConfig } = getConfig();
  const commitHash = publicRuntimeConfig.RADIX_GIT_COMMIT_HASH;

  const [buttonEl, setButtonEl] = useState<HTMLButtonElement | null>(null);

  const isOpen = Boolean(buttonEl);

  const openMenu = (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLButtonElement>
  ) => {
    const target = e.target as HTMLButtonElement;
    setButtonEl(target);
  };

  const closeMenu = () => setButtonEl(null);

  const onKeyPress = (e: KeyboardEvent<HTMLButtonElement>) => {
    const { key } = e;
    switch (key) {
      case "ArrowDown":
      case "ArrowUp":
        isOpen ? closeMenu() : openMenu(e);
        break;
      case "Escape":
        closeMenu();
        break;
    }
  };

  return (
    <>
      <Button
        variant="ghost_icon"
        id="menuButton"
        aria-controls="menu-on-button"
        aria-haspopup="true"
        aria-expanded={!!buttonEl}
        onClick={(e) => (isOpen ? closeMenu() : openMenu(e))}
        onKeyDown={onKeyPress}
      >
        <UserDot name={getUserShortName(account)} />
      </Button>
      <Menu
        id="menu-on-button"
        aria-labelledby="menuButton"
        open={!!buttonEl}
        anchorEl={buttonEl}
        onClose={closeMenu}
      >
        <Menu.Item disabled>{account?.username}</Menu.Item>
        <Link href={"/changelog"}>
          <Menu.Item className={styles.menuItem}>
            Version {packageJson.version}
          </Menu.Item>
        </Link>
        {!!commitHash ? (
          <Link href={`https://github.com/equinor/flyt/commits/${commitHash}`}>
            <Menu.Item className={styles.menuItem}>
              Commit {commitHash.slice(0, 7)}
            </Menu.Item>
          </Link>
        ) : (
          <Menu.Item disabled>Commit not available</Menu.Item>
        )}
        <Link href={"/settings"}>
          <Menu.Item className={styles.menuItem}>Settings</Menu.Item>
        </Link>
        <Menu.Item onClick={() => instance.logout()}>Logout</Menu.Item>
      </Menu>
    </>
  );
};
