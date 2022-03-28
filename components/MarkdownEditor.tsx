import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

import { Button, Icon } from "@equinor/eds-core-react";
import MDEditor, { commands } from "@uiw/react-md-editor";
import React, { useState } from "react";
import { edit, check } from "@equinor/eds-icons";

import { Typography } from "@equinor/eds-core-react";
import rehypeSanitize from "rehype-sanitize";

type PreviewType = "live" | "preview";

export default function MarkdownEditor(props: {
  canEdit: boolean;
  defaultValue: string;
  id: string;
  label?: string;
  onChange?: (value?: string) => void;
}) {
  const { canEdit, defaultValue, id, label = "", onChange } = props;
  const [value, setValue] = useState(defaultValue);
  const [preview, setPreview] = useState<PreviewType>("preview");
  const disabled = preview === "preview" ? true : false;

  const editIcon = (
    <Icon data={preview === "preview" ? edit : check} color="#007079" />
  );

  return (
    <div id={id}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <label htmlFor="mdEditor" style={{ marginLeft: "8px" }}>
          <Typography
            color={canEdit ? "#6F6F6F" : "rgba(190,190,190,1)"}
            group="input"
            variant="label"
          >
            {label}
          </Typography>
        </label>
        {canEdit && (
          <Button
            onClick={() => {
              setPreview(disabled ? "live" : "preview");
            }}
            style={{
              position: "relative",
              right: "0px",
              top: disabled ? "48px" : "78px",
              zIndex: 1,
            }}
            variant="ghost_icon"
          >
            {editIcon}
          </Button>
        )}
      </div>
      <MDEditor
        id="mdEditor"
        value={value}
        onChange={(value?: string) => {
          onChange(value);
          setValue(value);
        }}
        preview={preview}
        extraCommands={[]}
        commands={[commands.link]}
        hideToolbar={preview === "preview"}
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]],
          style: {
            backgroundColor: "rgba(255,255,255,1)",
            border: "1px solid #ECECEC",
            fontSize: "14px",
            padding: "6px 48px 6px 8px",
          },
          linkTarget: "_blank",
        }}
        textareaProps={{ style: { borderColor: "green" } }}
        style={{
          borderBottomColor: "#6E6E6E",
          borderBottomStyle: "solid",
          borderBottomWidth: disabled ? 0 : "1px",
          borderRadius: 0,
          boxShadow: "none",
        }}
      />
    </div>
  );
}
