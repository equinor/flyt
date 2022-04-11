import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { Button, Icon, Label } from "@equinor/eds-core-react";
import MDEditor, {
  ICommand,
  TextAreaTextApi,
  TextState,
} from "@uiw/react-md-editor";
import React, { useRef, useState } from "react";
import { check, link } from "@equinor/eds-icons";
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
  //const [selection, setSelection] = useState({ start: 0, end: 0 });

  // const set = () => (, end, what) {
  //   return this.substring(0, start) + what + this.substring(end);
  // };

  //console.log("The Hello World Code!".replaceBetween(4, 9, "Hi"));
  // useEffect(() => {
  //   const txtarea = document.getElementById(
  //     "markdown-editor-textarea"
  //   ) as HTMLTextAreaElement;
  //   //txtarea.focus();
  //   txtarea.setSelectionRange(0, 20);
  // }, [selection]);
  const ref = useRef<any>();

  const markdownLink: ICommand = {
    name: "Markdown link",
    keyCommand: "markdownLink",
    buttonProps: { "aria-label": "Markdown link" },
    icon: <Icon data={link} color={"#007079"} size={24} />,
    execute: (state: TextState, api: TextAreaTextApi) => {
      const startText = state.text.substring(0, state.selection.start);
      const linkText = state.selectedText ? state.selectedText : "text";
      const endText = state.text.substring(
        state.selection.end,
        state.text.length
      );
      const modifyText = `${startText}[${linkText}](url)${endText}`;
      onChange(modifyText);
      setValue(modifyText);
      debugger;
      ref.current.textarea.setSelectionRange(
        state.selection.start + state.selectedText.length,
        state.selection.end + 3
      );
      //api.setSelectionRange({});
      //api.replaceSelection(modifyText);
      //onChange(state.text);
      //setValue(state.text);
      //api.setSelectionRange(state.selection);
    },
  };

  return (
    <div id={id} data-color-mode="light">
      {/* <label htmlFor="mdEditor" style={{ marginLeft: "8px" }}>
        <Typography
          color={canEdit ? "#6F6F6F" : "rgba(190,190,190,1)"}
          group="input"
          variant="label"
          //style={{ margin: "0 8px" }}
        >
          {label}
        </Typography>
      </label> */}
      <Label htmlFor="mdEditor" label={label}></Label>
      <div style={{ display: "flex", gap: 12 }}>
        <div onClick={() => canEdit && setEditMode(true)} style={{ flex: 1 }}>
          <MDEditor
            id="mdEditor"
            ref={ref}
            value={value}
            onChange={(value?: string) => {
              onChange(value);
              setValue(value);
            }}
            preview={editMode ? "edit" : "preview"}
            extraCommands={[]}
            commands={[markdownLink]}
            hideToolbar={!editMode}
            previewOptions={{
              rehypePlugins: [[rehypeSanitize]],
              style: {
                color: "rgba(61,61,61,1)",
                fontSize: "1rem",
                fontWeight: 400,
                lineHeight: 1.5,
                padding: "6px 8px",
                cursor: canEdit && "cell",
                backgroundColor: canEdit ? "rgba(247,247,247,1" : "white",
              },
              linkTarget: "_blank",
            }}
            textareaProps={{
              id: "markdown-editor-textarea",
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
