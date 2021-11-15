import { IAnimateOptions, Viewport } from "pixi-viewport";
import { assetFactory } from "./AssetFactory";
import { Graph } from "utils/layoutEngine";
import { Process } from "interfaces/generated";
import { drawGraphEdges } from "./drawGraphEdges";
import { drawGraphNodes } from "./drawGraphNodes";
import * as PIXI from "pixi.js";
import { Point, Ticker } from "pixi.js";
import { getColor } from "utils/getColor";

/**
 * Adds the project-cards to our canvas
 * @param viewport
 * @param project
 * @param userCanEdit
 * @param dispatch
 * @param setSelectedObject
 * @param vsmObjectMutation
 */
export function addCardsToCanvas(
  viewport: Viewport,
  process: Process,
  userCanEdit: boolean,
  dispatch,
  setSelectedObject,
  vsmObjectMutation
): void {
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

    drawGraphEdges(edges, viewport);
    drawGraphNodes(nodes, setSelectedObject, viewport);

    // add a user-cursor to the canvas
    const cursor = new PIXI.Graphics();
    //Get user color
    const hexColor = getColor("HSJO@equinor.com");
    // convert hexcolor to number
    const color = parseInt(hexColor.slice(1), 16);
    cursor.beginFill(color, 0.5);
    cursor.drawCircle(0, 0, 10);
    cursor.endFill();
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
    viewport.addChild(highlight);
    highlight.visible = false;

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
    viewport.addChild(tooltipBox);
    viewport.addChild(tooltip);
    tooltipBox.visible = false;

    let lastHitTest = null;
    //Track mouse positon and update cursor position, keeping scroll position in mind
    viewport.on("mousemove", (e) => {
      const { x, y } = e.data.getLocalPosition(viewport);
      //move the cursor
      cursor.x = x;
      cursor.y = y;
      cursor.visible = true;

      //move the tooltip
      tooltipBox.x = x + 25;
      tooltipBox.y = y;
      tooltip.x = x + 30;
      tooltip.y = y + 5;

      //If hover, show a tooltip
      // Do not hittest too often (performance)
      if (Date.now() - lastHitTest > 100) {
        const hit = graph.hitTest(x, y);
        lastHitTest = Date.now();
        if (hit.node) {
          tooltip.text = hit.node.name;
          // if (e.data.originalEvent.shiftKey) {
          // delay tooltip
          tooltipBox.visible = !!tooltip.text;
          tooltip.visible = true;
          // }
          //toltipbox the size of the text
          tooltipBox.width = tooltip.width + 10;
          tooltipBox.height = tooltip.height + 10;
        } else {
          tooltip.visible = false;
          tooltipBox.visible = false;
        }
      }
    });

    viewport.on("mouseout", () => {
      cursor.visible = false;
    });

    window.addEventListener("keydown", (event) => {
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
        //highlight the selected node
        // highlightAndMove(graph, highlight);
        alert("EDIT not yet implemented");
      }
    });

    //Hittest the cursor against the nodes and edges
    viewport.on("pointerdown", (e) => {
      const { x, y } = e.data.getLocalPosition(viewport);
      const hit = graph.hitTest(x, y);
      if (hit?.node) {
        graph.selectNode(hit.node);

        // highligh the node
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
          time: 100,
          ease: "easeOutQuad",
        });
      }
    }
  }

  /**
   * Highlight a node
   * @param node - node to be highlighted
   * @param highlight - PIXI highlight circle
   */
  function highLightNode(
    node: import("/workspaces/MAD-VSM-WEB/utils/layoutEngine").GraphNode,
    highlight: PIXI.Graphics
  ) {
    const highlightDiameter = Math.max(node.width, node.height) * 1.5;

    highlight.width = highlightDiameter;
    highlight.height = highlightDiameter;

    highlight.x = node.position.x + node.width / 2;
    highlight.y = node.position.y + node.height / 2;
    highlight.visible = true;
  }
}
