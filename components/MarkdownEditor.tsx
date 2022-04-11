import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { Button, Icon, Input, Label, Scrim } from "@equinor/eds-core-react";
import MDEditor, {
  ICommand,
  TextAreaTextApi,
  TextState,
} from "@uiw/react-md-editor";
import React, { useRef, useState } from "react";
import { check, link } from "@equinor/eds-icons";
import rehypeSanitize from "rehype-sanitize";

function URLPrompt(props: { onConfirm: (url: string) => void }) {
  const [url, setUrl] = useState("");

  const isValid = (text) => {
    const regex = new RegExp(
      "^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.)([0-9A-Za-z-.@:%_+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?"
    );
    return regex.test(text);
  };

  return (
    <div className="url-prompt">
      <Input
        type="text"
        value={url}
        variant={isValid(url) ? "success" : "error"}
        onChange={(e) => setUrl(e.target.value)}
      />
      <Button onClick={() => props.onConfirm(url)} disabled={!isValid(url)}>
        <Icon data={check} />
      </Button>
    </div>
  );
}

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
  const [isOpenUrlPrompt, setIsOpenUrlPrompt] = useState(false);
  const [selectionInfo, setSelectionInfo] = useState({
    start: 0,
    end: 0,
    linkText: "",
  });

  const ref = useRef();

  function openLinkPrompt(state: TextState, linkText: string) {
    setIsOpenUrlPrompt(true);
    setSelectionInfo({
      start: state.selection.start,
      end: state.selection.end,
      linkText,
    });
  }

  const markdownLink: ICommand = {
    name: "Markdown link",
    keyCommand: "markdownLink",
    buttonProps: { "aria-label": "Markdown link" },
    icon: <Icon data={link} color={"#007079"} size={24} />,
    execute: (state: TextState, api: TextAreaTextApi) => {
      const linkText = state.selectedText ? state.selectedText : "text";
      openLinkPrompt(state, linkText);
    },
  };

  return (
    <div id={id} data-color-mode="light">
      <Scrim open={isOpenUrlPrompt}>
        <URLPrompt
          onConfirm={(url) => {
            const { linkText, start, end } = selectionInfo;
            const before = value.substring(0, start);
            const after = value.substring(end);
            const modifyText = `${before}[${linkText}](${url})${after}`;
            onChange(modifyText);
            setValue(modifyText);
            setIsOpenUrlPrompt(false);
          }}
        />
      </Scrim>
      <Label htmlFor="mdEditor" label={label} />
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
