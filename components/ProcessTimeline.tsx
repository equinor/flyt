import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { getProjectUpdateTimes } from "../services/projectApi";
import React, { useEffect } from "react";
import { NativeSelect } from "@equinor/eds-core-react";
import { useUrlState } from "../hooks/useUrlState";
import { getDateTimeOption } from "../utils/GetDateTimeOption";

// ProcessTimeline - display process updates in a horizontal timeline
// Selecting a timeline item will navigate to the corresponding version-specific page
// Ref: https://github.com/equinor/MAD-VSM-WEB/issues/154
export function ProcessTimeline(props: { processId: number | string }) {
  const { processId } = props;
  const router = useRouter();
  const version = router.query.version as string;
  const [resolution, setResolution] = useUrlState("resolution", "day");
  const dateTimeOption = getDateTimeOption(resolution);

  const { data } = useQuery(["versionHistoryDates", processId], () =>
    getProjectUpdateTimes(processId)
  );

  const filteredDates = {}; // only store the last date per year/day/month etc depending on the 'resolution'
  data?.forEach((originalDate: string) => {
    const date = new Date(originalDate);
    const key = date.toLocaleDateString("no-NO", dateTimeOption);
    filteredDates[key] = originalDate;
  });

  const timeLineDateObjects: TimeLineElement[] = Object.values(
    filteredDates
  )?.map((originalDate: string, index) => {
    const isLast = index === Object.keys(filteredDates)?.length - 1;
    const date = new Date(originalDate);

    return {
      date: date,
      displayString: isLast
        ? "Now"
        : date.toLocaleDateString("no-NO", dateTimeOption),
    };
  });

  let selectedIndex = timeLineDateObjects?.findIndex(
    (element) => element.date.toISOString() === version
  );
  if (selectedIndex === -1) {
    // If the version is not found in the timeline, select the closest instead.
    // - Note, the closest will be shown as selected in the UI even though it is not exactly the selected version
    // Todo: Make this distinction clear in the ui.
    selectedIndex = timeLineDateObjects?.findIndex(
      (element) => element.date.toISOString() > version
    );
  }
  if (selectedIndex === -1) {
    // If version is still not found, select the last element.
    // - This is the default-state when a user opens the timeline.
    selectedIndex = timeLineDateObjects?.length - 1;
  }

  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <div
        style={{
          width: 150,
          padding: 12,
        }}
      >
        <NativeSelect
          id="select-resolution"
          value={resolution}
          onChange={(e) => setResolution(e.target.value)}
          label={"Resolution"}
        >
          <option value="year">Year</option>
          <option value="month">Month</option>
          <option value="day">Day</option>
          <option value="hour">Hour</option>
          <option value="minute">Minute</option>
        </NativeSelect>
      </div>

      <div
        style={{
          overflowX: "scroll",
          display: "flex",
          padding: 50,
        }}
      >
        {timeLineDateObjects?.map((item, index) => {
          return (
            <TimelineItem
              key={item.displayString}
              item={item}
              onClick={(item) => {
                if (item.displayString === "Now") {
                  router.replace({
                    pathname: `/process/${processId}`,
                    query: { resolution },
                  });
                } else {
                  router.replace({
                    pathname: `/process/${processId}`,
                    query: {
                      resolution,
                      version: item.date.toISOString(),
                    },
                  });
                }
              }}
              index={index}
              selectedIndex={selectedIndex}
              numberOfItems={timeLineDateObjects.length}
            />
          );
        })}
      </div>
    </div>
  );
}

function Line(props: { hidden: boolean; colored: boolean }) {
  if (props.hidden) return <span style={{ width: 46 }} />;
  return (
    <span
      style={{
        height: 4,
        width: 46,
        backgroundColor: props.colored ? "#007079" : "#F7F7F7",
      }}
    />
  );
}

function Dot(props: { selected: boolean }) {
  return (
    <span
      style={{
        border: props.selected && "#DEEDEE solid 6px",
        borderRadius: "50%",
      }}
    >
      <div
        style={{
          width: 12,
          height: 12,
          backgroundColor: "white",
          border: "3px solid #007079",
          borderRadius: "50%",
        }}
      />
    </span>
  );
}

export function TimelineItem(props: {
  item: TimeLineElement;
  onClick: (item: TimeLineElement) => void;
  numberOfItems: number;
  index: number;
  selectedIndex: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { item, onClick, index, selectedIndex, numberOfItems } = props;
  const isSelected = index === selectedIndex;
  const isFirst = index === 0;
  const isLast = index === numberOfItems - 1;

  useEffect(() => {
    // Make sure the selected item is visible by scrolling it into view
    if (isSelected) ref.current.scrollIntoView({ behavior: "smooth" });
  }, [isSelected]);

  return (
    <span ref={ref}>
      <button
        style={{
          backgroundColor: "transparent",
          border: "none",
          padding: 0,
          margin: 0,
          cursor: "pointer",
        }}
        onClick={() => onClick(item)}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: 30,
            width: 110,
          }}
        >
          <Line hidden={isFirst} colored={selectedIndex >= index} />
          <Dot selected={isSelected} />
          <Line hidden={isLast} colored={selectedIndex > index} />
        </div>
        <p
          style={{
            fontSize: "10px",
            lineHeight: "16px",
            letterSpacing: "1.1px",
            textTransform: "uppercase",
          }}
        >
          {item.displayString}
        </p>
      </button>
    </span>
  );
}

export type TimeLineElement = {
  date: Date;
  displayString: string;
};
