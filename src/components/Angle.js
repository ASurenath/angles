import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Form, FormGroup, InputGroup, Row } from "react-bootstrap";

function Angle() {
  const svgBox = useRef(null);
  const outerBox = useRef(null);
  const [boxWidth, setBoxWidth] = useState(1);
  const [boxHeight, setBoxHeight] = useState(1);
  const [unit, setUnit] = useState(1);
  const [angle, setAngle] = useState(135);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [angleType, setAngleType] = useState("Acute");

  useEffect(() => {
    setX(Math.cos((angle * Math.PI) / 180));
    setY(Math.sin((angle * Math.PI) / 180));
    if (angle == 0) {
      setAngleType("Zero");
    }
    else if (angle < 90) {
      setAngleType("Acute");
    }  
     else if (angle == 90) {
      setAngleType("Right");
    } else if (angle > 90 && angle < 180) {
      setAngleType("Obtuse");
    } else if (angle == 180) {
      setAngleType("Straight");
    } else if (angle > 180 && angle < 360) {
      setAngleType("Reflex");
    } else if (angle == 360) {
      setAngleType("Full");
    }
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
  const handleDrag = (e) => {
    e.preventDefault()
    if (dragging) {
      let cursorX, cursorY, dy;
      const svgRect = svgBox.current.getBoundingClientRect();
      if (e.type === "mousemove") {
        // e.preventDefault();
        cursorX = e.clientX - svgRect.left;
        cursorY = e.clientY - svgRect.top;
        dy = Math.sign(e.movementY);
      } else if (e.type === "touchmove") {
        cursorX = e.changedTouches[0].clientX - svgRect.left;
        cursorY = e.changedTouches[0].clientY - svgRect.top;
        dy = Math.sign(e.changedTouches[0].movementY);
      }
      if (50 * unit - cursorY == 0) {
        if (cursorX - 50 * unit > 0) {
          if (dy > 0) {
            setAngle(0);
          } else {
            setAngle(360);
          }
        } else {
          setAngle(180);
        }
      } else if (50 * unit - cursorY < 0) {
        if (
          (180 * Math.atan((50 * unit - cursorY) / (cursorX - 50 * unit))) /
            Math.PI <
          0
        ) {
          setAngle(
            360 +
              Math.floor(
                (180 *
                  Math.atan((50 * unit - cursorY) / (cursorX - 50 * unit))) /
                  Math.PI
              )
          );
        } else {
          setAngle(
            180 +
              Math.abs(
                Math.floor(
                  (180 *
                    Math.atan((50 * unit - cursorY) / (cursorX - 50 * unit))) /
                    Math.PI
                )
              )
          );
        }
      } else {
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
    }
  };
const rotateTime=1000
const handleSetAngle = (newAngle) => {
  let oldAngle=angle
  let time = 0;
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (time >= rotateTime) {
          setAngle(newAngle);
          clearInterval(interval);
          resolve();
        } else {
          setAngle((prevAngle) => prevAngle + ((newAngle - oldAngle) * 50) / rotateTime);
          time += 50;
        }
      }, 50);
    });
}
  return (
    <Row className="w-100">
      <Col
        xl={4}
        className="d-flex flex-column justify-content-center align-items-center"
      >
        <div className="d-flex justify-content-evenly align-items-center w-100 p-3 p-lg-5">
          <label for="angle-input">Angle:</label>
          <input
            type="range"
            name=""
            id="angle-input"
            className="form-range w-50"
            value={angle}
            onChange={(e) => setAngle(e.target.value)}
            min="0"
            max="360"
          />
          <InputGroup controlId="angle-input" className="w-25">
            <Form.Control
              type="number"
              className="px-0 text-center"
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
        <div className="d-flex flex-xl-column justify-content-center align-items-center">
          <Button variant="outline-primary" onClick={() => handleSetAngle(0)} active={angleType=='Zero'} className="m-2">Zero Angle</Button>
          <Button variant="outline-primary" onClick={() => handleSetAngle(90)} active={angleType=='Right'} className="m-2">Right Angle</Button>
          <Button variant="outline-primary" onClick={() => handleSetAngle(180)} active={angleType=='Straight'} className="m-2">Straight Angle</Button>
          <Button variant="outline-primary" onClick={() => handleSetAngle(360)} active={angleType=='Full'} className="m-2">Full Angle</Button>
  
        </div>
      </Col>
      <Col xl={8}>
        <div className="angle-main" ref={outerBox}>
          <svg
            width={boxWidth}
            xmlns="http://www.w3.org/2000/svg"
            ref={svgBox}
            className="angle-svg "
            cursor={dragging ? "grabbing" : "default"}
            onMouseUp={() => setDragging(false)}
            onTouchEnd={() => setDragging(false)}
            onMouseMove={(e) => handleDrag(e)}
            onTouchMove={(e) => handleDrag(e)}
          >
            {/* Highlights */}
            {/* Lines */}
            <line
              id="line1"
              x1={`${50 * unit}px`}
              y1={`${50 * unit}px`}
              x2={`${100 * unit}px`}
              y2={`${50 * unit}px`}
              stroke="black"
              strokeWidth="5"
            />
            <line
              id="line2"
              x1={`${50 * unit}px`}
              y1={`${50 * unit}px`}
              x2={`${(50 + x * 50) * unit}px`}
              y2={`${(50 - y * 40) * unit}px`}
              stroke="black"
              strokeWidth="5"
              cursor={dragging ? "grabbing" : "grab"}
              onMouseDown={() => setDragging(true)}
              onTouchStart={() => setDragging(true)}
            />
            <line
              id="line2dummy"
              x1={`${50 * unit}px`}
              y1={`${50 * unit}px`}
              x2={`${(50 + x * 50) * unit}px`}
              y2={`${(50 - y * 40) * unit}px`}
              stroke="transparent"
              strokeWidth="50"
              cursor={dragging ? "grabbing" : "grab"}
              onMouseDown={() => setDragging(true)}
              onTouchStart={() => setDragging(true)}
            />
            
            {angle == 360 ? (
              <circle
                r={4 * unit}
                cx={50 * unit}
                cy={50 * unit}
                stroke="blue"
                strokeWidth="4"
                fill="none"
              ></circle>
            ) : angle == 90 ? (
              <path
                id="angle1"
                d={`M ${(50 + 4 * x) * unit} ${(50 - y * 4) * unit} h ${
                  4 * unit
                } v ${4 * unit}`}
                stroke="blue"
                strokeWidth="4"
                fill="none"
              />
            ) : (
              <path
                id="angle1"
                d={`M ${(50 + 4 * x) * unit} ${(50 - y * 4) * unit} a ${
                  4 * unit
                } ${4 * unit} 0 ${angle > 180 ? 1 : 0} 1  ${
                  (1 - x) * 4 * unit
                } ${4 * y * unit}`}
                stroke="blue"
                strokeWidth="4"
                fill="none"
              />
            )}

            <text
              id="angle1Text"
              x={`${(50 + Math.cos((angle * Math.PI) / 360) * 8) * unit}`}
              y={`${(50 - Math.sin((angle * Math.PI) / 360) * 8) * unit}`}
              alignmentBaseline="middle"
              textAnchor="middle"
              fontSize={Math.max(10, 3 * unit)}
              fill="blue"
            >
              {parseInt(angle)}°
            </text>
            <text
              id="angle1Text"
              x={`${(50 + Math.cos((angle * Math.PI) / 360) * 20) * unit}`}
              y={`${(50 - Math.sin((angle * Math.PI) / 360) * 20) * unit}`}
              alignmentBaseline="middle"
              textAnchor="middle"
              fontSize={Math.max(10, 3 * unit)}
              fill="blue"
            >
              {angleType} angle
            </text>
            <text
              x={35 * unit}
              y={25 * unit}
              alignmentBaseline="middle"
              textAnchor="middle"
              fontSize={Math.max(15, 3 * unit)}
              fill="blue"
              className="animated1"
            >← Drag this line
            </text>
          </svg>
        </div>
      </Col>
      
    </Row>
  );
}

export default Angle;
