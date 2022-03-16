import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

import React from "react";
import dynamic from "next/dynamic";
import { useState } from "react";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function MarkdownComponent() {
  const [value, setValue] = useState("**Hello world!!!**");
  return (
    <div>
      <MDEditor value={value} onChange={setValue} />
    </div>
  );
}
