import * as PIXI from "pixi.js";
import { Point } from "pixi.js";

import { Graph, GraphEdge, GraphNode } from "utils/layoutEngine";
import { Viewport } from "pixi-viewport";
import { assetFactory } from "./AssetFactory";
import { clearGraphEdges, drawGraphEdges } from "./drawGraphEdges";
import { drawGraphNodes } from "./drawGraphNodes";
import { getColor } from "utils/getColor";
import { vsmProject } from "../../../interfaces/VsmProject";
import { drawPerformanceInfo, getPerformance } from "./DrawPerformanceInfo";

/**
 * Config object for testing out different features while developing
 * Might be removed in the future when features are stable
 */
const config = {
  showDropArrow: false, // Arrows indicating where a card will go when dropped
  showCursor: false, // extra round cursor appearing under the mouse-cursor
  showTooltip: true, //node name is shown on hover
  throttle: 20, // ms - How often to do expensive operations.
  // Note, higher values might be perceived as the ui lagging behind, depending on what is being drawn.
  // This is a tradeoff and a higher value might be preferred for performance reasons.
  // Note: set throttle to ~20 ms for a smoother experience
  drawLineFromCursorToClosestNode: false, // Draw a line from the cursor to the closest node
  showPerformanceInfo: true, // Show performance info
  showGraphEdges: true, // Show graph edges
};

/**
 * Get the distance between two points
 * @param from - The point to measure from
 * @param to - The point to measure to
 */
export const getDistance = (
  from: { x: number; y: number },
  to: { x: number; y: number }
) => Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2)); // Using the pythagoras theorem

/**
 * Adds the project-cards to our canvas
 * @param viewport
 * @param process
 * @param userCanEdit
 * @param dispatch
 * @param setSelectedObject
 * @param vsmObjectMutation
 * @param app
 */
export function addCardsToCanvas(
  viewport: Viewport,
  process: vsmProject,
  userCanEdit: boolean,
  dispatch,
  setSelectedObject,
  vsmObjectMutation,
  app
): void {
  const startTime = performance.now();
  // Adding cards to canvas
  const root = process.objects ? process.objects[0] : null;
  if (!root) {
    const card = assetFactory(
      {
        vsmObjectID: 0,
        name: "ERROR: Project contains no root object",
      },
      setSelectedObject
    );
    viewport.addChild(card);
  } else {
    const graph = new Graph(process);
    const { nodes, edges } = graph;

    const performanceTimer = getPerformance(app, ({ performance }) => {
      if (performance === "Bad") {
        console.warn(
          "Performance is bad, removing edges and adjusting throttle"
        );
        config.throttle = 200;
        config.showGraphEdges = false;
        clearGraphEdges(viewport);
        clearInterval(performanceTimer);
      }
    });

    if (config.showGraphEdges) drawGraphEdges(edges, viewport);
    drawGraphNodes(nodes, setSelectedObject, viewport);
    // drawCardPalette(app.stage, graph); // <- NOTE, REALLY BAD PERFORMANCE... todo: improve performance
    // if (config.showPerformanceInfo) drawPerformanceInfo(app);

    // DECLARE ALL OUR PIXI OBJECTS

    const hexColor = getColor("HSJO@equinor.com"); //Todo: get user color
    //Get user color
    // convert hexcolor to number
    const color = parseInt(hexColor.slice(1), 16);

    // add a user-cursor to the canvas
    const cursor = newCursor(color);
    viewport.addChild(cursor);
    cursor.visible = false;

    // add a highlight circle
    const highlight = new PIXI.Graphics();
    //dark blue
    // border color
    highlight.lineStyle(1, color, 0.5);
    highlight.beginFill(color, 0.05);
    highlight.drawCircle(0, 0, 100);
    highlight.endFill();
    highlight.visible = false;
    viewport.addChild(highlight);

    // tooltip
    const tooltip = new PIXI.Text("Tooltip");
    tooltip.style = new PIXI.TextStyle({
      fontFamily: "Equinor",
      fontSize: 16,
    });
    tooltip.visible = false;
    //Add a rounded box around it
    const tooltipBox = new PIXI.Graphics();
    tooltipBox.beginFill(0xffffff, 0.9);
    tooltipBox.drawRect(0, 0, tooltip.width + 10, tooltip.height + 10);
    tooltipBox.endFill();
    tooltipBox.visible = false;
    viewport.addChild(tooltipBox);
    viewport.addChild(tooltip);

    //arrow
    const arrow = new PIXI.Graphics();
    arrow.lineStyle(2);
    arrow.lineTo(10, 0); //line

    //arrowhead
    arrow.moveTo(10, -10);
    arrow.lineTo(20, 0);
    arrow.lineTo(10, 10);

    // arrow.lineTo(10, -10); //close
    arrow.visible = false;
    viewport.addChild(arrow);

    // line from cursor to closest node
    const line = new PIXI.Graphics();
    line.visible = false;
    viewport.addChild(line);

    // MAKE IT INTERACTIVE

    let lastHitTest = null;
    // Track mouse position and update cursor position, keeping scroll position in mind
    viewport.on("mousemove", (e) => {
      const { x, y } = e.data.getLocalPosition(viewport);
      //move the cursor
      cursor.x = x;
      cursor.y = y;
      cursor.visible = config.showCursor;

      //move the tooltip
      tooltipBox.x = x + 25;
      tooltipBox.y = y;
      tooltip.x = x + 30;
      tooltip.y = y + 5;

      //If hovered, show a tooltip
      // Do not hit-test too often (performance)
      if (Date.now() - lastHitTest > config.throttle) {
        const hit = graph.hitTest(x, y);
        lastHitTest = Date.now();
        if (hit.node) {
          // change cursor to pointer
          viewport.cursor = "pointer";

          if (config.showTooltip) {
            tooltip.text = hit.node.name;
            // if (e.data.originalEvent.shiftKey) {
            // delay tooltip
            tooltipBox.visible = !!tooltip.text;
            tooltip.visible = true;
            // }
            //tooltip-box the size of the text
            tooltipBox.width = tooltip.width + 10;
            tooltipBox.height = tooltip.height + 10;
          }
          if (config.showDropArrow) {
            // Arrow for drop locations
            const centerLeft = {
              y: hit.node.position.y + hit.node.height / 2,
              x: hit.node.position.x,
            };

            const centerRight = {
              y: hit.node.position.y + hit.node.height / 2,
              x: hit.node.position.x + hit.node.width,
            };

            const centerTop = {
              y: hit.node.position.y,
              x: hit.node.position.x + hit.node.width / 2,
            };

            const centerBottom = {
              y: hit.node.position.y + hit.node.height,
              x: hit.node.position.x + hit.node.width / 2,
            };

            //calculate distance to centers
            const distanceToCenterLeft = getDistance(centerLeft, { x, y });
            const distanceToCenterRight = getDistance(centerRight, { x, y });
            const distanceToCenterTop = getDistance(centerTop, { x, y });
            const distanceToCenterBottom = getDistance(centerBottom, { x, y });

            //todo: make this easier to read
            let closest: { x: number; y: number } = { x: 0, y: 0 };
            const closestToCenterBottom =
              distanceToCenterBottom < distanceToCenterTop &&
              distanceToCenterBottom < distanceToCenterLeft &&
              distanceToCenterBottom < distanceToCenterRight;
            const closestToCenterLeft =
              distanceToCenterLeft < distanceToCenterRight &&
              distanceToCenterLeft < distanceToCenterTop &&
              distanceToCenterLeft < distanceToCenterBottom;
            const closestToCenterRight =
              distanceToCenterRight < distanceToCenterLeft &&
              distanceToCenterRight < distanceToCenterTop &&
              distanceToCenterRight < distanceToCenterBottom;
            const closestToCenterTop =
              distanceToCenterTop < distanceToCenterBottom &&
              distanceToCenterTop < distanceToCenterLeft &&
              distanceToCenterTop < distanceToCenterRight;

            const edges = graph.getNodeEdges(hit.node);
            unHighlightEdges(edges, viewport); //<- VERY TAXING, UNCOMMENT IF YOU WANT TO UNHIGHLIGHT ALL EDGES
            if (closestToCenterBottom) {
              closest = centerBottom;
              arrow.rotation = Math.PI / 2;

              // highlight any outgoing edges
              const outGoingEdges = graph.getOutgoingEdges(hit.node);
              highlightEdges(outGoingEdges, viewport); //<- VERY TAXING, UNCOMMENT IF YOU WANT TO UNHIGHLIGHT ALL EDGES
            } else if (closestToCenterLeft) {
              arrow.rotation = Math.PI;
              closest = centerLeft;
            } else if (closestToCenterRight) {
              arrow.rotation = 0;
              closest = centerRight;
            } else if (closestToCenterTop) {
              arrow.rotation = -Math.PI / 2;
              closest = centerTop;

              // highlight any incoming edges
              const incomingEdges = graph.getIncomingEdges(hit.node);
              highlightEdges(incomingEdges, viewport); //<- VERY TAXING, UNCOMMENT IF YOU WANT TO UNHIGHLIGHT ALL EDGES
            }
            // move the arrow to indicate where we may drop a new node
            arrow.x = closest.x;
            arrow.y = closest.y;
            // TODO: only show the arrow if it is a valid drop location
            arrow.visible = true;
          }
        } else {
          tooltip.visible = false;
          tooltipBox.visible = false;
          arrow.visible = false;
          // change cursor to default
          viewport.cursor = "default";
          unHighlightEdges(edges, viewport); //<- VERY TAXING, UNCOMMENT IF YOU WANT TO UNHIGHLIGHT ALL EDGES
        }
        if (config.drawLineFromCursorToClosestNode) {
          // draw a line from the cursor to the closest card
          const closest = graph.getClosestNode(x, y);
          if (closest) {
            const closestX = closest.position.x + closest.width / 2;
            const closestY = closest.position.y + closest.height / 2;
            line.clear();
            line.lineStyle(2, color, 0.5);
            line.moveTo(x, y);
            line.lineTo(closestX, closestY);
            line.visible = true;
          } else {
            line.visible = false;
          }
        }
      }
    });

    viewport.on("mouseout", () => {
      cursor.visible = false;
      line.visible = false;
    });

    window.addEventListener("keydown", (event) => {
      //todo: Remove eventListener on destroy
      if (event.key === "ArrowDown") {
        graph.navigateDown();
        highlightAndMove(graph, highlight);
      } else if (event.key === "ArrowUp") {
        graph.navigateUp();
        highlightAndMove(graph, highlight);
      } else if (event.key === "ArrowLeft") {
        graph.navigateLeft();
        highlightAndMove(graph, highlight);
      } else if (event.key === "ArrowRight") {
        graph.navigateRight();
        highlightAndMove(graph, highlight);
      } else if (event.key === "Enter") {
        const selectedNode = graph.getSelectedNodes()[0];
        console.log(selectedNode);
        setSelectedObject(selectedNode);
      } else if (event.key === "Escape") {
        setSelectedObject(null);
        clearHighlight(highlight);
      }

      //  key to show performance
      //   commando .
      else if (event.metaKey && event.key === ".") {
        drawPerformanceInfo(app);
      }
    });

    let cursorTimer = setTimeout(null, 0);
    //Hit-test the cursor against the nodes and edges
    viewport.on("pointerdown", (e) => {
      //animate the cursor
      clickAnimation(cursor, e);

      const { x, y } = e.data.getLocalPosition(viewport);
      //move cursor to the position of the click
      clearTimeout(cursorTimer);
      cursorTimer = setTimeout(() => {
        // fadeOut(cursor);
        cursor.visible = false;
      }, 1000);
      cursor.x = x;
      cursor.y = y;
      cursor.visible = true;
      const hit = graph.hitTest(x, y);
      if (hit?.node) {
        // if we hit a node, select it
        graph.selectNode(hit.node);
        // highlight the node
        highLightNode(hit.node, highlight);
      } else {
        graph.deselectAllNodes();
        highlight.visible = false;
      }
    });
  }

  /**
   * Highlight all selected nodes in the graph and move the viewport to the first one
   * @param graph
   * @param highlight
   */
  function highlightAndMove(graph: Graph, highlight: PIXI.Graphics) {
    // Highlight all selected nodes
    const selectedNodes = graph.getSelectedNodes();
    selectedNodes.forEach((node) => {
      highLightNode(node, highlight);
    });
    if (selectedNodes.length > 0) {
      // Move the viewport to the first selected node
      const firstSelectedNode = selectedNodes[0];
      if (firstSelectedNode) {
        viewport.animate({
          position: new Point(
            firstSelectedNode.position.x + firstSelectedNode.width / 2,
            firstSelectedNode.position.y + firstSelectedNode.height / 2
          ),
          time: 500,
          ease: "easeOutQuad",
        });
      }
    }
  }

  function clearHighlight(highlight: PIXI.Graphics) {
    highlight.visible = false;
  }

  /**
   * Highlight a node
   * @param node - node to be highlighted
   * @param highlight - PIXI highlight circle
   */
  function highLightNode(node: GraphNode, highlight: PIXI.Graphics) {
    const highlightDiameter = Math.max(node.width, node.height) * 1.5;

    highlight.width = highlightDiameter;
    highlight.height = highlightDiameter;

    highlight.x = node.position.x + node.width / 2;
    highlight.y = node.position.y + node.height / 2;
    highlight.visible = true;
  }

  const endTime = performance.now();
  console.log(`Graph rendering took ${endTime - startTime} ms`);
}

function highlightEdges(edges: GraphEdge[], viewport: Viewport) {
  edges.forEach((edge) => {
    edge.highlighted = true;
  });
  // drawGraphEdges(edges, viewport);
}

function unHighlightEdges(edges: GraphEdge[], viewport: Viewport) {
  edges.forEach((edge) => {
    edge.highlighted = false;
  });
  // drawGraphEdges(edges, viewport);
}

function clickAnimation(
  cursor: PIXI.Graphics,
  e: { data: { originalEvent: { buttons: number } } }
): void {
  const cursorAnimation = new PIXI.Ticker();
  cursorAnimation.autoStart = true;
  cursorAnimation.start();
  cursorAnimation.add((delta) => {
    // scale with Bézier curve
    const scale = 1 + Math.sin(delta * 10) * 0.1;
    cursor.scale.set(scale, scale);

    // stop the animation when the cursor is released
    if (e.data.originalEvent.buttons === 0) {
      cursorAnimation.stop();
      //reset the cursor
      cursor.scale.x = 1;
      cursor.scale.y = 1;
    }
  });
}

/**
 * Create a new cursor
 * @param color
 * @returns {PIXI.Graphics} cursor
 */
function newCursor(color: number): PIXI.Graphics {
  const cursor = new PIXI.Graphics();
  cursor.beginFill(color, 0.5);
  cursor.drawCircle(0, 0, 10);
  cursor.endFill();
  return cursor;
}

function drawCardPalette(stage: PIXI.Container, graph: Graph): void {
  // draw a box with rounded corners
  const cardPalette = new PIXI.Graphics();
  cardPalette.beginFill(0, 1);
  cardPalette.drawRoundedRect(0, 0, 40 * 5 + 10, 50, 10);
  cardPalette.endFill();
  cardPalette.x = 10;
  cardPalette.y = 10;
  stage.addChild(cardPalette);

  // small white card
  const placeholderCard = createPlaceholderCard(
    new Point(cardPalette.x + 10, cardPalette.y + 10),
    graph,
    stage
  );
  const placeholderCard2 = createPlaceholderCard(
    new Point(
      placeholderCard.x + placeholderCard.width + 10,
      placeholderCard.y
    ),
    graph,
    stage
  );

  const placeholderCard3 = createPlaceholderCard(
    new Point(
      placeholderCard2.x + placeholderCard2.width + 10,
      placeholderCard2.y
    ),
    graph,
    stage
  );

  const placeholderCard4 = createPlaceholderCard(
    new Point(
      placeholderCard3.x + placeholderCard3.width + 10,
      placeholderCard3.y
    ),
    graph,
    stage
  );

  const placeholderCard5 = createPlaceholderCard(
    new Point(
      placeholderCard4.x + placeholderCard4.width + 10,
      placeholderCard4.y
    ),
    graph,
    stage
  );
  stage.addChild(
    placeholderCard,
    placeholderCard2,
    placeholderCard3,
    placeholderCard4,
    placeholderCard5
  );

  // draggable
  // placeholderCard.interactive = true;
  // placeholderCard.
}

function createPlaceholderCard(
  position: Point,
  graph: Graph,
  stage
): PIXI.Graphics {
  const placeholderCard = new PIXI.Graphics();
  placeholderCard.beginFill(0xffffff, 1);
  placeholderCard.drawRoundedRect(0, 0, 30, 30, 10);
  placeholderCard.endFill();
  placeholderCard.interactive = true;
  placeholderCard.x = position.x;
  placeholderCard.y = position.y;

  const dragStartPosition: Point = position;
  let moving = false;
  // drag listener
  placeholderCard.on("pointerdown", () => (moving = true));
  placeholderCard.on("pointermove", (e) => {
    if (moving) {
      // viewport position
      const { x, y } = e.data.getLocalPosition(stage);
      // const newPosition = e.data.getLocalPosition(placeholderCard.parent);
      placeholderCard.x = x - placeholderCard.width / 2;
      placeholderCard.y = y - placeholderCard.height / 2;
      const { node, edge } = graph.hitTest(
        placeholderCard.x,
        placeholderCard.y
      );
      console.log({ node, edge });
    }
  });
  placeholderCard.on("pointerup", () => {
    const { node, edge } = graph.hitTest(placeholderCard.x, placeholderCard.y);
    console.log({ node, edge });

    moving = false;
    placeholderCard.x = dragStartPosition.x;
    placeholderCard.y = dragStartPosition.y;
  });

  return placeholderCard;
}
