import React from "react";
import dynamic from "next/dynamic";

const MarkdownEditor = dynamic(() => import("components/MarkdownEditor"), {
  ssr: false,
});

export default function MarkdownPage() {
  return <MarkdownEditor />;
}
