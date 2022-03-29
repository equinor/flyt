import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { Button, Icon } from "@equinor/eds-core-react";
import MDEditor, { commands } from "@uiw/react-md-editor";
import React, { useState } from "react";
import { check, edit } from "@equinor/eds-icons";
import { Typography } from "@equinor/eds-core-react";
import rehypeSanitize from "rehype-sanitize";

export default function MarkdownEditor(props: {
  canEdit: boolean;
  defaultValue: string;
  id: string;
  label?: string;
  onChange?: (value?: string) => void;
}) {
  const { canEdit, defaultValue, id, label = "", onChange } = props;
  const [editMode, setEditMode] = useState(false);
  const [value, setValue] = useState(defaultValue);

  return (
    <div id={id} data-color-mode="light">
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
              setEditMode(!editMode);
            }}
            style={{
              position: "relative",
              right: "0px",
              top: editMode ? "78px" : "48px",
              zIndex: 1,
            }}
            variant="ghost_icon"
          >
            <Icon data={editMode ? check : edit} color="#007079" />
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
        preview={editMode ? "live" : "preview"}
        extraCommands={[]}
        commands={[commands.link]}
        hideToolbar={!editMode}
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]],
          style: {
            fontSize: "14px",
            padding: "6px 48px 6px 8px",
          },
          linkTarget: "_blank",
        }}
        style={{
          border: "1px solid #ECECEC",
          borderBottomColor: editMode ? "#6E6E6E" : "#ECECEC",
          borderRadius: 0,
          boxShadow: "none",
        }}
      />
    </div>
  );
}
