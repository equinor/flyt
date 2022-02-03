import { Button, Input, Scrim, TextField } from "@equinor/eds-core-react";
import { useEffect, useRef, useState } from "react";

import React from "react";
import { TooltipImproved } from "components/TooltipImproved";

export default function InputPage() {
  const [value, setValue] = useState("Hello world! \nLet's add a link here.");

  return (
    <div
      style={{
        //center the content
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        // height: "100vh"
      }}
    >
      <h1>Input Page</h1>
      <p>This is the input page</p>
      <EDSMarkDownInput
        value={value}
        onChange={(newValue) => setValue(newValue)}
      />
    </div>
  );
}

const EDSMarkDownInput = (props: {
  value: string;
  onChange: (newValue: string, callBack?: () => void) => void;
}) => {
  const { value, onChange } = props;
  const [showScrim, setShowScrim] = useState(false);
  const [link, setLink] = useState("");
  const [validLink, setValidLink] = useState(false);
  const textareaRef = useRef(null);
  const [selection, setSelection] = useState({
    start: 0,
    end: 0,
  });

  useEffect(() => {
    const isValid = isValidHttpUrl(link);
    setValidLink(!!isValid);
  }, [link]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function handleKeyDown(arg0: any) {
    // Add link shortcut
    if (arg0.ctrlKey && arg0.key === "k") {
      setShowScrim(true);
    }
  }
  function clearAndHideScrim() {
    setShowScrim(false);
    setLink("");
  }
  return (
    <>
      <Scrim open={showScrim} onClick={() => setShowScrim(false)} isDismissable>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: 4,
          }}
        >
          <p
            style={{
              paddingLeft: 12,
              paddingRight: 12,
              paddingTop: 12,
              paddingBottom: 8,
              borderBottom: "1px solid #cccccc",
            }}
          >
            Add link
          </p>
          <div
            style={{
              padding: 12,
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            <TextField
              autoFocus
              helperText={link.length > 0 && !validLink ? "Invalid link" : ""}
              label="Address"
              id={"WebAddress"}
              placeholder={"https://www.equinor.com"}
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
            <div style={{ display: "flex", gap: 12, justifyContent: "end" }}>
              <Button variant="outlined" onClick={clearAndHideScrim}>
                Cancel
              </Button>
              <Button
                title={validLink ? "Add link" : "Invalid link"}
                disabled={!validLink}
                onClick={() => {
                  insertMarkDownLink(link, selection);
                  clearAndHideScrim();
                }}
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      </Scrim>

      <div style={{ position: "relative" }}>
        <button
          style={{
            // place top right inside the textarea
            position: "absolute",
            top: "0",
            right: "0",
            // make it small
            width: "30px",
            height: "30px",
            // zIndex: 1000,
          }}
          onClick={() => {
            const start = textareaRef.current.selectionStart;
            const end = textareaRef.current.selectionEnd;
            if (start === end) return;
            setSelection({ start, end });
            return setShowScrim(true);
          }}
        >
          Add link
        </button>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            // setNewValue(e.target.value);
            // store the start and end of the selection
            return onChange(e.target.value);
          }}
          rows={10}
          cols={30}
        />
      </div>
    </>
  );

  function insertMarkDownLink(
    link: string,
    selection: { start: number; end: number }
  ) {
    if (!link) throw new Error("Link is required");
    if (!selection) throw new Error("Selection is required");
    const { start, end } = selection;
    if (start === end) return; // nothing selected
    const selectedText = textareaRef.current.value.substring(start, end);

    // replace with markdown link
    const newValue = textareaRef.current.value.replace(
      selectedText,
      `[${selectedText}](${link})`
    );

    // set new text
    onChange(newValue);

    //clear selection
    setSelection({ start: 0, end: 0 });
  }
};

export function isValidHttpUrl(link: string) {
  let url: URL;

  try {
    url = new URL(link);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}
