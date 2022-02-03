import React, { useEffect } from "react";

import { marked } from "./marked/marked";

/**
 * Simple editor
 * @param _props
 * @returns
 */
export const SimpleEditor = (_props: { markdown: string }) => {
  const markdown = `This is what a link looks like: 
  This is a link to [Google](https://www.google.com)
  [Link one](https://www.equinor.com) [Link two](https://www.equinor.com)
  
  - This is a list item
  - This is another list item
  - This is a third list item
  
  #120 #something #somethingElse 
  `;

  useEffect(() => {
    console.log(marked(markdown));
  }, [markdown]);

  return (
    <div
      style={{
        // center
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        // alignItems: "center",
        // justifyContent: "center",
        // height: "100vh"
      }}
    >
      <p>Hello world!</p>
    </div>
  );
};
