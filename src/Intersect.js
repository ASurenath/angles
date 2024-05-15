import React, { useEffect, useRef, useState } from "react";
import { Col, Form, InputGroup, Row } from "react-bootstrap";

function Intersect() {
  const svgBox = useRef(null);
  const outerBox = useRef(null);
  const [boxWidth, setBoxWidth] = useState(1);
  const [boxHeight, setBoxHeight] = useState(1);
  const [unit, setUnit] = useState(1);
  const [angle, setAngle] = useState(45);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [ySign, setYSign] = useState(1);
  useEffect(() => {
    setX(Math.cos((angle * Math.PI) / 180));
    setY(Math.sin((angle * Math.PI) / 180));
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
  console.log(ySign);
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
        } else {
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
      // else if(Math.abs(
      //   Math.floor(
      //     (180 *
      //       Math.atan((50 * unit - cursorY) / (cursorX - 50 * unit))) /
      //       Math.PI
      //   )
      // )==0 || Math.abs(
      //   Math.floor(
      //     (180 *
      //       Math.atan((50 * unit - cursorY) / (cursorX - 50 * unit))) /
      //       Math.PI
      //   )
      // ==180)){
      //   if((cursorX-50*unit)>0){
      //       if(ySign>0){
      //       setAngle(0);
      //       }
      //       else{
      //       setAngle(180);
      //       }
      //   }
      //   else if ((cursorX-50*unit)<0){
      //       if(ySign>0){
      //       setAngle(180);
      //       }
      //       else{
      //       setAngle(0);
      //       }
      //   }
      // }
      console.log(
        Math.floor(
          (180 * Math.atan((50 * unit - cursorY) / (cursorX - 50 * unit))) /
            Math.PI
        ),
        180 +
          Math.floor(
            (180 * Math.atan((50 * unit - cursorY) / (cursorX - 50 * unit))) /
              Math.PI
          )
      );
      console.log(svgRect.left, svgRect.top, cursorX, cursorY);
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
              x1={`${10 * unit}px`}
              y1={`${50 * unit}px`}
              x2={`${90 * unit}px`}
              y2={`${50 * unit}px`}
              stroke="black"
              strokeWidth="5"
            />
            <line
              id="line2"
              x1={`${(50 - x * 40) * unit}px`}
              y1={`${(50 + y * 40) * unit}px`}
              x2={`${(50 + x * 40) * unit}px`}
              y2={`${(50 - y * 40) * unit}px`}
              stroke="black"
              strokeWidth="5"
              cursor={dragging ? "grabbing" : "grab"}
              onMouseDown={(e) => handleSetDragging(e)}
              onTouchStart={(e) => handleSetDragging(e)}
            />
            <path
              id="angleA"
              d={`M ${(50 + 4 * x) * unit} ${(50 - y * 4) * unit} a ${
                4 * unit
              } ${4 * unit} 0 0 1  ${(1 - x) * 4 * unit} ${4 * y * unit}`}
              stroke="blue"
              strokeWidth="4"
              fill="none"
            />
            <path
              id="angleB"
              d={`M ${(50 - 4.5 * x) * unit} ${(50 + y * 4.5) * unit} a ${
                4.5 * unit
              } ${4.5 * unit} 0 0 1  ${-(1 - x) * 4.5 * unit} ${
                -(4.5 * y) * unit
              }`}
              stroke="blue"
              strokeWidth="4"
              fill="none"
            />

            <path
              id="angleC"
              d={`M ${(50 - 5.5) * unit} ${50 * unit} a ${-5.5 * unit} ${
                -5.5 * unit
              } 0 0 1  ${(x + 1) * 5.5 * unit} ${-5.5 * y * unit}`}
              stroke="green"
              strokeWidth="4"
              fill="none"
            />
            <path
              id="angleD"
              d={`M ${(50 + 5) * unit} ${50 * unit} a ${-5 * unit} ${
                -5 * unit
              } 0 0 1  ${-(x + 1) * 5 * unit} ${5 * y * unit}`}
              stroke="green"
              strokeWidth="4"
              fill="none"
            />

            <text
              id="angleAText"
              x={`${(50 + Math.cos((angle * Math.PI) / 360) * 8) * unit}`}
              y={`${(50 - Math.sin((angle * Math.PI) / 360) * 8) * unit}`}
              alignmentBaseline="middle"
              textAnchor="middle"
              fontSize={Math.max(10, 3 * unit)}
              fill="blue"
            >
              {angle}°
            </text>

            <text
              id="textA"
              x={`${(50 + Math.cos((angle * Math.PI) / 360) * 12) * unit}`}
              y={`${(50 - Math.sin((angle * Math.PI) / 360) * 12) * unit}`}
              alignmentBaseline="middle"
              textAnchor="middle"
              fontSize={Math.max(10, 3 * unit)}
              fill="blue"
            >
              A
            </text>
            <text
              id="angleCText"
              x={`${(50 - Math.cos((angle * Math.PI) / 360) * 7) * unit}`}
              y={`${(50 + Math.sin((angle * Math.PI) / 360) * 7) * unit}`}
              alignmentBaseline="middle"
              textAnchor="middle"
              fontSize={Math.max(10, 3 * unit)}
              fill="blue"
            >
              {angle}°
            </text>
            <text
              id="textC"
              x={`${(50 - Math.cos((angle * Math.PI) / 360) * 12) * unit}`}
              y={`${(50 + Math.sin((angle * Math.PI) / 360) * 12) * unit}`}
              alignmentBaseline="middle"
              textAnchor="middle"
              fontSize={Math.max(10, 3 * unit)}
              fill="blue"
            >
              C
            </text>
            <text
              id="angleBText"
              x={`${
                (50 - Math.cos(((180 - angle) * Math.PI) / 360) * 7) * unit
              }`}
              y={`${
                (50 - Math.sin(((180 - angle) * Math.PI) / 360) * 7) * unit
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
                (50 - Math.cos(((180 - angle) * Math.PI) / 360) * 12) * unit
              }`}
              y={`${
                (50 - Math.sin(((180 - angle) * Math.PI) / 360) * 12) * unit
              }`}
              alignmentBaseline="middle"
              textAnchor="middle"
              fontSize={Math.max(10, 3 * unit)}
              fill="green"
            >
              B
              
            </text>
            <text
              id="angleDText"
              x={`${
                (50 + Math.cos(((180 - angle) * Math.PI) / 360) * 7) * unit
              }`}
              y={`${
                (50 + Math.sin(((180 - angle) * Math.PI) / 360) * 7) * unit
              }`}
              alignmentBaseline="middle"
              textAnchor="middle"
              fontSize={Math.max(10, 3 * unit)}
              fill="green"
            >
              {180 - angle}°
            </text>
            <text
              id="textD"
              x={`${
                (50 + Math.cos(((180 - angle) * Math.PI) / 360) * 12) * unit
              }`}
              y={`${
                (50 + Math.sin(((180 - angle) * Math.PI) / 360) * 12) * unit
              }`}
              alignmentBaseline="middle"
              textAnchor="middle"
              fontSize={Math.max(10, 3 * unit)}
              fill="green"
            >
              D
            </text>
          </svg>
        </div>
      </Col>
      <Col
        md={4}
        className="d-flex flex-column justify-content-center align-items-center"
      >
        <div className="d-flex justify-content-evenly align-items-center w-100 p-3 p-lg-5">
          <label for="angleA-input">Angle A:</label>
          <input
            type="range"
            name=""
            id="angleA-input"
            className="form-range w-50"
            value={angle}
            onChange={(e) => setAngle(e.target.value)}
            min="0"
            max="180"
          />
          <InputGroup controlId="angle-input" className="w-25">
            <Form.Control
              type="number"
              value={angle}
              onChange={(e) => {
                if (e.target.value >= 0 && e.target.value <= 180) {
                  setAngle(e.target.value);
                }
              }}
              min={0}
              max={180}
            />
            <InputGroup.Text>°</InputGroup.Text>
          </InputGroup>
        </div>
        <div className="d-flex justify-content-evenly align-items-center w-100 p-3 p-lg-5">
          <label for="angleA-input">Angle B:</label>
          <input
            type="range"
            name=""
            id="angleA-input"
            className="form-range w-50"
            value={180-angle}
            onChange={(e) => setAngle(180-e.target.value)}
            min="0"
            max="180"
          />
          <InputGroup controlId="angle-input" className="w-25">
            <Form.Control
              type="number"
              value={180 - angle}
              onChange={(e) => {
                if (e.target.value >= 0 && e.target.value <= 180) {
                  setAngle(180-e.target.value);
                }
              }}
              min={0}
              max={180}
            />
            <InputGroup.Text>°</InputGroup.Text>
          </InputGroup>
        </div>
      </Col>
    </Row>
  );
}

export default Intersect;
