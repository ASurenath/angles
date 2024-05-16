import React, { useEffect, useRef, useState } from "react";
import { Col, Form, InputGroup, Row } from "react-bootstrap";

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
  const [d, setD] = useState(12);
  const [dragging, setDragging] = useState(false);
  const [ySign, setYSign] = useState(1);
  const [r, setR] = useState(10);

  useEffect(() => {
    setX(Math.cos((angle * Math.PI) / 180));
    setY(Math.sin((angle * Math.PI) / 180));
    setDX(d / Math.tan((angle * Math.PI) / 180));
  }, [angle, d]);

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
  console.log(d);
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
      <Col
        xl={4}
        className="d-flex flex-xl-column flex-lg-row flex-md-row  flex-column  justify-content-center align-items-start"
      >
        <div className="d-flex justify-content-evenly align-items-center w-100 p-3 p-lg-5">
          <label for="angle-input">Angle A :</label>
          <input
            type="range"
            name=""
            id="angle-input"
            className="form-range w-50"
            value={angle}
            onChange={(e) => setAngle(e.target.value)}
            min="0"
            max="180"
          />
          <InputGroup controlId="angle-input" className="w-25">
            <Form.Control
              type="number"
              className="p-0 text-center"
              value={angle}
              onChange={(e) => {
                if (e.target.value >= 0 && e.target.value <= 360) {
                  setAngle(e.target.value);
                }
              }}
              min={0}
              max={359}
            />
            <InputGroup.Text>°</InputGroup.Text>
          </InputGroup>
        </div>
        <div className="d-flex justify-content-evenly align-items-center w-100 p-3 p-lg-5">
          <label for="angle-input">Distance :</label>
          <input
            type="range"
            name=""
            id="angle-input"
            className="form-range w-50"
            value={d}
            onChange={(e) => setD(parseInt(e.target.value))}
            min={8}
            max={40}
          />
          <InputGroup controlId="angle-input" className="w-25 dummy invisible">
            <Form.Control
              type="number"
              className="p-0 text-center "
              min={0}
              max={359}
            />
            <InputGroup.Text>°</InputGroup.Text>
          </InputGroup>
        </div>
      </Col>
      <Col xl={8}>
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
          
            <path
              id="highlightA"
              d={`M ${(50 +dX+ x * r) * unit},${(50-d - y * r) * unit} 
              L ${(50+dX) * unit},${(50-d) * unit}
               L ${(50+dX+r) * unit},${(50-d) * unit} 
               A ${r * unit} ${ r * unit} 0 0 0 ${(50+dX + x * r) * unit},${(50 -d- y * r) * unit} Z`}
              fill="pink"
            />
            <path
              id="highlightB"
              d={`M ${(50+dX-r) * unit},${(50-d) * unit} 
              L ${(50+dX) * unit},${(50-d) * unit} 
              L ${(50+dX + x * r) * unit},${(50-d - y * r) * unit}
               A ${r * unit} ${r * unit} 0 0 0 ${
                (50+dX-r) * unit
              },${(50-d) * unit} Z`}
              fill="lightgreen"
            />
            <path
              id="highlightC"
              d={`M ${(50 +dX- x * r) * unit},${(50-d + y * r) * unit} L ${
                (50+dX) * unit
              },${(50-d) * unit} L ${(50+dX-r) * unit},${(50-d) * unit} A ${r * unit} ${
                r * unit
              } 0 0 0 ${(50+dX - x * r) * unit},${(50-d + y * r) * unit} Z`}
              fill="pink"
            />
            <path
              id="highlightD"
              d={`M ${(50+dX+r) * unit},${(50-d) * unit} L ${(50+dX) * unit},${(50-d) * unit} L ${
                (50+dX - x * r) * unit
              },${(50-d + y * r) * unit} A ${r * unit} ${r * unit} 0 0 0 ${
                (50+dX+r) * unit
              },${(50-d) * unit} Z`}
              fill="lightgreen"
            />
            


<path
              id="highlightE"
              d={`M ${(50 -dX+ x * r) * unit},${(50+d - y * r) * unit} 
              L ${(50-dX) * unit},${(50+d) * unit}
               L ${(50-dX+r) * unit},${(50+d) * unit} 
               A ${r * unit} ${ r * unit} 0 0 0 ${(50-dX + x * r) * unit},${(50 +d- y * r) * unit} Z`}
              fill="pink"
            />
            <path
              id="highlightF"
              d={`M ${(50-dX-r) * unit},${(50+d) * unit} 
              L ${(50-dX) * unit},${(50+d) * unit} 
              L ${(50-dX + x * r) * unit},${(50+d - y * r) * unit}
               A ${r * unit} ${r * unit} 0 0 0 ${
                (50-dX-r) * unit
              },${(50+d) * unit} Z`}
              fill="lightgreen"
            />
            <path
              id="highlightG"
              d={`M ${(50 -dX- x * r) * unit},${(50+d + y * r) * unit} L ${
                (50-dX) * unit
              },${(50+d) * unit} L ${(50-dX-r) * unit},${(50+d) * unit} A ${r * unit} ${
                r * unit
              } 0 0 0 ${(50-dX - x * r) * unit},${(50+d + y * r) * unit} Z`}
              fill="pink"
            />
            <path
              id="highlightH"
              d={`M ${(50-dX+r) * unit},${(50+d) * unit} L ${(50-dX) * unit},${(50+d) * unit} L ${
                (50-dX - x * r) * unit
              },${(50+d + y * r) * unit} A ${r * unit} ${r * unit} 0 0 0 ${
                (50-dX+r) * unit
              },${(50+d) * unit} Z`}
              fill="lightgreen"
            />
            
            <line
              id="line1"
              x1={`${0 * unit}px`}
              y1={`${(50 + d) * unit}px`}
              x2={`${100 * unit}px`}
              y2={`${(50 + d) * unit}px`}
              stroke="black"
              strokeWidth="5"
            />

            <line
              id="line2"
              x1={`${0 * unit}px`}
              y1={`${(50 - d) * unit}px`}
              x2={`${100 * unit}px`}
              y2={`${(50 - d) * unit}px`}
              stroke="black"
              strokeWidth="5"
            />
            <line
              id="line3"
              x1={`${(50 - x * 65) * unit}px`}
              y1={`${(50 + y * 65) * unit}px`}
              x2={`${(50 + x * 65) * unit}px`}
              y2={`${(50 - y * 65) * unit}px`}
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
                  id="textB"
                  x={`${
                    (50 + dX - Math.cos(((180 - angle) * Math.PI) / 360) * 11) *
                    unit
                  }`}
                  y={`${
                    (50 - d - Math.sin(((180 - angle) * Math.PI) / 360) * 11) *
                    unit
                  }`}
                  alignmentBaseline="middle"
                  textAnchor="middle"
                  fontSize={Math.max(10, 2 * unit)}
                  fill="green"
                >
                  B
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
                  id="angleFText"
                  x={`${
                    (50 - dX - Math.cos(((180 - angle) * Math.PI) / 360) * 10) *
                    unit
                  }`}
                  y={`${
                    (50 + d - Math.sin(((180 - angle) * Math.PI) / 360) * 10) *
                    unit
                  }`}
                  alignmentBaseline="middle"
                  textAnchor="middle"
                  fontSize={Math.max(10, 2 * unit)}
                  fill="green"
                >
                  F
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
                  id="angleDText"
                  x={`${
                    (50 + dX + Math.cos(((180 - angle) * Math.PI) / 360) * 10) *
                    unit
                  }`}
                  y={`${
                    (50 - d + Math.sin(((180 - angle) * Math.PI) / 360) * 10) *
                    unit
                  }`}
                  alignmentBaseline="middle"
                  textAnchor="middle"
                  fontSize={Math.max(10, 2 * unit)}
                  fill="green"
                >
                  D
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
                <text
                  id="angleHText"
                  x={`${
                    (50 - dX + Math.cos(((180 - angle) * Math.PI) / 360) * 7) *
                    unit
                  }`}
                  y={`${
                    (50 + d + Math.sin(((180 - angle) * Math.PI) / 360) * 10) *
                    unit
                  }`}
                  alignmentBaseline="middle"
                  textAnchor="middle"
                  fontSize={Math.max(10, 2 * unit)}
                  fill="green"
                >
                  H
                </text>
              </>
            )}
          </svg>
        </div>
      </Col>
    </Row>
  );
}

export default Parallel;
