import "@uiw/react-markdown-preview/markdown.css";
import "@uiw/react-md-editor/markdown-editor.css";

import { Icon, Label, Tooltip, Typography } from "@equinor/eds-core-react";
import MDEditor, { ICommand, TextState } from "@uiw/react-md-editor";
import { useEffect, useState } from "react";

import { link } from "@equinor/eds-icons";
import rehypeSanitize from "rehype-sanitize";
import { SelectionInfo } from "types/SelectionInfo";
import { URLPrompt } from "./URLPrompt";

import colors from "theme/colors";

Icon.add({ link });

export default function MarkdownEditor(props: {
  canEdit?: boolean;
  defaultText: string;
  label?: string;
  onChange?: (value?: string) => void;
  helperText?: string;
  requireText?: boolean;
  onBlur?: (value?: string) => void;
}) {
  const {
    canEdit,
    defaultText,
    label,
    onChange,
    helperText,
    requireText,
    onBlur,
  } = props;
  const [editMode, setEditMode] = useState(canEdit);
  const [isOpenUrlPrompt, setIsOpenUrlPrompt] = useState(false);
  const [selectionInfo, setSelectionInfo] = useState<SelectionInfo>({
    start: 0,
    end: 0,
    linkText: "",
  });
  // The "text"-state is used for displaying the changing text instantly
  const [text, setText] = useState<string | undefined>(defaultText);
  const missingText = requireText && text?.length === 0;

  useEffect(() => {
    setText(defaultText);
  }, [defaultText]);

  useEffect(() => {
    // Open UrlPrompt on ctrl + k
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editMode && (e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault(); // prevent ctrl + k from opening the browser's address bar
        const textArea = window.getSelection()?.anchorNode
          ?.lastChild as HTMLTextAreaElement;

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
  const setAndPatchText = (text?: string) => {
    // Patching the text via the API is debounced in the onChange
    onChange && onChange(text);
    setText(text);
  };

  // Custom link-command for the MDEditor toolbar
  const markdownLink: ICommand = {
    name: "link",
    keyCommand: "link",
    buttonProps: { "aria-label": "Add link" },
    icon: (
      <Tooltip title="Add link" placement="top">
        <Icon data={link} color={colors.EQUINOR_PROMINENT} size={16} />
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
      <URLPrompt
        selectionInfo={selectionInfo}
        setIsOpenUrlPrompt={setIsOpenUrlPrompt}
        setSelectionInfo={setSelectionInfo}
        setAndPatchText={setAndPatchText}
        setEditMode={setEditMode}
        text={text ?? ""}
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
          {/* eslint-disable-next-line react/no-unknown-property */}
          <style global jsx>{`
            #mdEditor > div.w-md-editor-content > div > div {
              font-size: 1rem;
              background-color: rgb(247, 247, 247);
              color: #3d3d3d;
            }
            .w-md-editor-toolbar button[data-name="link"] {
              height: 24px;
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
                backgroundColor: "rgba(247,247,247,1",
                color: "rgba(61,61,61,1)",
                cursor: canEdit ? "text" : "not-allowed",
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
              onBlur: () => {
                //perform data actions onblur if specified
                onBlur && onBlur();
                setTimeout(() => {
                  if (!isOpenUrlPrompt) setEditMode(false);
                }, 250);
              },
            }}
            style={{
              border: editMode
                ? `2px solid ${
                    missingText ? colors.DANGER : colors.EQUINOR_PROMINENT
                  }`
                : `1px solid ${colors.EQUINOR_DISABLED}`,
              borderRadius: 0,
              boxShadow: canEdit && !editMode ? "0 1px 0 0 gray" : "none",
            }}
            autoFocus
          />
          {missingText && (
            <Typography color="danger" variant="caption">
              Description is required
            </Typography>
          )}
        </div>
      </div>
      {helperText && (
        <Typography style={{ marginTop: 12 }} variant="caption">
          {helperText}
        </Typography>
      )}
    </div>
  );
}
