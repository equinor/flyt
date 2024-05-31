import { TextField } from "@equinor/eds-core-react";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import {
  Button,
  Icon,
  Input,
  Label,
  Typography,
} from "@equinor/eds-core-react";
import { error_filled } from "@equinor/eds-icons";
import { isValidUrl } from "utils/isValidUrl";
import styles from "../layouts/default.layout.module.scss";
import { SelectionInfo } from "types/SelectionInfo";
import { transformLink } from "utils/transformLink";

const getInputVariant = (url: string) => {
  if (url.length === 0) return undefined;
  return isValidUrl(url) ? "success" : "error";
};

export function URLPrompt(props: {
  selectionInfo: SelectionInfo;
  setIsOpenUrlPrompt: Dispatch<SetStateAction<boolean>>;
  setSelectionInfo: Dispatch<SetStateAction<SelectionInfo>>;
  setAndPatchText: (text: string) => void;
  text: string;
}) {
  const {
    selectionInfo,
    setAndPatchText,
    setIsOpenUrlPrompt,
    setSelectionInfo,
    text,
  } = props;

  const [url, setUrl] = useState("");

  const closeUrlPrompt = () => {
    setSelectionInfo({ ...selectionInfo, linkText: "" });
    setUrl("");
    setIsOpenUrlPrompt(false);
  };

  const onConfirmURLPrompt = (url: string) => {
    const { start, end, linkText } = selectionInfo;
    const before = text.substring(0, start);
    const transformedLink = transformLink(url);
    const after = text.substring(end);
    const modifiedText = `${before}[${linkText}](${transformedLink})${after}`;
    setAndPatchText(modifiedText);
    closeUrlPrompt();
  };

  return (
    <div
      className={styles.scrimWrapper}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          // Prevent adding a new line when confirming URL Prompt
          e.preventDefault();
          onConfirmURLPrompt(url);
        } else if (e.key === "Escape") {
          closeUrlPrompt();
        }
      }}
      style={{
        overflow: "hidden",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 1000,
        display: "block",
        boxSizing: "border-box",
        width: "100%",
        height: "100%",
      }}
    >
      <div className={styles.scrimHeaderWrapper} style={{ marginBottom: 16 }}>
        <div className={styles.scrimTitle}>Add link</div>
      </div>
      <TextField
        autoFocus={!selectionInfo.linkText}
        label={"Text"}
        defaultValue={selectionInfo.linkText}
        onChange={(e: FormEvent<HTMLInputElement>) =>
          setSelectionInfo({
            ...selectionInfo,
            linkText: e.currentTarget.value,
          })
        }
        id={"linkText"}
        autoComplete="off"
      />
      <div className={styles.scrimContent}>
        <Label htmlFor="url-input" label="Link" style={{ marginTop: 24 }} />
        <Input
          id="url-input"
          name="url"
          autoFocus={!!selectionInfo.linkText}
          type="text"
          value={url}
          variant={getInputVariant(url)}
          onChange={(e) => setUrl(e.target.value)}
          autoComplete="off"
        />
        {getInputVariant(url) === "error" && (
          <div style={{ display: "flex", alignItems: "center", marginTop: 8 }}>
            <Icon
              data={error_filled}
              title="Invalid link"
              size={16}
              color="rgb(179, 13, 47)"
            />
            <Typography
              variant="helper"
              group="input"
              color="rgb(179, 13, 47)"
              style={{ marginLeft: 8 }}
            >
              Invalid link
            </Typography>
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            marginTop: 30,
          }}
        >
          <Button variant="outlined" onClick={closeUrlPrompt}>
            Cancel
          </Button>
          <Button
            onClick={() => onConfirmURLPrompt(url)}
            disabled={!isValidUrl(url)}
          >
            Ok
          </Button>
        </div>
      </div>
    </div>
  );
}
