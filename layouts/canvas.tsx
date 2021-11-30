import Head from "next/head";
import {
  Button,
  Icon,
  Menu,
  Scrim,
  TextField,
  TopBar,
  Typography,
} from "@equinor/eds-core-react";
import { chevron_down, close, share } from "@equinor/eds-icons";
import styles from "./default.layout.module.scss";
import { useAccount, useIsAuthenticated, useMsal } from "@azure/msal-react";
import React, { useEffect, useState } from "react";
import UserMenu from "../components/AppHeader/UserMenu";
import { useStoreDispatch, useStoreState } from "../hooks/storeHooks";
import { useRouter } from "next/router";
import BaseAPIServices from "../services/BaseAPIServices";
import { HomeButton } from "./homeButton";
import { RightTopBarSection } from "../components/RightTopBarSection";
import { disableMouseWheelZoom } from "../utils/disableMouseWheelZoom";
import { disableKeyboardZoomShortcuts } from "../utils/disableKeyboardZoomShortcuts";
import { MySnackBar } from "../components/MySnackBar";
import { AccessBox } from "../components/AccessBox";
import { getMyAccess } from "../utils/getMyAccess";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getProject, updateProject } from "../services/projectApi";
import { debounce } from "../utils/debounce";
import { unknownErrorToString } from "../utils/isError";
import packageJson from "../package.json";
import { notifyOthers } from "../services/notifyOthers";
import { TooltipImproved } from "../components/TooltipImproved";

const CanvasLayout = ({ children }): JSX.Element => {
  const isAuthenticated = useIsAuthenticated();

  const router = useRouter();
  const { id } = router.query;
  const { data: project } = useQuery(["project", id], () => getProject(id));
  const projectTitle = project?.name;

  const queryClient = useQueryClient();
  const projectMutation = useMutation(
    (updatedProject: { vsmProjectID: number; name: string }) => {
      return updateProject(updatedProject);
    },
    {
      onSuccess: () => {
        notifyOthers("Gave the process a new name", id, account);
        return queryClient.invalidateQueries();
      },
      onError: (e) => dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

  const dispatch = useStoreDispatch();

  const snackMessage = useStoreState((state) => state.snackMessage);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const myAccess = getMyAccess(project, account);
  const userCanEdit = myAccess === "Admin" || myAccess === "Contributor";
  const userCannotEdit = !userCanEdit;
  const isAdmin = myAccess === "Admin";

  const [visibleShareScrim, setVisibleShareScrim] = React.useState(false);
  const handleCloseShareScrim = (event, closed) => {
    if (closed) setVisibleShareScrim(closed);
    else setVisibleShareScrim(!visibleShareScrim);
  };

  const [visibleRenameScrim, setVisibleRenameScrim] = React.useState(false);
  const handleCloseRenameScrim = (event, closed) => {
    if (closed) setVisibleRenameScrim(closed);
    else setVisibleRenameScrim(!visibleRenameScrim);
  };

  const [visibleDeleteScrim, setVisibleDeleteScrim] = React.useState(false);
  const handleCloseDeleteScrim = (event, closed) => {
    if (closed) setVisibleDeleteScrim(closed);
    else setVisibleDeleteScrim(!visibleDeleteScrim);
    setDeleteError(null);
  };

  const [state, setState] = React.useState<{
    buttonEl: HTMLButtonElement;
    focus: "first" | "last";
  }>({
    focus: "first",
    buttonEl: null,
  });

  const { buttonEl, focus } = state;
  const isOpen = Boolean(buttonEl);

  const openMenu = (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLButtonElement>,
    focus: "first" | "last"
  ) => {
    const target = e.target as HTMLButtonElement;
    setState({ ...state, buttonEl: target, focus });
  };

  const closeMenu = () => {
    setState({ ...state, buttonEl: null, focus });
  };

  const onKeyPress = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const { key } = e;
    e.preventDefault();
    switch (key) {
      case "ArrowDown":
      case "Enter":
        isOpen ? closeMenu() : openMenu(e, "first");
        break;
      case "ArrowUp":
        isOpen ? closeMenu() : openMenu(e, "last");
        break;
      case "Escape":
        closeMenu();
        break;
    }
  };

  useEffect(() => {
    disableKeyboardZoomShortcuts();
    disableMouseWheelZoom();
  }, []);

  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>Authentication Required</title>
          <meta charSet="utf-8" />
          {/*link manifest.json*/}
          <link rel="manifest" href="/manifest.json" />
          {/*this sets the color of url bar */}
          <meta name="theme-color" content="#F7F7F7" />
        </Head>

        <TopBar className={styles.topBar}>
          <HomeButton />
          <div className={styles.userCircle}>
            <TopBar.Actions>
              <UserMenu />
            </TopBar.Actions>
          </div>
        </TopBar>

        {children}
      </>
    );
  }

  function deleteVSM() {
    setIsDeleting(true);
    setDeleteError(null);
    BaseAPIServices.delete(`/api/v1.0/project/${project.vsmProjectID}`)
      .then(() => router.push("/"))
      .catch((reason) => {
        setDeleteError(reason);
      })
      .finally(() => {
        setIsDeleting(false);
      });
  }

  function updateProjectName(name: string) {
    debounce(
      () => {
        projectMutation.mutate({
          vsmProjectID: project.vsmProjectID,
          name,
        });
      },
      1000,
      "updateProjectName"
    );
  }

  function handleDuplicate() {
    if (project?.currentProcessId) {
      router.push(`/process/${project.currentProcessId}/duplicate`);
    } else {
      router.push(`/process/${project.vsmProjectID}/duplicate`);
    }
  }

  return (
    <div style={{ overflow: "hidden" /* Hide scrollbars */ }}>
      <Head>
        <title>{packageJson.name}</title>
        <meta charSet="utf-8" />
        {/*link manifest.json*/}
        <link rel="manifest" href="/manifest.json" />
        {/*this sets the color of url bar */}
        <meta name="theme-color" content="#F7F7F7" />
      </Head>

      <TopBar className={styles.topBar}>
        <HomeButton />
        <div className={styles.center}>
          <div style={{ gridAutoFlow: "row" }} className={styles.centerButton}>
            <div className={styles.centerButton}>
              <Typography
                data-test={"processName"}
                variant={"h4"}
                className={styles.projectName}
              >
                {projectTitle || "Untitled process"}
              </Typography>
              <Button
                variant={"ghost"}
                onClick={(e) => (isOpen ? closeMenu() : openMenu(e, null))}
                onKeyDown={onKeyPress}
                data-test="processMenuButton"
                aria-controls="menu-on-button"
                aria-haspopup="true"
                aria-expanded={isOpen}
              >
                <Icon data={chevron_down} title="chevron-down" size={16} />
              </Button>
            </div>
            <Menu
              id="menu-on-button"
              aria-labelledby="menuButton"
              open={isOpen}
              anchorEl={buttonEl}
              onClose={closeMenu}
              focus={focus}
            >
              <Menu.Item
                data-test={`renameButton`}
                title={`${
                  userCannotEdit
                    ? "Only the creator, admin or a contributor can rename this VSM"
                    : "Rename the current VSM"
                }`}
                disabled={userCannotEdit}
                onKeyDown={(e) => {
                  if (e.code === "Enter") setVisibleRenameScrim(true);
                }}
                onClick={() => setVisibleRenameScrim(true)}
              >
                <Typography group="navigation" variant="menu_title" as="span">
                  Rename
                </Typography>
              </Menu.Item>
              <Menu.Item onClick={handleDuplicate}>
                <Typography group="navigation" variant="menu_title" as="span">
                  Duplicate
                </Typography>
              </Menu.Item>
              <Menu.Item
                data-test={"deleteButton"}
                title={`${
                  isAdmin
                    ? "Delete the current VSM"
                    : "Only the creator can delete this VSM"
                }`}
                disabled={!isAdmin}
                onKeyDown={(e) => {
                  if (e.code === "Enter") setVisibleDeleteScrim(true);
                }}
                onClick={() => setVisibleDeleteScrim(true)}
              >
                <Typography group="navigation" variant="menu_title" as="span">
                  Delete process
                </Typography>
              </Menu.Item>
              <Menu.Item disabled>
                <Typography group="navigation" variant="menu_title" as="span">
                  Owner: {project?.created.userIdentity}
                </Typography>
              </Menu.Item>
            </Menu>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          {/*<UserDots users={userAccesses?.map((u) => u.user) || []} />*/}
          <TooltipImproved title={"Share"}>
            <Button
              id={`shareButton`}
              variant={"ghost_icon"}
              style={{ marginRight: 8 }}
              onClick={() => setVisibleShareScrim(true)}
            >
              <Icon data={share} />
            </Button>
          </TooltipImproved>
          <RightTopBarSection isAuthenticated={isAuthenticated} />
        </div>
      </TopBar>

      {children}

      {visibleShareScrim && (
        <Scrim
          onClose={handleCloseShareScrim}
          onWheel={(e) => e.stopPropagation()}
          isDismissable
        >
          <AccessBox
            project={project}
            handleClose={handleCloseShareScrim}
            isAdmin={isAdmin}
          />
        </Scrim>
      )}

      {visibleRenameScrim && (
        <Scrim
          onClose={handleCloseRenameScrim}
          onWheel={(e) => e.stopPropagation()}
          isDismissable
        >
          <div className={styles.scrimWrapper}>
            <div className={styles.scrimHeaderWrapper}>
              <div className={styles.scrimTitle}>Rename process</div>
              <Button
                data-test={`renameButtonClose`}
                variant={"ghost_icon"}
                onClick={() => setVisibleRenameScrim(false)}
              >
                <Icon data={close} title="Close" />
              </Button>
            </div>
            <div className={styles.scrimContent}>
              <TextField
                data-test={"renameInput"}
                id="renameInput"
                autoFocus
                label={"Add title"}
                // multiline
                // rows={3}
                variant={"default"}
                defaultValue={project?.name}
                onChange={(e) => updateProjectName(e.target.value)}
              />
            </div>
          </div>
        </Scrim>
      )}

      {visibleDeleteScrim && (
        <Scrim
          onClose={handleCloseDeleteScrim}
          onWheel={(e) => e.stopPropagation()}
          isDismissable
        >
          <div className={styles.scrimWrapper}>
            {isDeleting ? (
              <Typography>Deleting...</Typography>
            ) : (
              <>
                <div className={styles.scrimHeaderWrapper}>
                  <div className={styles.scrimTitle}>Delete process</div>
                </div>
                <div className={styles.scrimContent}>
                  {deleteError && (
                    <Typography color={"warning"} variant={"h4"}>
                      {`${deleteError}`}
                    </Typography>
                  )}
                  <p>
                    Are you sure you want to delete this process? By doing so
                    you will delete all versions of Current and To-be processes,
                    neither of which will be recoverable.
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 12,
                  }}
                >
                  <Button
                    data-test={"deleteButtonCancel"}
                    autoFocus
                    variant={"outlined"}
                    onClick={(e) => handleCloseDeleteScrim(e, false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    data-test={`deleteButtonApprove`}
                    variant={"contained"}
                    color={"danger"}
                    onClick={() => deleteVSM()}
                  >
                    Delete
                  </Button>
                </div>
              </>
            )}
          </div>
        </Scrim>
      )}

      {snackMessage && (
        <MySnackBar
          autoHideDuration={3000}
          onClose={() => dispatch.setSnackMessage(null)}
        >
          {`${snackMessage}`}
        </MySnackBar>
      )}
    </div>
  );
};

export default CanvasLayout;
