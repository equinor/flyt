import {
  Button,
  Icon,
  Menu,
  Scrim,
  TextField,
  TopBar,
  Typography,
  DotProgress,
  Card,
  Dialog,
} from "@equinor/eds-core-react";
import {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  useEffect,
  useState,
} from "react";
import {
  chevron_down,
  close,
  download,
  share,
  style,
  tag,
} from "@equinor/eds-icons";
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

import { AccessBox, AddUserAccessSection } from "@/components/AccessBox";
import Head from "next/head";
import { Heart } from "components/Heart";
import { HomeButton } from "./homeButton";
import { MySnackBar } from "@/components/MySnackBar";
import { RightTopBarSection } from "@/components/RightTopBarSection";
import { TooltipImproved } from "@/components/TooltipImproved";
import { UserMenu } from "@/components/AppHeader/UserMenu";
import { disableKeyboardZoomShortcuts } from "@/utils/disableKeyboardZoomShortcuts";
import { disableMouseWheelZoom } from "@/utils/disableMouseWheelZoom";
import { getMyAccess } from "@/utils/getMyAccess";
import { notifyOthers } from "@/services/notifyOthers";
import packageJson from "../package.json";
import styles from "./default.layout.module.scss";
import { unknownErrorToString } from "@/utils/isError";
import { useRouter } from "next/router";
import { useProjectId } from "@/hooks/useProjectId";
import { EditableTitle } from "components/EditableTitle";
import { getProjectName } from "@/utils/getProjectName";
import { accessRoles } from "@/types/AccessRoles";
import { downloadCanvasAsPNG } from "@/utils/downloadCanvas";
import { Project } from "@/types/Project";
import {
  ManageLabelBox,
  AddLabelsSection,
} from "@/components/Labels/ManageLabelBox";

type MandatoryInfoStage = "addName" | "giveAccesses" | "addLabels";

type AddNameStageProps = {
  onNameChange: (name: string) => void;
  onNext: () => void;
  onRequestDiscard: () => void;
  isNextDisabled: boolean;
};

function AddNameStage({
  onNameChange,
  onNext,
  onRequestDiscard,
  isNextDisabled,
}: AddNameStageProps) {
  return (
    <Card
      elevation="overlay"
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        minWidth: "400px",
        width: "50vw",
        gap: 32,
        padding: 0,
        borderRadius: 4,
      }}
    >
      <Card.Header
        style={{
          padding: 0,
          borderBottom: "1px solid #DCDCDC",
        }}
      >
        <Card.HeaderTitle style={{ padding: "24px 40px" }}>
          <Typography variant="h2">Give your process a name</Typography>
        </Card.HeaderTitle>
      </Card.Header>
      <Card.Content
        style={{
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
          padding: 0,
        }}
      >
        <TextField
          autoFocus
          style={{ width: "60%", minWidth: 300, padding: "16px 40px" }}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onNameChange(e.target.value ?? "")
          }
          id="vsmObjectName"
          helperText="You can change the process name later."
          placeholder="Enter process name here"
        />
      </Card.Content>
      <Card.Actions
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #dcdcdc",
          padding: "24px 40px",
        }}
      >
        <Button variant="ghost" onClick={onRequestDiscard}>
          Discard
        </Button>
        <Button onClick={onNext} disabled={isNextDisabled}>
          Next
        </Button>
      </Card.Actions>
    </Card>
  );
}

type GiveAccessStageProps = {
  project: Project;
  processName: string;
  onBack: () => void;
  onNext: () => void;
  onRequestDiscard: () => void;
};

function GiveAccessStage({
  project,
  processName,
  onBack,
  onNext,
  onRequestDiscard,
}: GiveAccessStageProps) {
  return (
    <Card
      elevation="overlay"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "60vw",
        height: "80vh",
        gap: 20,
        padding: 0,
        borderRadius: 4,
      }}
    >
      <Card.Header
        style={{
          padding: 0,
          borderBottom: "1px solid #DCDCDC",
        }}
      >
        <Card.HeaderTitle style={{ padding: "24px 40px" }}>
          <Typography variant="h2">{processName}</Typography>
        </Card.HeaderTitle>
      </Card.Header>
      <Card.Content
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          minHeight: 0,
          overflow: "hidden",
          padding: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            padding: "0 40px",
          }}
        >
          <Typography
            variant="h4"
            style={{ display: "flex", alignItems: "center", gap: 16 }}
          >
            <Icon data={share} size={24} />
            Who needs writing access?
          </Typography>
          <Typography>You can add or remove access later.</Typography>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "0 calc(40px - 16px)",
            overflow: "auto",
            minHeight: 0,
            flexGrow: 1,
          }}
        >
          <AddUserAccessSection project={project} isAdmin={true} />
        </div>
      </Card.Content>
      <Card.Actions
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #dcdcdc",
          padding: "24px 40px",
        }}
      >
        <Button variant="ghost" onClick={onRequestDiscard}>
          Discard
        </Button>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="outlined" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext}>Next</Button>
        </div>
      </Card.Actions>
    </Card>
  );
}

type AddLabelsStageProps = {
  project: Project;
  processName: string;
  onBack: () => void;
  onFinish: () => void;
  onRequestDiscard: () => void;
};

function AddLabelsStage({
  project,
  processName,
  onBack,
  onFinish,
  onRequestDiscard,
}: AddLabelsStageProps) {
  return (
    <Card
      elevation="overlay"
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width: "max(60vw, 400px)",
        height: "80vh",
        gap: 20,
        padding: 0,
        borderRadius: 4,
      }}
    >
      <Card.Header
        style={{
          padding: 0,
          borderBottom: "1px solid #DCDCDC",
        }}
      >
        <Card.HeaderTitle style={{ padding: "24px 40px" }}>
          <Typography variant="h2">{processName}</Typography>
        </Card.HeaderTitle>
      </Card.Header>
      <Card.Content
        style={{
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
          padding: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            padding: "0 40px",
          }}
        >
          <Typography
            variant="h4"
            style={{ display: "flex", alignItems: "center", gap: 16 }}
          >
            <Icon data={tag} size={24} />
            Add labels
          </Typography>
          <div>
            <Typography>
              Add labels to make it easier to find relevant processes.
            </Typography>
            <Typography>Labels can be added or changed later.</Typography>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            overflowY: "auto",
            padding: "16px 40px 0 40px",
          }}
        >
          <AddLabelsSection process={project} withHorizontalCategories />
        </div>
      </Card.Content>
      <Card.Actions
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #dcdcdc",
          padding: "24px 40px",
        }}
      >
        <Button variant="ghost" onClick={onRequestDiscard}>
          Discard
        </Button>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="outlined" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onFinish}>Finish</Button>
        </div>
      </Card.Actions>
    </Card>
  );
}

type MandatoryInfoBoxProps = {
  onDiscard: () => void;
  updateProjectName: (name: string) => Promise<void>;
  project: Project;
};

function MandatoryInfoBox({
  project,
  updateProjectName,
  onDiscard,
}: MandatoryInfoBoxProps) {
  const threshold = new Date();
  threshold.setMinutes(threshold.getMinutes() - 1);

  // is created within the last minute and has default name or no name
  const isNew =
    Date.parse(project.created) > threshold.getTime() &&
    (!project.name?.trim() ||
      project.name.trim().toLowerCase() === "untitled process");

  const [newName, setNewName] = useState<string>();
  const [showInitialRenameScrim, setShowInitialRenameScrim] =
    useState<boolean>(isNew);
  const [mandatoryInfoStage, setMandatoryInfoStage] = useState<
    MandatoryInfoStage | undefined
  >("addName");
  const [showDiscardConfirmation, setShowDiscardConfirmation] = useState(false);

  const moveToPreviousStage = () => {
    switch (mandatoryInfoStage) {
      case "giveAccesses":
        setMandatoryInfoStage("addName");
        break;
      case "addLabels":
        setMandatoryInfoStage("giveAccesses");
        break;
    }
  };

  const moveToNextStage = async () => {
    switch (mandatoryInfoStage) {
      case "addName":
        await updateProjectName(newName ?? "");
        setMandatoryInfoStage("giveAccesses");
        break;
      case "giveAccesses":
        setMandatoryInfoStage("addLabels");
        break;
      case "addLabels":
        setMandatoryInfoStage(undefined);
        setShowInitialRenameScrim(false);
        break;
    }
  };

  return (
    <>
      <Dialog
        open={showDiscardConfirmation}
        style={{
          display: "flex",
          flexDirection: "column",
          minWidth: 300,
          width: "max(50vw, 400px)",
          gap: 32,
        }}
      >
        <Dialog.Header
          style={{
            padding: 0,
            display: "flex",
            alignItems: "center",
            border: "1px solid #dcdcdc",
          }}
        >
          <Dialog.Title style={{ padding: "24px 40px" }}>
            <Typography variant="h2">Discard process?</Typography>
          </Dialog.Title>
        </Dialog.Header>
        <Dialog.CustomContent style={{ padding: "0 40px", minHeight: 0 }}>
          <Typography>
            The process and all entered information will be permanently deleted.
          </Typography>
          <Typography>This action cannot be undone.</Typography>
        </Dialog.CustomContent>
        <Dialog.Actions
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #dcdcdc",
            width: "stretch",
            padding: "16px 40px",
          }}
        >
          <Button onClick={() => setShowDiscardConfirmation(false)}>
            Go Back
          </Button>
          <Button variant="outlined" color="danger" onClick={onDiscard}>
            Discard Process
          </Button>
        </Dialog.Actions>
      </Dialog>
      <Scrim
        open={!showDiscardConfirmation && showInitialRenameScrim}
        onWheel={(e) => e.stopPropagation()}
      >
        {mandatoryInfoStage === "addName" && (
          <AddNameStage
            onNameChange={setNewName}
            onNext={moveToNextStage}
            onRequestDiscard={() => setShowDiscardConfirmation(true)}
            isNextDisabled={
              !newName || newName.toLowerCase() === "untitled process"
            }
          />
        )}
        {mandatoryInfoStage === "giveAccesses" && (
          <GiveAccessStage
            project={project}
            processName={project.name ?? "Untitled Process"}
            onBack={moveToPreviousStage}
            onNext={moveToNextStage}
            onRequestDiscard={() => setShowDiscardConfirmation(true)}
          />
        )}
        {mandatoryInfoStage === "addLabels" && (
          <AddLabelsStage
            project={project}
            processName={project.name ?? "Untitled Process"}
            onBack={moveToPreviousStage}
            onFinish={moveToNextStage}
            onRequestDiscard={() => setShowDiscardConfirmation(true)}
          />
        )}
      </Scrim>
    </>
  );
}

export const CanvasLayout = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useIsAuthenticated();
  const { projectId } = useProjectId();

  const router = useRouter();
  const { data: project } = useQuery(["project", projectId], () =>
    getProject(projectId)
  );

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
      onError: (e: Error | null) =>
        dispatch.setSnackMessage(unknownErrorToString(e)),
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

  const retryDownload = () => {
    downloadCanvasAsPNG(getProjectName(project));
  };

  const dispatch = useStoreDispatch();

  const snackMessage = useStoreState((state) => state.snackMessage);
  const downloadSnackbar = useStoreState((state) => state.downloadSnackbar);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const myAccess = getMyAccess(project ?? null, account);
  const { Contributor, Reader } = accessRoles;
  const userCanEdit = myAccess !== Reader;
  const userCannotEdit = !userCanEdit;
  const isAdmin = myAccess === Contributor;
  const projectName = getProjectName(project);

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
    setState({ ...state, buttonEl: null, focus });
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

  async function updateProjectName(name: string) {
    if (name === project?.name) return;

    try {
      await projectMutation.mutateAsync([
        {
          op: "replace",
          path: "/Name",
          value: name,
        },
      ]);
    } catch (e) {
      console.error("Failed to update project name", e);
    }
  }

  function handleDuplicate() {
    if (!project) return;
    if (project && project.currentProcessId) {
      void router.push(`/process/${project.currentProcessId}/duplicate`);
    } else {
      void router.push(`/process/${project.vsmProjectID}/duplicate`);
    }
  }

  function handleCloseSnackbar() {
    dispatch.setSnackMessage("");
    dispatch.setDownloadSnackbar(false);
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
              {project ? (
                <EditableTitle
                  defaultText={projectName}
                  readOnly={!userCanEdit}
                  onSubmit={updateProjectName}
                />
              ) : (
                <DotProgress size={32} color={"primary"} />
              )}
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
                    ? "Only the Contributor can rename this process"
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
                    : "Only the Contributor can delete this process"
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
            </Menu>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <TooltipImproved title="Download as image">
            <Button
              variant={"ghost_icon"}
              style={{ marginRight: 8 }}
              onClick={() => {
                downloadCanvasAsPNG(getProjectName(project));
              }}
            >
              <Icon data={download} />
            </Button>
          </TooltipImproved>
          <TooltipImproved title={"Share "}>
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

      {project && (
        <MandatoryInfoBox
          project={project}
          onDiscard={deleteVSM}
          updateProjectName={async (newName: string) => {
            newName = newName.trim();
            if (
              !newName ||
              newName === project.name ||
              newName.toLowerCase() === "untitled process"
            )
              return;
            await updateProjectName(newName);
          }}
        />
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
              className={styles.renameInput}
              label={"Add title"}
              defaultValue={project?.name ?? undefined}
              onChange={async (e: ChangeEvent<HTMLInputElement>) =>
                await updateProjectName(e.target.value)
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
            <Typography className={styles.deleteText}>Deleting...</Typography>
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
                  will delete
                  <span className={styles.boldText}> ALL VERSIONS</span> as they
                  will not be recoverable.
                </p>
              </div>
              <div className={styles.buttonContainer}>
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
          onClose={handleCloseSnackbar}
          downloadSnackbar={downloadSnackbar}
          variant={
            downloadSnackbar
              ? snackMessage.startsWith("Oops")
                ? "error"
                : "success"
              : undefined
          }
          onRetry={
            snackMessage.startsWith("Oops") ? () => retryDownload() : undefined
          }
        >
          {`${snackMessage}`}
        </MySnackBar>
      )}
    </div>
  );
};
