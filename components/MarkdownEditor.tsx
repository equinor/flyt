import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

import {
  Button,
  Icon,
  Label,
  Scrim,
  TextField,
  Tooltip,
} from "@equinor/eds-core-react";
import MDEditor, {
  ICommand,
  TextAreaTextApi,
  TextState,
} from "@uiw/react-md-editor";
import React, { useEffect, useState } from "react";

import { check } from "@equinor/eds-icons";
import rehypeSanitize from "rehype-sanitize";
import styles from "../layouts/default.layout.module.scss";
import URLPrompt from "./URLPrompt";
import { transformLink } from "utils/transformLink";

interface SelectionInfo {
  start: number;
  end: number;
  linkText: string;
}

export default function MarkdownEditor(props: {
  canEdit: boolean;
  defaultValue: string;
  label?: string;
  onChange?: (value?: string) => void;
}) {
  const { canEdit, defaultValue, label = "", onChange } = props;
  const [editMode, setEditMode] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [isOpenUrlPrompt, setIsOpenUrlPrompt] = useState(false);
  const [selectionInfo, setSelectionInfo] = useState<SelectionInfo>({
    start: 0,
    end: 0,
    linkText: "",
  });
  const [url, setUrl] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (editMode && (e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault(); // prevent ctrl+k from opening the browser's address bar
        const textArea = window.getSelection().anchorNode
          .lastChild as HTMLTextAreaElement;

        openLinkPrompt({
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

  const openLinkPrompt = (selection: SelectionInfo) => {
    const { start, end, linkText } = selection;
    setSelectionInfo({
      start: start,
      end: end,
      linkText: linkText,
    });
    setIsOpenUrlPrompt(true);
  };

  const markdownLink: ICommand = {
    name: "link",
    keyCommand: "link",
    buttonProps: { "aria-label": "Add link" },
    icon: (
      <Tooltip title="Add link" placement="top">
        <svg
          data-name="italic"
          width="12"
          height="12"
          role="img"
          viewBox="0 0 520 520"
        >
          <path
            fill="#007079"
            d="M331.751196,182.121107 C392.438214,241.974735 391.605313,337.935283 332.11686,396.871226 C332.005129,396.991316 331.873084,397.121413 331.751196,397.241503 L263.493918,464.491645 C203.291404,523.80587 105.345257,523.797864 45.151885,464.491645 C-15.0506283,405.187427 -15.0506283,308.675467 45.151885,249.371249 L82.8416853,212.237562 C92.836501,202.39022 110.049118,208.9351 110.56511,222.851476 C111.223305,240.5867 114.451306,258.404985 120.407566,275.611815 C122.424812,281.438159 120.983487,287.882964 116.565047,292.23621 L103.272145,305.332975 C74.8052033,333.379887 73.9123737,379.047937 102.098973,407.369054 C130.563883,435.969378 177.350591,436.139505 206.033884,407.879434 L274.291163,340.6393 C302.9257,312.427264 302.805844,266.827265 274.291163,238.733318 C270.531934,235.036561 266.74528,232.16442 263.787465,230.157924 C259.544542,227.2873 256.928256,222.609848 256.731165,217.542518 C256.328935,206.967633 260.13184,196.070508 268.613213,187.714278 L289.998463,166.643567 C295.606326,161.118448 304.403592,160.439942 310.906317,164.911276 C318.353355,170.034591 325.328531,175.793397 331.751196,182.121107 Z M240.704978,55.4828366 L172.447607,122.733236 C172.325719,122.853326 172.193674,122.983423 172.081943,123.103513 C117.703294,179.334654 129.953294,261.569283 185.365841,328.828764 C191.044403,335.721376 198.762988,340.914712 206.209732,346.037661 C212.712465,350.509012 221.510759,349.829503 227.117615,344.305363 L248.502893,323.234572 C256.984277,314.87831 260.787188,303.981143 260.384957,293.406218 C260.187865,288.338869 257.571576,283.661398 253.328648,280.790763 C250.370829,278.78426 246.58417,275.912107 242.824936,272.215337 C214.310216,244.121282 206.209732,204.825874 229.906702,179.334654 L298.164073,112.094263 C326.847404,83.8340838 373.633159,84.0042113 402.099123,112.604645 C430.285761,140.92587 429.393946,186.594095 400.92595,214.641114 L387.63303,227.737929 C383.214584,232.091191 381.773257,238.536021 383.790506,244.362388 C389.746774,261.569283 392.974779,279.387637 393.632975,297.122928 C394.149984,311.039357 411.361608,317.584262 421.356437,307.736882 L459.046288,270.603053 C519.249898,211.29961 519.249898,114.787281 459.047304,55.4828366 C398.853851,-3.82360914 300.907572,-3.83161514 240.704978,55.4828366 Z"
          ></path>
        </svg>
      </Tooltip>
    ),
    execute: (state: TextState, api: TextAreaTextApi) => {
      const linkText = state.selectedText ? state.selectedText : "";
      const selection = {
        start: state.selection.start,
        end: state.selection.end,
        linkText: linkText,
      };
      openLinkPrompt(selection);
    },
  };

  const onConfirmURLPrompt = (url: string) => {
    const { start, end, linkText } = selectionInfo;
    const before = value.substring(0, start);
    const transformedLink = transformLink(url);
    const after = value.substring(end);
    const modifyText = `${before}[${linkText}](${transformedLink})${after}`;
    onChange(modifyText);
    setValue(modifyText);
    onCloseURLPrompt();
  };

  const onCloseURLPrompt = () => {
    setSelectionInfo({ ...selectionInfo, linkText: "" });
    setUrl("");
    setIsOpenUrlPrompt(false);
  };

  return (
    <div data-color-mode="light">
      <Scrim
        open={isOpenUrlPrompt}
        onClose={onCloseURLPrompt}
        isDismissable
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            onConfirmURLPrompt(url);
          }
        }}
        style={{
          overflow: "hidden",
          backgroundColor: "white",
          position: "absolute",
          bottom: 0,
          left: 0,
          zIndex: 1000,
          display: "block",
          width: "100%",
        }}
      >
        <div className={styles.scrimWrapper}>
          <div
            className={styles.scrimHeaderWrapper}
            style={{ marginBottom: 16 }}
          >
            <div className={styles.scrimTitle}>Add link</div>
          </div>
          <TextField
            autoFocus={!selectionInfo.linkText}
            label={"Text"}
            variant={"default"}
            defaultValue={selectionInfo.linkText}
            onChange={(e) =>
              setSelectionInfo({ ...selectionInfo, linkText: e.target.value })
            }
            id={"linkText"}
            autoComplete="off"
          />
          <div className={styles.scrimContent}>
            <URLPrompt
              onConfirm={(url) => {
                onConfirmURLPrompt(url);
              }}
              linkText={selectionInfo.linkText}
              url={url}
              setUrl={setUrl}
              onClose={onCloseURLPrompt}
            />
          </div>
        </div>
      </Scrim>
      <Label htmlFor="mdEditor" label={label} />
      <div style={{ display: "flex", gap: 12 }}>
        <div onClick={() => canEdit && setEditMode(true)} style={{ flex: 1 }}>
          <style global jsx>{`
            #mdEditor > div.w-md-editor-content > div > div {
              font-size: 1rem;
              background-color: rgb(247, 247, 247);
              color: #3d3d3d;
            }
          `}</style>
          <MDEditor
            id="mdEditor"
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
