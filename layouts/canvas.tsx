import {
  Button,
  Icon,
  Menu,
  Scrim,
  TextField,
  TopBar,
  Typography,
} from "@equinor/eds-core-react";
import {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { chevron_down, close, share } from "@equinor/eds-icons";
import {
  faveProject,
  getProject,
  unfaveProject,
  updateProject,
  deleteProject,
} from "@/services/projectApi";
import { useAccount, useIsAuthenticated, useMsal } from "@azure/msal-react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useStoreDispatch, useStoreState } from "@/hooks/storeHooks";

import { AccessBox } from "@/components/AccessBox";
import Head from "next/head";
import { Heart } from "components/Heart";
import { HomeButton } from "./homeButton";
import { MySnackBar } from "@/components/MySnackBar";
import { RightTopBarSection } from "@/components/RightTopBarSection";
import { TooltipImproved } from "@/components/TooltipImproved";
import { UserMenu } from "@/components/AppHeader/UserMenu";
import { debounce } from "@/utils/debounce";
import { disableKeyboardZoomShortcuts } from "@/utils/disableKeyboardZoomShortcuts";
import { disableMouseWheelZoom } from "@/utils/disableMouseWheelZoom";
import { getMyAccess } from "@/utils/getMyAccess";
import { getOwner } from "utils/getOwner";
import { notifyOthers } from "@/services/notifyOthers";
import packageJson from "../package.json";
import styles from "./default.layout.module.scss";
import { unknownErrorToString } from "@/utils/isError";
import { useRouter } from "next/router";
import { useProjectId } from "@/hooks/useProjectId";

export const CanvasLayout = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useIsAuthenticated();
  const { projectId } = useProjectId();

  const router = useRouter();
  const { data: project } = useQuery(["project", projectId], () =>
    getProject(projectId)
  );
  const projectTitle = project?.name;

  const queryClient = useQueryClient();
  const projectMutation = useMutation(
    (updatedProject: [{ op: string; path: string; value: string }]) => {
      return updateProject(projectId, updatedProject);
    },
    {
      onSuccess: () => {
        void notifyOthers("Gave the process a new name", projectId, account);
        return queryClient.invalidateQueries();
      },
      onError: (e) => dispatch.setSnackMessage(unknownErrorToString(e)),
    }
  );

  const [isMutatingFavourite, setIsMutatingFavourite] = useState(false);
  const handleSettled = () => {
    queryClient.invalidateQueries().then(() => setIsMutatingFavourite(false));
  };

  const faveMutation = useMutation(
    () => {
      setIsMutatingFavourite(true);
      return faveProject(project?.vsmProjectID);
    },
    {
      onSettled: handleSettled,
    }
  );

  const unfaveMutation = useMutation(
    () => {
      setIsMutatingFavourite(true);
      return unfaveProject(project?.vsmProjectID);
    },
    {
      onSettled: handleSettled,
    }
  );

  const dispatch = useStoreDispatch();

  const snackMessage = useStoreState((state) => state.snackMessage);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const myAccess = getMyAccess(project ?? null, account);
  const userCanEdit = myAccess !== "Reader";
  const userCannotEdit = !userCanEdit;
  const isAdmin = myAccess === "Admin" || myAccess === "Owner";

  const [visibleShareScrim, setVisibleShareScrim] = useState(false);
  const [visibleRenameScrim, setVisibleRenameScrim] = useState(false);
  const [visibleDeleteScrim, setVisibleDeleteScrim] = useState(false);

  const [state, setState] = useState<{
    buttonEl: HTMLButtonElement | null;
    focus: "first" | "last";
  }>({
    focus: "first",
    buttonEl: null,
  });

  const { buttonEl, focus } = state;
  const isOpen = Boolean(buttonEl);

  const openMenu = (
    e: KeyboardEvent<HTMLButtonElement> | MouseEvent<HTMLButtonElement>,
    focus: "first" | "last"
  ) => {
    const target = e.target as HTMLButtonElement;
    setState({ ...state, buttonEl: target, focus });
  };

  const closeMenu = () => {
    setState({ ...state, buttonEl, focus });
  };

  const onKeyPress = (e: KeyboardEvent<HTMLButtonElement>) => {
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
    if (project?.vsmProjectID)
      deleteProject(project?.vsmProjectID)
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
        projectMutation.mutate([
          {
            op: "replace",
            path: "/Name",
            value: name,
          },
        ]);
      },
      1000,
      "updateProjectName"
    );
  }

  function handleDuplicate() {
    if (!project) return;
    if (project && project.currentProcessId) {
      void router.push(`/process/${project.currentProcessId}/duplicate`);
    } else {
      void router.push(`/process/${project.vsmProjectID}/duplicate`);
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
              <Typography variant={"h4"} className={styles.projectName}>
                {projectTitle || "Untitled process"}
              </Typography>
              <Button
                variant={"ghost"}
                onClick={(e) => (isOpen ? closeMenu() : openMenu(e, "last"))}
                onKeyDown={onKeyPress}
                id="menuButton"
                aria-controls="menu-on-button"
                aria-haspopup="true"
                aria-expanded={isOpen}
              >
                <Icon data={chevron_down} title="chevron-down" size={16} />
              </Button>
              <Heart
                isFavourite={!!project?.isFavorite}
                fave={() => faveMutation.mutate()}
                unfave={() => unfaveMutation.mutate()}
                isLoading={isMutatingFavourite}
              />
            </div>
            <Menu
              id="menu-on-button"
              aria-labelledby="menuButton"
              open={isOpen}
              anchorEl={buttonEl}
              onClose={closeMenu}
            >
              <Menu.Item
                title={`${
                  userCannotEdit
                    ? "Only the creator, admin or a contributor can rename this process"
                    : "Rename the current process"
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
                title={`${
                  isAdmin
                    ? "Delete the current process"
                    : "Only the creator can delete this process"
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
              {project && (
                <Menu.Item disabled>
                  <Typography group="navigation" variant="menu_title" as="span">
                    Owner: {getOwner(project)}
                  </Typography>
                </Menu.Item>
              )}
            </Menu>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <TooltipImproved title={"Share"}>
            <Button
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

      {project && (
        <Scrim
          open={visibleShareScrim}
          onClose={() => setVisibleShareScrim(false)}
          onWheel={(e) => e.stopPropagation()}
          isDismissable
        >
          <AccessBox
            project={project}
            handleClose={() => setVisibleShareScrim(false)}
            isAdmin={isAdmin}
          />
        </Scrim>
      )}

      <Scrim
        open={visibleRenameScrim}
        onClose={() => setVisibleRenameScrim(false)}
        onWheel={(e) => e.stopPropagation()}
        isDismissable
      >
        <div className={styles.scrimWrapper}>
          <div className={styles.scrimHeaderWrapper}>
            <div className={styles.scrimTitle}>Rename process</div>
            <Button
              variant={"ghost_icon"}
              onClick={() => setVisibleRenameScrim(false)}
            >
              <Icon data={close} title="Close" />
            </Button>
          </div>
          <div className={styles.scrimContent}>
            <TextField
              autoFocus
              label={"Add title"}
              defaultValue={project?.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                updateProjectName(e.target.value)
              }
              id={"vsmObjectDescription"}
            />
          </div>
        </div>
      </Scrim>

      <Scrim
        open={visibleDeleteScrim}
        onClose={() => setVisibleDeleteScrim(false)}
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
                  Are you sure you want to delete this process? By doing so you
                  will delete all versions of Current and To-be processes,
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
                  autoFocus
                  variant={"outlined"}
                  onClick={() => setVisibleDeleteScrim(false)}
                >
                  Cancel
                </Button>
                <Button
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

      {snackMessage && (
        <MySnackBar
          autoHideDuration={3000}
          onClose={() => dispatch.setSnackMessage("")}
        >
          {`${snackMessage}`}
        </MySnackBar>
      )}
    </div>
  );
};
