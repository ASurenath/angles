import React, { useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";

function Parallel() {
  const svgBox = useRef(null);
  const outerBox = useRef(null);
  const [boxWidth, setBoxWidth] = useState(1);
  const [boxHeight, setBoxHeight] = useState(1);
  const [unit, setUnit] = useState(1);
  const [angle, setAngle] = useState(45);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [dX, setDX] = useState(0);
  const [d, setD] = useState(10);
  const [dragging, setDragging] = useState(false);
  const [ySign, setYSign] = useState(1);

  useEffect(() => {
    setX(Math.cos((angle * Math.PI) / 180));
    setY(Math.sin((angle * Math.PI) / 180));
    setDX(d / Math.tan((angle * Math.PI) / 180));
  }, [angle]);

  useEffect(() => {
    const updateBoxDimensions = () => {
      // Update box width and height
      setBoxWidth(outerBox.current.getBoundingClientRect().width);
      setBoxHeight(outerBox.current.getBoundingClientRect().height);
      setUnit(
        Math.min(
          outerBox.current.getBoundingClientRect().width / 100,
          outerBox.current.getBoundingClientRect().height / 100
        )
      );
    };

    updateBoxDimensions();
    window.addEventListener("resize", updateBoxDimensions);
    return () => {
      window.removeEventListener("resize", updateBoxDimensions);
    };
  }, [outerBox]);
  console.log("dragging", dragging);
  // console.log(svgBox.current.getBoundingClientRect().width);
  const handleSetDragging = (e) => {
    setDragging(true);
    let startX, startY;
    const svgRect = svgBox.current.getBoundingClientRect();
    if (e.type === "mousedown") {
      e.preventDefault();
      startX = e.clientX - svgRect.left;
      startY = e.clientY - svgRect.top;
    } else if (e.type === "touchstart") {
      startX = e.changedTouches[0].clientX - svgRect.left;
      startY = e.changedTouches[0].clientY - svgRect.top;
    }
    if (startY > 50 * unit) {
      setYSign(-1);
    } else if (startY < 50 * unit) {
      setYSign(1);
    } else {
      if (startX < 50 * unit) {
        setYSign(1);
      } else {
        setYSign(-1);
      }
    }
  };
  const handleDrag = (e) => {
    // e.preventDefault()
    if (dragging) {
      let cursorX, cursorY;
      const svgRect = svgBox.current.getBoundingClientRect();
      if (e.type === "mousemove") {
        e.preventDefault();

        cursorX = e.clientX - svgRect.left;
        cursorY = e.clientY - svgRect.top;
      } else if (e.type === "touchmove") {
        cursorX = e.changedTouches[0].clientX - svgRect.left;
        cursorY = e.changedTouches[0].clientY - svgRect.top;
      }
      if (
        (50 * unit - cursorY > 0 && ySign > 0) ||
        (50 * unit - cursorY < 0 && ySign < 0)
      ) {
        if (
          (180 * Math.atan((50 * unit - cursorY) / (cursorX - 50 * unit))) /
            Math.PI <
          0
        ) {
          setAngle(
            180 +
              Math.floor(
                (180 *
                  Math.atan((50 * unit - cursorY) / (cursorX - 50 * unit))) /
                  Math.PI
              )
          );
        } else if (
          (180 * Math.atan((50 * unit - cursorY) / (cursorX - 50 * unit))) /
            Math.PI >
          0
        ) {
          setAngle(
            Math.abs(
              Math.floor(
                (180 *
                  Math.atan((50 * unit - cursorY) / (cursorX - 50 * unit))) /
                  Math.PI
              )
            )
          );
        }
      }
      //   console.log(
      //     Math.floor(
      //       (180 * Math.atan((50 * unit - cursorY) / (cursorX - 50 * unit))) /Math.PI
      //     ),
      //     180+Math.floor(
      //       (180 * Math.atan((50 * unit - cursorY) / (cursorX - 50 * unit))) /Math.PI
      //     )
      //   );
      //   console.log(svgRect.left, svgRect.top, cursorX, cursorY);
    }
  };
  return (
    <Row className="w-100">
      <Col md={8}>
        <div className="angle-main" ref={outerBox}>
          <svg
            width={boxWidth}
            xmlns="http://www.w3.org/2000/svg"
            ref={svgBox}
            className="angle-svg"
            cursor={dragging ? "grabbing" : "default"}
            onMouseUp={() => setDragging(false)}
            onTouchEnd={() => setDragging(false)}
            onMouseMove={(e) => handleDrag(e)}
            onTouchMove={(e) => handleDrag(e)}
          >
            <line
              id="line1"
              x1={`${0 * unit}px`}
              y1={`${60 * unit}px`}
              x2={`${100 * unit}px`}
              y2={`${60 * unit}px`}
              stroke="black"
              strokeWidth="5"
            />
            <line
              id="line2"
              x1={`${0 * unit}px`}
              y1={`${40 * unit}px`}
              x2={`${100 * unit}px`}
              y2={`${40 * unit}px`}
              stroke="black"
              strokeWidth="5"
            />
            <line
              id="line3"
              x1={`${(50 - x * 50) * unit}px`}
              y1={`${(50 + y * 50) * unit}px`}
              x2={`${(50 + x * 50) * unit}px`}
              y2={`${(50 - y * 50) * unit}px`}
              stroke="black"
              strokeWidth="5"
              cursor={dragging ? "grabbing" : "grab"}
              onMouseDown={(e) => handleSetDragging(e)}
              onTouchStart={(e) => handleSetDragging(e)}
            />
            {angle != 0 && (
              <>
                <path
                  id="angleA"
                  d={`M ${(50 + dX + 4 * x) * unit} ${
                    (50 - y * 4 - d) * unit
                  } a ${4 * unit} ${4 * unit} 0 0 1  ${(1 - x) * 4 * unit} ${
                    4 * y * unit
                  }`}
                  stroke="blue"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  id="angleE"
                  d={`M ${(50 - dX + 4 * x) * unit} ${
                    (50 - y * 4 + d) * unit
                  } a ${4 * unit} ${4 * unit} 0 0 1  ${(1 - x) * 4 * unit} ${
                    4 * y * unit
                  }`}
                  stroke="blue"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  id="angleC"
                  d={`M ${(50 + dX - 4.5 * x) * unit} ${
                    (50 - d + y * 4.5) * unit
                  } a ${4.5 * unit} ${4.5 * unit} 0 0 1  ${
                    -(1 - x) * 4.5 * unit
                  } ${-(4.5 * y) * unit}`}
                  stroke="blue"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  id="angleG"
                  d={`M ${(50 - dX - 4.5 * x) * unit} ${
                    (50 + d + y * 4.5) * unit
                  } a ${4.5 * unit} ${4.5 * unit} 0 0 1  ${
                    -(1 - x) * 4.5 * unit
                  } ${-(4.5 * y) * unit}`}
                  stroke="blue"
                  strokeWidth="4"
                  fill="none"
                />

                <path
                  id="angleB"
                  d={`M ${(50 + dX - 5.5) * unit} ${(50 - d) * unit} a ${
                    -5.5 * unit
                  } ${-5.5 * unit} 0 0 1  ${(x + 1) * 5.5 * unit} ${
                    -5.5 * y * unit
                  }`}
                  stroke="green"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  id="angleF"
                  d={`M ${(50 - dX - 5.5) * unit} ${(50 + d) * unit} a ${
                    -5.5 * unit
                  } ${-5.5 * unit} 0 0 1  ${(x + 1) * 5.5 * unit} ${
                    -5.5 * y * unit
                  }`}
                  stroke="green"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  id="angleD"
                  d={`M ${(50 + dX + 5) * unit} ${(50 - d) * unit} a ${
                    -5 * unit
                  } ${-5 * unit} 0 0 1  ${-(x + 1) * 5 * unit} ${5 * y * unit}`}
                  stroke="green"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  id="angleH"
                  d={`M ${(50 - dX + 5) * unit} ${(50 + d) * unit} a ${
                    -5 * unit
                  } ${-5 * unit} 0 0 1  ${-(x + 1) * 5 * unit} ${5 * y * unit}`}
                  stroke="green"
                  strokeWidth="4"
                  fill="none"
                />

                <text
                  id="angleAText"
                  x={`${
                    (50 + dX + Math.cos((angle * Math.PI) / 360) * 8) * unit
                  }`}
                  y={`${
                    (50 - d - Math.sin((angle * Math.PI) / 360) * 8) * unit
                  }`}
                  alignmentBaseline="middle"
                  textAnchor="middle"
                  fontSize={Math.max(10, 3 * unit)}
                  fill="blue"
                >
                  {angle}°
                </text>
                <text
                  id="textA"
                  x={`${
                    (50 + dX + Math.cos((angle * Math.PI) / 360) * 12) * unit
                  }`}
                  y={`${
                    (50 - d - Math.sin((angle * Math.PI) / 360) * 12) * unit
                  }`}
                  alignmentBaseline="middle"
                  textAnchor="middle"
                  fontSize={Math.max(10, 2 * unit)}
                  fill="blue"
                >
                  A
                </text>
                <text
                  id="angleEText"
                  x={`${
                    (50 - dX + Math.cos((angle * Math.PI) / 360) * 6) * unit
                  }`}
                  y={`${
                    (50 + d - Math.sin((angle * Math.PI) / 360) * 6) * unit
                  }`}
                  alignmentBaseline="middle"
                  textAnchor="middle"
                  fontSize={Math.max(10, 3 * unit)}
                  fill="blue"
                >
                  {angle}°
                </text>
                <text
                  id="textE"
                  x={`${
                    (50 - dX + Math.cos((angle * Math.PI) / 360) * 10) * unit
                  }`}
                  y={`${
                    (50 + d - Math.sin((angle * Math.PI) / 360) * 10) * unit
                  }`}
                  alignmentBaseline="middle"
                  textAnchor="middle"
                  fontSize={Math.max(10, 2 * unit)}
                  fill="blue"
                >
                  E
                </text>
                <text
                  id="angleCText"
                  x={`${
                    (50 + dX - Math.cos((angle * Math.PI) / 360) * 7) * unit
                  }`}
                  y={`${
                    (50 - d + Math.sin((angle * Math.PI) / 360) * 7) * unit
                  }`}
                  alignmentBaseline="middle"
                  textAnchor="middle"
                  fontSize={Math.max(10, 3 * unit)}
                  fill="blue"
                >
                  {angle}°
                </text>
                <text
                  id="textC"
                  x={`${
                    (50 + dX - Math.cos((angle * Math.PI) / 360) * 10) * unit
                  }`}
                  y={`${
                    (50 - d + Math.sin((angle * Math.PI) / 360) * 10) * unit
                  }`}
                  alignmentBaseline="middle"
                  textAnchor="middle"
                  fontSize={Math.max(10, 2 * unit)}
                  fill="blue"
                >
                  C
                </text>
                <text
                  id="angleGText"
                  x={`${
                    (50 - dX - Math.cos((angle * Math.PI) / 360) * 7) * unit
                  }`}
                  y={`${
                    (50 + d + Math.sin((angle * Math.PI) / 360) * 7) * unit
                  }`}
                  alignmentBaseline="middle"
                  textAnchor="middle"
                  fontSize={Math.max(10, 3 * unit)}
                  fill="blue"
                >
                  {angle}°
                </text>
                <text
                  id="textG"
                  x={`${
                    (50 - dX - Math.cos((angle * Math.PI) / 360) * 10) * unit
                  }`}
                  y={`${
                    (50 + d + Math.sin((angle * Math.PI) / 360) * 10) * unit
                  }`}
                  alignmentBaseline="middle"
                  textAnchor="middle"
                  fontSize={Math.max(10, 2 * unit)}
                  fill="blue"
                >
                  G
                </text>
                <text
                  id="angleBText"
                  x={`${
                    (50 + dX - Math.cos(((180 - angle) * Math.PI) / 360) * 7) *
                    unit
                  }`}
                  y={`${
                    (50 - d - Math.sin(((180 - angle) * Math.PI) / 360) * 7) *
                    unit
                  }`}
                  alignmentBaseline="middle"
                  textAnchor="middle"
                  fontSize={Math.max(10, 3 * unit)}
                  fill="green"
                >
                  {180 - angle}°
                </text>
                <text
                  id="angleFText"
                  x={`${
                    (50 - dX - Math.cos(((180 - angle) * Math.PI) / 360) * 7) *
                    unit
                  }`}
                  y={`${
                    (50 + d - Math.sin(((180 - angle) * Math.PI) / 360) * 7) *
                    unit
                  }`}
                  alignmentBaseline="middle"
                  textAnchor="middle"
                  fontSize={Math.max(10, 3 * unit)}
                  fill="green"
                >
                  {180 - angle}°
                </text>
                <text
                  id="angleDText"
                  x={`${
                    (50 + dX + Math.cos(((180 - angle) * Math.PI) / 360) * 7) *
                    unit
                  }`}
                  y={`${
                    (50 - d + Math.sin(((180 - angle) * Math.PI) / 360) * 7) *
                    unit
                  }`}
                  alignmentBaseline="middle"
                  textAnchor="middle"
                  fontSize={Math.max(10, 3 * unit)}
                  fill="green"
                >
                  {180 - angle}°
                </text>
                <text
                  id="angleHText"
                  x={`${
                    (50 - dX + Math.cos(((180 - angle) * Math.PI) / 360) * 7) *
                    unit
                  }`}
                  y={`${
                    (50 + d + Math.sin(((180 - angle) * Math.PI) / 360) * 7) *
                    unit
                  }`}
                  alignmentBaseline="middle"
                  textAnchor="middle"
                  fontSize={Math.max(10, 3 * unit)}
                  fill="green"
                >
                  {180 - angle}°
                </text>
              </>
            )}
          </svg>
        </div>
      </Col>
      <Col
        md={4}
        className="d-flex flex-column justify-content-center align-items-center"
      >
        <input
          type="range"
          name=""
          value={angle}
          onChange={(e) => setAngle(e.target.value)}
          min="0"
          max="180"
          id=""
        />
      </Col>
    </Row>
  );
}

export default Parallel;
