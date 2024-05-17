import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  ButtonGroup,
  ButtonToolbar,
  Col,
  Form,
  InputGroup,
  Row,
  ToggleButton,
  ToggleButtonGroup,
} from "react-bootstrap";

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
  const [pairType, setPairType] = useState("Vertical");
  const [show, setShow] = useState({ angle: true, letter: true, curve: true });
  const [activeBtn, setActiveBtn] = useState("");
  const [highlight, setHighlight] = useState({
    A: false,
    B: false,
    C: false,
    D: false,
  });
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
  const angleSvg = (
    <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="15" x2="20" y2="15" stroke="blue" stroke-width="1" />
      <line x1="0" y1="15" x2="9" y2="0" stroke="blue" stroke-width="1" />
      <path
        d="M5,5 A5,5 0 0,1 10,15"
        fill="none"
        stroke="blue"
        stroke-width="1"
      />
    </svg>
  );
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
    e.preventDefault()
    if (dragging) {
      let cursorX, cursorY;
      const svgRect = svgBox.current.getBoundingClientRect();
      if (e.type === "mousemove") {
        // e.preventDefault();
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
    }
  };
  return (
    <Row className="w-100">
      <Col xl={4} md={5} className="">
        <div className="d-flex flex-md-column justify-content-start align-items-center px-2 px-lg-5">
          <div className="d-flex justify-content-evenly align-items-center w-100 p-lg-3 pt-xl-5">
            <label for="angleA-input">∠ A:</label>
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
            <Form.Control
              className="w-25 px-0 text-center"
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
            <p className="py-0 fs-3">°</p>
          </div>
          <div className="d-flex justify-content-evenly align-items-center w-100  p-lg-3">
            <label for="angleA-input">∠ B:</label>
            <input
              type="range"
              name=""
              id="angleA-input"
              className="form-range w-50"
              value={180 - angle}
              onChange={(e) => setAngle(180 - e.target.value)}
              min="0"
              max="180"
            />
            <Form.Control
              className="w-25 px-0 text-center"
              type="number"
              value={180 - angle}
              onChange={(e) => {
                if (e.target.value >= 0 && e.target.value <= 180) {
                  setAngle(180 - e.target.value);
                }
              }}
              min={0}
              max={180}
            />
            <p className="py-0 fs-3">°</p>{" "}
          </div>
        </div>
        <div className="p-2 p-lg-5">
          <h5>Highlight pairs</h5> <h3>Vertical angles:</h3>
          <p>Opposite angles in a pair of intersecting lines</p>
          <ButtonGroup>
            <Button
              variant="outline-primary"
              id="tbg-btn-1"
              value={"A and C"}
              onClick={() => {
                setHighlight({ A: true, B: false, C: true, D: false });
                setActiveBtn("A and C");
              }}
              active={activeBtn === "A and C"}
            >
              A and C
            </Button>
            <Button
              variant="outline-primary"
              id="tbg-btn-2"
              value={"B and D"}
              onClick={() => {
                setHighlight({ A: false, B: true, C: false, D: true });
                setActiveBtn("B and D");
              }}
              active={activeBtn === "B and D"}
            >
              B and D
            </Button>
          </ButtonGroup>
          <h3>Adjacent Supplementary Angles:</h3>
          <p>
            Adjacent angles share a common vertex and side. In case of
            intersecting pair of lines adjacent angles are also supplementary
            angles, i.e., they adds up to 180°
          </p>
          <ButtonGroup>
            <Button
              variant="outline-primary"
              id="tbg-btn-3"
              value={"A and B"}
              onClick={() => {
                setHighlight({ A: true, B: true, C: false, D: false });
                setActiveBtn("A and B");
              }}
              active={activeBtn === "A and B"}
            >
              A and B
            </Button>
            <Button
              variant="outline-primary"
              id="tbg-btn-4"
              value={"B and C"}
              onClick={() => {
                setHighlight({ A: false, B: true, C: true, D: false });
                setActiveBtn("B and C");
              }}
              active={activeBtn === "B and C"}
            >
              B and C
            </Button>
            <Button
              variant="outline-primary"
              id="tbg-btn-5"
              value={"C and D"}
              onClick={() => {
                setHighlight({ A: false, B: false, C: true, D: true });
                setActiveBtn("C and D");
              }}
              active={activeBtn === "C and D"}
            >
              C and D
            </Button>
            <Button
              variant="outline-primary"
              id="tbg-btn-6"
              value={"D and A"}
              onClick={() => {
                setHighlight({ A: true, B: false, C: false, D: true });
                setActiveBtn("D and A");
              }}
              active={activeBtn === "D and A"}
            >
              D and A
            </Button>
          </ButtonGroup>
          <div className="pt-4">
            <Button
              variant="outline-primary"
              onClick={() => {
                {
                  setHighlight({ A: false, B: false, C: false, D: false });
                  setActiveBtn("");
                }
              }}
            >
              Clear highlights
            </Button>
          </div>
          <div className="pt-4">
            <label for="btn-group">
              <i class="fa-regular fa-eye-slash"></i> :
            </label>
            <ButtonGroup
              className="me-2"
              aria-label="Button group"
              id="btn-group"
            >
              <Button
                variant="outline-primary"
                onClick={() => setShow({ ...show, letter: !show.letter })}
                active={show.letter}
              >
                A
              </Button>
              <Button
                variant="outline-primary"
                onClick={() => setShow({ ...show, angle: !show.angle })}
                active={show.angle}
              >
                45°
              </Button>
              <Button
                variant="outline-primary"
                onClick={() => setShow({ ...show, curve: !show.curve })}
                active={show.curve}
              >
                {angleSvg}
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </Col>
      <Col xl={8} md={7}>
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
            {/* Highights */}
            <path
              id="highlightA"
              d={`M ${(50 + x * 50) * unit},${(50 - y * 50) * unit} L ${
                50 * unit
              },${50 * unit} L ${100 * unit},${50 * unit} A ${50 * unit} ${
                50 * unit
              } 0 0 0 ${(50 + x * 50) * unit},${(50 - y * 50) * unit} Z`}
              fill="lightblue"
              visibility={highlight.A ? "visible" : "hidden"}
            />
            <path
              id="highlightB"
              d={`M ${0 * unit},${50 * unit} L ${50 * unit},${50 * unit} L ${
                (50 + x * 50) * unit
              },${(50 - y * 50) * unit} A ${50 * unit} ${50 * unit} 0 0 0 ${
                0 * unit
              },${50 * unit} Z`}
              fill="lightgreen"
              visibility={highlight.B ? "visible" : "hidden"}
            />
            <path
              id="highlightC"
              d={`M ${(50 - x * 50) * unit},${(50 + y * 50) * unit} L ${
                50 * unit
              },${50 * unit} L ${0 * unit},${50 * unit} A ${50 * unit} ${
                50 * unit
              } 0 0 0 ${(50 - x * 50) * unit},${(50 + y * 50) * unit} Z`}
              fill="lightblue"
              visibility={highlight.C ? "visible" : "hidden"}
            />
            <path
              id="highlightD"
              d={`M ${100 * unit},${50 * unit} L ${50 * unit},${50 * unit} L ${
                (50 - x * 50) * unit
              },${(50 + y * 50) * unit} A ${50 * unit} ${50 * unit} 0 0 0 ${
                100 * unit
              },${50 * unit} Z`}
              fill="lightgreen"
              visibility={highlight.D ? "visible" : "hidden"}
            />

            {/*Lines */}
            <line
              id="line1"
              x1={`${0 * unit}px`}
              y1={`${50 * unit}px`}
              x2={`${100 * unit}px`}
              y2={`${50 * unit}px`}
              stroke="black"
              strokeWidth="5"
            />
            <line
              id="line2"
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
            <line
              id="line2dummy"
              x1={`${(50 - x * 50) * unit}px`}
              y1={`${(50 + y * 50) * unit}px`}
              x2={`${(50 + x * 50) * unit}px`}
              y2={`${(50 - y * 50) * unit}px`}
              stroke="transparent"
              strokeWidth="50"
              cursor={dragging ? "grabbing" : "grab"}
              onMouseDown={(e) => handleSetDragging(e)}
              onTouchStart={(e) => handleSetDragging(e)}
            />
            {/* Curves */}
            {show.curve && (
              <>
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
              </>
            )}
            {/* angles */}
            {show.angle && (
              <>
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
              </>
            )}
            {/* Angle letters */}
            {show.letter && (
              <>
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
              </>
            )}
            <text
              x={65 * unit}
              y={15 * unit}
              alignmentBaseline="middle"
              textAnchor="middle"
              fontSize={Math.max(15, 3 * unit)}
              fill="blue"
              className="animated1"
            >Drag this line →
            </text>
          </svg>
        </div>
      </Col>
    </Row>
  );
}

export default Intersect;
