import { Arrow, useLayer } from "react-laag";
import { Button, Icon, TextField } from "@equinor/eds-core-react";
import { close, link } from "@equinor/eds-icons";

import React from "react";
import { SimpleEditor } from "../components/MarkDownEditor";
import useTextSelection from "hooks/useTextSelection";

export default function SelectionInfoPage() {
  function SelectionInfo({ children }) {
    // The hook we've created earlier
    const { range, ref } = useTextSelection();

    const showSelectionInfo = Boolean(range);

    // The most important part here is the `trigger` option.
    // Since we don't have any concrete trigger-element, we can tell react-laag
    // where to position the layer this way.
    // What's pretty cool is the fact that a Range object has a `getBoundingClientRect()`
    // as well!
    const { renderLayer, layerProps, arrowProps } = useLayer({
      isOpen: showSelectionInfo,
      trigger: {
        getBounds: () => range.getBoundingClientRect(),
      },
    });

    return (
      <>
        <div ref={ref}>{children}</div>
        {showSelectionInfo &&
          renderLayer(
            <div className="tooltip" {...layerProps}>
              <Button variant="ghost_icon" title="Add link">
                <Icon data={link} />
              </Button>
              <Arrow {...arrowProps} />
            </div>
          )}
      </>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <SelectionInfo>
        <SimpleEditor
          markdown={`
            Hello World!
            What's up?
          `}
        />
      </SelectionInfo>
    </div>
  );
}
