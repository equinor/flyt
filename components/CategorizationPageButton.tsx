import { Application, Circle, Graphics, Point, Text, Ticker } from "pixi.js";
import { Button, Icon, Tooltip } from "@equinor/eds-core-react";
import React, { useEffect, useRef } from "react";
import { category, timeline } from "@equinor/eds-icons";
import { close, link } from "@equinor/eds-icons";
import useWindowSize, { WindowSize } from "../hooks/useWindowSize";

import { Scrollbox } from "pixi-scrollbox";
import { TooltipImproved } from "./TooltipImproved";
import { getProjectUpdateTimes } from "services/projectApi";
import moment from "moment";
import style from "./ParkingLotButton.module.scss";
import { useQuery } from "react-query";
import { useRouter } from "next/router";

/**
 * NB. Currently only adjusted for use in the canvas. path: "baseURL/process/{id}"
 * @constructor
 */
export const CategorizationPageButton = (props: {
  userCanEdit: boolean;
}): JSX.Element => {
  const router = useRouter();
  const windowSize: WindowSize = useWindowSize();

  const projectId = router.query.id as string;
  const versionHistoryDates = useQuery(["versionHistoryDates", projectId], () =>
    getProjectUpdateTimes(projectId)
  );

  function getLeft() {
    const bigScreen = windowSize.width >= 768;

    const iconWidth = 54;
    const rightSide = windowSize.width - iconWidth - 50;
    const center = windowSize.width / 2;

    if (!props.userCanEdit) {
      return bigScreen ? rightSide : center - iconWidth / 2;
    }

    // Make sure to factor in the toolbox
    const toolBoxPadding = 100;
    return bigScreen ? rightSide : center + toolBoxPadding;
  }

  return (
    <div>
      <VersionHistoryButton userCanEdit={props.userCanEdit} />
      <TooltipImproved title="Categorize PQIR's">
        <div
          style={{ left: getLeft() }}
          onClick={() => router.push(`${router.asPath}/categories`)}
          className={style.wrapper}
        >
          <div className={style.iconBorder}>
            <Icon data={category} color={"#007079"} />
          </div>
        </div>
      </TooltipImproved>
    </div>
  );
};

export const VersionHistoryButton = (props: {
  userCanEdit: boolean;
}): JSX.Element => {
  const router = useRouter();
  const projectId = router.query.id as string;
  const { data } = useQuery(["versionHistoryDates", projectId], () =>
    getProjectUpdateTimes(projectId)
  );
  const windowSize: WindowSize = useWindowSize();

  const [showVersionHistoryBottomSheet, setShowVersionHistoryBottomSheet] =
    React.useState(!!router.query.version);

  function getLeft() {
    const bigScreen = windowSize.width >= 768;

    const iconWidth = 54;
    const rightSide = windowSize.width - iconWidth - 50;
    const center = windowSize.width / 2;

    if (!props.userCanEdit) {
      return bigScreen ? rightSide : center - iconWidth / 2;
    }

    // Make sure to factor in the toolbox
    const toolBoxPadding = 100;
    return bigScreen ? rightSide : center + toolBoxPadding;
  }

  function handleVersionHistoryClick() {
    setShowVersionHistoryBottomSheet(true);
  }

  function goToCurrentVersion() {
    // navigate back to current version
    router.replace(`/process/${projectId}`);
  }

  function closeVersionHistoryBottomSheet() {
    setShowVersionHistoryBottomSheet(false);
    goToCurrentVersion();
  }

  return (
    <>
      {showVersionHistoryBottomSheet && (
        <div
          // onWheel={(event) => event.stopPropagation()}
          className={style.versionHistoryBottomSheet}
          style={{
            position: "absolute",
            bottom: "0",
            // left: "0",
            // width: "100%",
            // height: "250px",
            backgroundColor: "white",
            zIndex: 1,
            // marginLeft: "20px",
            // marginRight: "20px",
            minHeight: "200px",
            // borderRadius: "4px 4px 0 0",
            // // marginLeft: 20,
            // marginRight: 20
            borderColor: "black",
            borderWidth: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              backgroundColor: "#fafafa",
              border: "1px solid grey",
            }}
          >
            <Button
              variant={"ghost_icon"}
              onClick={closeVersionHistoryBottomSheet}
            >
              <Icon data={close} />
            </Button>
          </div>
          <ProcessTimeline processId={projectId} />
          {/* <div style={{ display: "flex" }}>
            {data?.map((date: string, index) => {
              return (
                <Button onClick={(e) => travelToVersion(date)}>
                  {moment(date).format("DD/MM/YYYY HH:mm")}
                </Button>
              );
            })}
          </div> */}
        </div>
      )}
      <TooltipImproved title="Show version history">
        <div
          style={{ left: getLeft() - 50 }}
          onClick={handleVersionHistoryClick}
          className={style.wrapper}
        >
          <div className={style.iconBorder}>
            <Icon data={timeline} color={"#007079"} />
          </div>
        </div>
      </TooltipImproved>
    </>
  );
};

/**
 * Testing out crating a process timeline in regular canvas.
 * @param props
 * @returns
 */
export const ProcessTimelineCanvas = (props: { processId: string }) => {
  const ref = useRef();
  const canvasRef = useRef(null);
  const windowSize = useWindowSize();
  const router = useRouter();
  const { data } = useQuery(["versionHistoryDates", props.processId], () =>
    getProjectUpdateTimes(props.processId)
  );

  function travelToVersion(version: string) {
    if (version === "current") {
      router.push(`/process/${props.processId}`);
    } else {
      router.push(`/process/${props.processId}?version=${version}`);
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = windowSize.width;
    const context = canvas.getContext("2d");
    //Draw background
    context.fillStyle = "#dadada";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    //Draw timeline
    context.strokeStyle = "#007079";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(0, canvas.height / 2);
    context.lineTo(context.canvas.width, canvas.height / 2);
    context.stroke();

    // Draw a dot for each date on the timeline distanced by the time elapsed
    const dates = data?.map((date: string) => moment(date));
    if (dates) {
      dates.forEach((date, index) => {
        const x = date.diff(dates[0], "days");
        const y = context.canvas.height / 2;
        context.beginPath();
        context.arc(x, y, 5, 0, 2 * Math.PI);
        context.fillStyle = "#007079";
        context.fill();
        context.font = "12px Arial";
        context.fillText(date.format("DD/MM/YYYY hh:mm"), x - 40, y + 20);
      });
    }

    console.log("RENDER!");
  }, [data, windowSize.width]);

  return <canvas ref={canvasRef} {...props} />;
};

const spacingMultiplier = 120;
export const ProcessTimeline = (props: { processId: string }) => {
  const canvasRef = useRef(null);
  const windowSize = useWindowSize();
  const router = useRouter();
  const { data } = useQuery(["versionHistoryDates", props.processId], () =>
    getProjectUpdateTimes(props.processId)
  );
  const [pixiApp, setPixiApp] = React.useState<Application | null>(null);

  function travelToVersion(version: string) {
    if (version === "current") {
      router.push(`/process/${props.processId}`);
    } else {
      router.push(`/process/${props.processId}?version=${version}`);
    }
  }

  const randomAscendingDates = [
    "2022-01-01",
    "2022-01-02",
    "2022-01-03",
    "2022-01-04",
    "2022-01-05",
    "2022-01-06",
    "2022-01-07",
    "2022-01-08",
    "2022-01-09",
    "2022-01-10",
    // skip a couple of days
    "2022-01-12",
    "2022-01-13",
    "2022-01-14",
    // skip a couple of days
    "2022-01-16",
    "2022-01-17",
    // skip a couple of days
    "2022-01-19",
    "2022-01-20",
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const app = new Application({
      width: windowSize.width,
      height: 250,
      // height: windowSize.height,
      antialias: true,
      backgroundColor: 0xffffff,
    });
    const scrollbox = new Scrollbox({
      boxWidth: windowSize.width,
      boxHeight: 250,
    });

    // scrollbox.options.disableOnContextMenu = true;
    // scrollbox.options.stopPropagation = true;

    // scrollbox.drag()
    //   .pinch() // Pinch doesn't work that well on desktop.
    //   .wheel()
    //   .decelerate({ friction: 0.4 });

    canvas.appendChild(app.view);
    app.stage.addChild(scrollbox);

    // app?.start();

    // Draw a dot for each date on the timeline distanced by the time elapsed
    const dates = data?.map((date: string) => ({
      parsed: moment(date),
      original: date,
    }));
    // const dates = randomAscendingDates?.map((date: string) => ({ parsed: moment(date), original: date }));
    dates?.push({ parsed: moment(), original: "current" });

    // we only want one date per day, drop the rest.
    const datesFiltered = dates?.reduce((acc: any, curr: any) => {
      if (!acc.find((d: any) => d.parsed.isSame(curr.parsed, "day"))) {
        acc.push(curr);
      }
      return acc;
    }, []);

    const primaryColor = 0x007079;
    const highlightColor = 0xdeedee;
    const textColor = 0x6f6f6f;
    const hoverColor = 0x007079;
    const lineColor = primaryColor;

    //highlighter circle
    const highlighter = new Graphics();
    highlighter.beginFill(highlightColor);
    highlighter.drawCircle(0, 0, 16);
    highlighter.endFill();
    highlighter.visible = false;

    if (datesFiltered) {
      const placedElements = datesFiltered.map((date) => {
        const x =
          date.parsed.diff(datesFiltered[0].parsed, "days") * spacingMultiplier;
        const y = app.screen.height / 2; // Center the timeline vertically

        // Draw a white circle with a border around it
        const circle = new Graphics();
        circle.beginFill(0xffffff, 1);
        circle.lineStyle(3, primaryColor, 1);
        circle.drawCircle(0, 0, 7);
        circle.endFill();
        circle.position.set(x, y);
        circle.interactive = true;
        // make the circle hitbox large
        circle.hitArea = new Circle(0, 0, 20);

        // Draw a text label
        const text = new Text(date.parsed.format("DD.MM.YY"));
        text.style.fontSize = 12;
        text.style.fontFamily = "Equinor, Arial";
        text.style.fill = textColor;
        text.style.letterSpacing = 1.1;
        text.anchor.set(0.5);
        text.x = x;
        text.y = y + 36;
        text.resolution = 2;

        // Highlight if active
        if (!router.query.version || router.query.version === date.original) {
          highlighter.visible = true;
          highlighter.x = x;
          highlighter.y = y;
        }
        return { circle, text, date };
      });

      const selectedElementIndex = placedElements.findIndex(
        (e) => router.query.version === e.date.original
      );
      // draw a line between each date
      drawLines(placedElements, selectedElementIndex);

      // add rest of the elements to the stage
      scrollbox.content.addChild(highlighter);
      placedElements.forEach((e) => {
        scrollbox.content.addChild(e.circle, e.text);
      });

      // click handler
      placedElements.forEach((e) => {
        e.circle.on("pointerdown", () => {
          highlighter.visible = true;
          highlighter.x = e.circle.x;
          highlighter.y = e.circle.y;
          travelToVersion(e.date.original);
          drawLines(placedElements, placedElements.indexOf(e)); // Need to redraw the lines
        });
      });

      scrollbox.update();

      // keyboard navigation
      window.addEventListener("keydown", (e) => {
        const currentIndex = placedElements.find(
          (e) => router.query.version === e.date.original
        );
        if (e.key === "ArrowLeft") {
          if (currentIndex > 0) {
            travelToVersion(placedElements[currentIndex - 1].date.original);
          }
        } else if (e.key === "ArrowRight") {
          if (currentIndex < placedElements.length - 1) {
            travelToVersion(placedElements[currentIndex + 1].date.original);
          }
        }
      });
    }

    return () => {
      console.log("STOPPING APP");
      return app.destroy(true);
    };

    /**
     * Draws a line between elements in the timeline,
     * color fills in the line until the selected element is reached
     * @param elements  array of elements to draw lines between. Note, the elements must be in order.
     * @param highlightUntilIndex  The selected element index. The path will be colored until this element. After this element, the path will be colored in gray.
     */
    function drawLines(
      elements: any,
      highlightUntilIndex: any,
      options?: { highlightColor?: number; lineColor?: number }
    ) {
      // color variables
      const highlightColor = options?.highlightColor || 0x007079;
      const pathColor = options?.lineColor || 0xf7f7f7;

      // draw the lines
      elements.forEach((current, index) => {
        if (index > 0) {
          const previous = elements[index - 1];

          // create a line
          const line = scrollbox.content.addChild(new Graphics());

          // Styling
          // highlight all lines before the selected one
          if (highlightUntilIndex === -1 || index <= highlightUntilIndex) {
            line.lineStyle(5, highlightColor, 1);
          } else {
            line.lineStyle(5, pathColor, 1);
          }

          // Draw a line between the current element and the previous element
          line.moveTo(
            previous.circle.x + previous.circle.width / 2,
            previous.circle.y
          );
          line.lineTo(
            current.circle.x - current.circle.width / 2,
            current.circle.y
          );
        }
      });
    }
  }, [canvasRef, windowSize.width, router.query.version]);

  return <div ref={canvasRef} {...props} />;
};
