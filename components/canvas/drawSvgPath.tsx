import type { XYPosition } from "reactflow";

export type svgLine = (
  points: XYPosition[]
) => [path: string, labelX: number, labelY: number];

/**
Finds the midpoint of a line in order to place the lines label in the correct position.
We traverse each segment (adjecent points) to make sure the midpoint is placed on a line.
If the traversed distance is half of the total distance we return the coordinates.
@param points - A list of the lines start, end and breakpoint XY coordinates
@returns [midPointX, midPointY] - the XY coordinates of the midpoint of the edge
*/
const findMidpoint = (points: XYPosition[]) => {
  let totalDistance = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    totalDistance += Math.sqrt(dx * dx + dy * dy);
  }

  let distanceSoFar = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    const segmentDistance = Math.sqrt(dx * dx + dy * dy);

    if (distanceSoFar + segmentDistance >= totalDistance / 2) {
      const remainingDistance = totalDistance / 2 - distanceSoFar;
      const proportion = remainingDistance / segmentDistance;

      const midX = points[i - 1].x + dx * proportion;
      const midY = points[i - 1].y + dy * proportion;

      return [midX, midY];
    }

    distanceSoFar += segmentDistance;
  }

  const midPointX = (points[0].x + points[points.length - 1].x) / 2;
  const midPointY = (points[0].y + points[points.length - 1].y) / 2;

  return [midPointX, midPointY];
};

export const getSvgStraightLineData: svgLine = (points) => {
  let path = "";

  for (let i = 0; i < points.length; i++) {
    const { x, y } = points[i];
    path += `${i === 0 ? "M" : "L"} ${x}, ${y} `;
  }

  const [labelX, labelY] = findMidpoint(points);

  return [path, labelX, labelY];
};
