import { Button, Dialog, Icon } from "@equinor/eds-core-react";
import { help_outline, close } from "@equinor/eds-icons";
import addNewMainActivity from "../../../public/CanvasTutorial/add-new-main-activity.gif";
import addNewSubActivity from "../../../public/CanvasTutorial/add-new-sub-activity.gif";
import addNewChoice from "../../../public/CanvasTutorial/add-new-choice.gif";
import addNewWait from "../../../public/CanvasTutorial/add-new-wait.gif";
import mergeActivities from "../../../public/CanvasTutorial/merge-activities.gif";
import renameEdge from "../../../public/CanvasTutorial/rename-edge.gif";
import deleteEdge from "../../../public/CanvasTutorial/delete-edge.gif";
import copyPaste from "../../../public/CanvasTutorial/copy-paste.gif";
import linkProcesses from "../../../public/CanvasTutorial/link-processes.gif";
import mainActivity from "../../../public/CanvasTutorial/main-activity.svg";
import subActivity from "../../../public/CanvasTutorial/sub-activity.svg";
import choice from "../../../public/CanvasTutorial/choice.svg";
import wait from "../../../public/CanvasTutorial/wait.svg";
import merge from "../../../public/CanvasTutorial/merge.svg";
import styles from "./CanvasTutorial.module.scss";
import { CanvasTutorialButtonGroup } from "./CanvasTutorialButtonGroup";
import { CanvasTutorialSection } from "./CanvasTutorialSection";
import { InlineImage } from "./InlineImage";
import { useCanvasTutorial } from "./hooks/useCanvasTutorial";
import { ButtonWrapper } from "@/components/ButtonWrapper";
import { getModifierKey } from "@/utils/getModifierKey";

const title = "Tutorial";

export const CanvasTutorial = () => {
  const { handleClose, handleInitialOpen, isOpen, onSectionButtonClick, refs } =
    useCanvasTutorial();
  const modifierKey = getModifierKey();

  return (
    <>
      <ButtonWrapper
        icon={help_outline}
        title={"Tutorial"}
        onClick={handleInitialOpen}
        aria-haspopup="dialog"
      />

      <Dialog
        open={isOpen}
        onClose={handleClose}
        className={styles.dialog}
        isDismissable
      >
        <Dialog.Title className={styles.dialogTitle}>
          {title}
          <Button
            variant="ghost_icon"
            aria-label="close action"
            onClick={handleClose}
          >
            <Icon data={close} />
          </Button>
        </Dialog.Title>
        <Dialog.CustomContent className={styles.customContent}>
          <CanvasTutorialButtonGroup
            onSectionButtonClick={onSectionButtonClick}
          />
          <div className={styles.sections}>
            <CanvasTutorialSection
              containerRef={refs["add-new-main-activity"]}
              title="Add new Main Activity"
              image={addNewMainActivity}
            >
              Hover over a main activity or green card, then click the blue
              square <InlineImage src={mainActivity} /> on the desired side to
              add a new main activity.
            </CanvasTutorialSection>
            <CanvasTutorialSection
              containerRef={refs["add-new-sub-activity"]}
              title="Add new Sub Activity"
              image={addNewSubActivity}
            >
              Hover over any main activity, sub activity, wait, or choice on
              your canvas. Below, you&apos;ll see three dotted squares. Click
              the left yellow square <InlineImage src={subActivity} /> to add a
              new sub activity.
            </CanvasTutorialSection>
            <CanvasTutorialSection
              containerRef={refs["add-new-wait"]}
              title="Add new Wait"
              image={addNewWait}
            >
              Hover over a main activity, sub activity, wait, or choice. Below,
              you&apos;ll see three squares. Click the right orange square{" "}
              <InlineImage src={wait} /> to add a new wait.
            </CanvasTutorialSection>
            <CanvasTutorialSection
              containerRef={refs["add-new-choice"]}
              title="Add new Choice"
              image={addNewChoice}
            >
              Hover over a main activity, sub activity, wait, or choice on your
              canvas. Below, click the central yellow diamond{" "}
              <InlineImage src={choice} /> to add a new choice.
            </CanvasTutorialSection>
            <CanvasTutorialSection
              containerRef={refs["merge-activities"]}
              title="Merge activities"
              image={mergeActivities}
            >
              Hover over the merge circle of a card at the end of a choice path.{" "}
              <InlineImage src={merge} /> Drag and drop it onto the card you
              wish to merge into.
            </CanvasTutorialSection>
            <CanvasTutorialSection
              containerRef={refs["rename-edge"]}
              title="Write on lines"
              image={renameEdge}
            >
              Hover over a editable line. Look for the pencil icon to appear.
              Click the edit button to start writing. Once you have finished,
              click outside the text area to save your changes. Editable lines
              can be found directly below a choice card.
            </CanvasTutorialSection>
            <CanvasTutorialSection
              containerRef={refs["delete-edge"]}
              title="Remove lines"
              image={deleteEdge}
            >
              Hover over a removable line. Click the remove button to remove the
              line. Removeable lines are only found above a subactivity that has
              multiple parent connections.
            </CanvasTutorialSection>
            <CanvasTutorialSection
              containerRef={refs["copy-paste"]}
              title="Copy and paste"
              image={copyPaste}
            >
              Hover over a card. Right click to open the context menu. Press the
              &quot;Copy&quot; button to copy the card. Hover over the card you
              want to add the copied card below. Right click and press the
              &quot;Paste&quot; button.
              <br />
              <br /> Tip: You can also press {modifierKey}+C while hovering a
              card to copy it and {modifierKey}+V while hovering a card to paste
              a copied card below it.
            </CanvasTutorialSection>
            <CanvasTutorialSection
              containerRef={refs["link-processes"]}
              title="Link processes"
              image={linkProcesses}
              style={{ marginBottom: "32px" }}
            >
              Navigate to the Link Processes page and click &quot;Connect
              Process&quot;. Select a card; main activity, sub activity, waiting
              or choice to connect a sub-process. Input or output cards can also
              be selected to chain the process. Select the process you want to
              connect/chain, and click &quot;Confirm&quot; to finalize.
            </CanvasTutorialSection>
          </div>
        </Dialog.CustomContent>
      </Dialog>
    </>
  );
};
