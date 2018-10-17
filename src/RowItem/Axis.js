import { normalizePositionByRangeLength } from "ve-range-utils";
// import { onlyUpdateForKeys } from "recompose";
import getXStartAndWidthOfRangeWrtRow from "./getXStartAndWidthOfRangeWrtRow";
import React from "react";
import calculateTickMarkPositionsForGivenRange from "../utils/calculateTickMarkPositionsForGivenRange";
import pureNoFunc from "../utils/pureNoFunc";

// import getXCenterOfRowAnnotation from "./getXCenterOfRowAnnotation";

let Axis = function(props) {
  let {
    row,
    tickSpacing,
    bpsPerRow,
    charWidth,
    annotationHeight,
    sequenceLength,
    showAxisNumbers = true,
    getGaps
  } = props;
  if (row.start === 0 && row.end === 0) {
    return null;
  }
  let { xStart, width } = getXStartAndWidthOfRangeWrtRow(
    row,
    row,
    bpsPerRow,
    charWidth,
    sequenceLength,
    ...(getGaps ? [getGaps(row).gapsBefore, getGaps(row).gapsInside] : [])
  );
  //this function should take in a desired tickSpacing (eg 10 bps between tick mark)
  //and output an array of tickMarkPositions for the given row (eg, [0, 10, 20])
  let xEnd = xStart + width;

  let yStart = 0;
  let tickMarkPositions = calculateTickMarkPositionsForGivenRange({
    tickSpacing,
    range: row,
    sequenceLength
  });
  let tickMarkSVG = [];

  tickMarkPositions.forEach(function(tickMarkPosition, i) {
    // var xCenter = getXCenterOfRowAnnotation({
    //     start: tickMarkPosition,
    //     end: tickMarkPosition
    // }, row, bpsPerRow, charWidth, sequenceLength);
    let xCenter =
      (tickMarkPosition +
        (getGaps ? getGaps(tickMarkPosition).gapsBefore : 0)) *
        charWidth +
      charWidth / 2;
    let yStart = 0;
    let yEnd = annotationHeight / 3;
    tickMarkSVG.push(
      <path
        key={"axisTickMarkPath " + i + " " + tickMarkPosition}
        d={"M" + xCenter + "," + yStart + " L" + xCenter + "," + yEnd}
        stroke={"black"}
      />
    );
    if (showAxisNumbers) {
      const position =
        normalizePositionByRangeLength(
          row.start + tickMarkPosition,
          sequenceLength
        ) + 1;

      const positionLength = position.toString().length * 4;

      tickMarkSVG.push(
        <text
          key={"axisTickMarkText " + i + " " + tickMarkPosition}
          stroke={"black"}
          x={
            i === 0 //if first label in row, or last label in row, we add checks to make sure the axis number labels don't go outside of the width of the row
              ? Math.max(positionLength, xCenter)
              : i === tickMarkPositions.length - 1
                ? Math.min(bpsPerRow * charWidth - positionLength, xCenter)
                : xCenter
          }
          y={annotationHeight}
          style={{ textAnchor: "middle", fontSize: 10, fontFamily: "Verdana" }}
        >
          {position}
        </text>
      );
    }
  });

  return (
    <svg
      className="veRowViewAxis veAxis"
      width="100%"
      height={annotationHeight * 1.2}
      style={{ marginTop: 3, overflow: "visible", display: "block" }}
    >
      {tickMarkSVG}
      <path
        d={"M" + xStart + "," + yStart + " L" + xEnd + "," + yStart}
        stroke={"black"}
      />
    </svg>
  );
};

// export default Axis
// export default Axis
export default pureNoFunc(Axis);