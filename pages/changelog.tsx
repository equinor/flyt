import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import React from "react";
import { useQuery } from "react-query";
import { unknownErrorToString } from "../utils/isError";
import { Layouts } from "../layouts/LayoutWrapper";

export default function ChangelogPage(): JSX.Element {
  const { data, isLoading, error } = useQuery("Changelog", () =>
    fetch(`/api/changelog`, { method: "GET" }).then((r) => r.json())
  );

  if (isLoading) return <p>Loading...</p>;
  if (error)
    return <p>Error loading changelog: {unknownErrorToString(error)}</p>;
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div>
        <ReactMarkdown remarkPlugins={[gfm]}>{data?.text}</ReactMarkdown>
      </div>
    </div>
  );
}

ChangelogPage.layout = Layouts.Default;
