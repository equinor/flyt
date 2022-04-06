import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { Button, Icon } from "@equinor/eds-core-react";
import MDEditor, { commands } from "@uiw/react-md-editor";
import React, { useState } from "react";
import { check } from "@equinor/eds-icons";
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
      <label htmlFor="mdEditor" style={{ marginLeft: "8px" }}>
        <Typography
          color={canEdit ? "#6F6F6F" : "rgba(190,190,190,1)"}
          group="input"
          variant="label"
        >
          {label}
        </Typography>
      </label>
      <div style={{ display: "flex", gap: 12 }}>
        <div onClick={() => canEdit && setEditMode(true)} style={{ flex: 1 }}>
          <MDEditor
            id="mdEditor"
            value={value}
            onChange={(value?: string) => {
              onChange(value);
              setValue(value);
            }}
            preview={editMode ? "edit" : "preview"}
            extraCommands={[]}
            commands={[commands.link]}
            hideToolbar={!editMode}
            previewOptions={{
              rehypePlugins: [[rehypeSanitize]],
              style: {
                fontSize: "14px",
                padding: "6px 8px",
                cursor: canEdit && "cell",
                backgroundColor: canEdit ? "rgba(247,247,247,1" : "white",
              },
              linkTarget: "_blank",
            }}
            textareaProps={{
              onFocus: (e) => {
                e.target.setSelectionRange(
                  e.target.value.length,
                  e.target.value.length
                );
              },
            }}
            style={{
              border: editMode ? "2px solid #007079" : "1px solid #ECECEC",
              borderRadius: 0,
              boxShadow: canEdit && !editMode ? "0 1px 0 0 gray" : "none",
            }}
            autoFocus
          />
        </div>
        {editMode && (
          <Button
            onClick={() => setEditMode(false)}
            style={{
              minWidth: 48,
            }}
            variant="ghost_icon"
          >
            <Icon data={check} color="#007079" />
          </Button>
        )}
      </div>
    </div>
  );
}
