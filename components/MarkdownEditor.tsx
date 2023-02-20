import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

import { Button, Icon, Label, Tooltip } from "@equinor/eds-core-react";
import MDEditor, { ICommand, TextState } from "@uiw/react-md-editor";
import React, { useEffect, useState } from "react";

import { SelectionInfo } from "interfaces/SelectionInfo";
import UrlPrompt from "./URLPrompt";
import { check, link } from "@equinor/eds-icons";
import rehypeSanitize from "rehype-sanitize";

export default function MarkdownEditor(props: {
  canEdit?: boolean;
  defaultText: string;
  label: string;
  onChange?: (value?: string) => void;
}) {
  const { canEdit, defaultText, label, onChange } = props;
  const [editMode, setEditMode] = useState(false);
  const [isOpenUrlPrompt, setIsOpenUrlPrompt] = useState(false);
  const [selectionInfo, setSelectionInfo] = useState<SelectionInfo>({
    start: 0,
    end: 0,
    linkText: "",
  });
  // The "text"-state is used for displaying the changing text instantly
  const [text, setText] = useState(defaultText);
  Icon.add({ link });

  useEffect(() => {
    // Open UrlPrompt on ctrl + k
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editMode && (e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault(); // prevent ctrl + k from opening the browser's address bar
        const textArea = window.getSelection().anchorNode
          .lastChild as HTMLTextAreaElement;

        openUrlPrompt({
          start: textArea.selectionStart,
          end: textArea.selectionEnd,
          linkText: textArea.value.substring(
            textArea.selectionStart,
            textArea.selectionEnd
          ),
        });
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [editMode]);

  const openUrlPrompt = (selection: SelectionInfo) => {
    setSelectionInfo({
      start: selection.start,
      end: selection.end,
      linkText: selection.linkText,
    });
    setIsOpenUrlPrompt(true);
  };

  // Sets local state to display text instantly and updates the API
  const setAndPatchText = (text: string) => {
    // Patching the text via the API is debounced in the onChange
    onChange(text);
    setText(text);
  };

  // Custom link-command for the MDEditor toolbar
  const markdownLink: ICommand = {
    name: "link",
    keyCommand: "link",
    buttonProps: { "aria-label": "Add link" },
    icon: (
      <Tooltip title="Add link" placement="top">
        <Icon data={link} size={16} />
      </Tooltip>
    ),
    execute: (state: TextState) => {
      openUrlPrompt({
        start: state.selection.start,
        end: state.selection.end,
        linkText: state.selectedText,
      });
    },
  };

  if (isOpenUrlPrompt) {
    return (
      <UrlPrompt
        selectionInfo={selectionInfo}
        setIsOpenUrlPrompt={setIsOpenUrlPrompt}
        setSelectionInfo={setSelectionInfo}
        setAndPatchText={setAndPatchText}
        text={text}
      />
    );
  }

  return (
    // data-color-mode property is for MDEditor color theme
    <div data-color-mode="light">
      <Label htmlFor="mdEditor" label={label} />
      <div style={{ display: "flex", gap: 12 }}>
        <div onClick={() => canEdit && setEditMode(true)} style={{ flex: 1 }}>
          {/* Override MDEditor default styles */}
          <style global jsx>{`
            #mdEditor > div.w-md-editor-content > div > div {
              font-size: 1rem;
              background-color: rgb(247, 247, 247);
              color: #3d3d3d;
            }
          `}</style>
          <MDEditor
            id="mdEditor"
            value={text}
            onChange={setAndPatchText}
            preview={editMode ? "edit" : "preview"}
            extraCommands={[]}
            commands={[markdownLink]}
            hideToolbar={!editMode}
            previewOptions={{
              rehypePlugins: [[rehypeSanitize]],
              style: {
                backgroundColor: canEdit ? "rgba(247,247,247,1" : "white",
                color: "rgba(61,61,61,1)",
                cursor: canEdit && "cell",
                fontSize: "1rem",
                fontWeight: 400,
                lineHeight: 1.5,
                padding: "6px 8px",
              },
              linkTarget: "_blank",
            }}
            textareaProps={{
              // Set cursor at the end of text when focusing on the textarea
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
