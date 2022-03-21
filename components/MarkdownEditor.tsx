import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

import MDEditor, { commands } from "@uiw/react-md-editor";

import React from "react";
import { useState } from "react";

export default function MarkdownComponent() {
  const [value, setValue] = useState("**Hello world!!!**");
  return (
    <div>
      <MDEditor
        value={value}
        onChange={setValue}
        preview="edit"
        extraCommands={[]}
        commands={[commands.link]}
      />
    </div>
  );
}
