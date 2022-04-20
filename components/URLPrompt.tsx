import {
  Button,
  Icon,
  Input,
  Label,
  Typography,
} from "@equinor/eds-core-react";
import { error_filled } from "@equinor/eds-icons";
import React, { Dispatch, SetStateAction, useState } from "react";
import { isValidUrl } from "utils/isValidUrl";
import { transformLink } from "utils/transformLink";

function URLPrompt(props: {
  onConfirm: (url: string) => void;
  linkText: string;
  setIsOpenUrlPrompt: Dispatch<SetStateAction<boolean>>;
  url: string;
  setUrl: Dispatch<SetStateAction<string>>;
}) {
  const { onConfirm, linkText, setIsOpenUrlPrompt, url, setUrl } = props;

  const getColor = (url: string) => {
    if (url.length === 0) return "default";
    return isValidUrl(url) ? "success" : "error";
  };

  return (
    <>
      <Label htmlFor="url-input" label="Link" style={{ marginTop: 24 }} />
      <Input
        id="url-input"
        name="url"
        autoFocus={!!linkText}
        placeholder="equinor.com"
        type="text"
        value={url}
        variant={getColor(url)}
        onChange={(e) => setUrl(e.target.value)}
        autoComplete="off"
      />
      {getColor(url) === "error" && (
        <div style={{ display: "flex", alignItems: "center", marginTop: 8 }}>
          <Icon
            data={error_filled}
            size={16}
            title="Invalid link"
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
        <Button variant="outlined" onClick={() => setIsOpenUrlPrompt(false)}>
          Cancel
        </Button>
        <Button
          onClick={() => onConfirm(transformLink(url))}
          disabled={!isValidUrl(url)}
        >
          Ok
        </Button>
      </div>
    </>
  );
}

export default URLPrompt;
