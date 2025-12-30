import { Button, Switch } from "@equinor/eds-core-react";
import useLocalStorage from "../hooks/useLocalStorage";
import { BackButton } from "@/components/BackButton";

export default function SettingsPage(): JSX.Element {
  const [showDragHelper, setShowDragHelper] = useLocalStorage(
    "showDragHelper",
    true
  );
  const [showCategoryClickHelper, setShowCategoryClickHelper] = useLocalStorage(
    "showCategoryClickHelper",
    true
  );

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div>
        <BackButton />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: 24,
          maxWidth: 500,
        }}
      >
        <h2>Helper dialogs</h2>
        <Switch
          label="Show category drag helper"
          checked={showDragHelper}
          onChange={() => setShowDragHelper(!showDragHelper)}
          size={"small"}
        />
        <Switch
          label="Show category click helper"
          checked={showCategoryClickHelper}
          onChange={() => setShowCategoryClickHelper(!showCategoryClickHelper)}
          size={"small"}
        />
        <Button
          onClick={() => {
            setShowDragHelper(true);
            setShowCategoryClickHelper(true);
          }}
        >
          Restore all helper dialogs
        </Button>
      </div>
    </div>
  );
}
