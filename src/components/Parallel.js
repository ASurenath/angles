import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  ButtonGroup,
  Col,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";

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
  const [show, setShow] = useState({ angle: false, letter: true, curve: false });
  const [activeBtn, setActiveBtn] = useState("");
  const [highlight, setHighlight] = useState({
    A: false,
    B: false,
    C: false,
    D: false,
    E: false,
    F: false,
    G: false,
    H: false,
  });
  const [pairType, setPairType] = useState("Corresponding");

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
  const angleSvg = (
    <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="15" x2="20" y2="15" stroke="blue" strokeWidth="1" />
      <line x1="0" y1="15" x2="9" y2="0" stroke="blue" strokeWidth="1" />
      <path
        d="M5,5 A5,5 0 0,1 10,15"
        fill="none"
        stroke="blue"
        strokeWidth="1"
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
    }
  };
  const clearHighlights = () => {
    let tempHighlight = highlight;
    for (let key in tempHighlight) {
      tempHighlight[key] = false;
    }
    setHighlight(tempHighlight);
  };
  const renderPairButton = (A, B) => {
    return (
      <Button
        variant="outline-primary"
        id={`btn-${A} & ${B}`}
        value={`${A} & ${B}`}
        onClick={() => {
          let tempHighlight = highlight;
          for (let key in tempHighlight) {
            tempHighlight[key] = false;
          }
          setHighlight({ ...tempHighlight, [A]: true, [B]: true });
          setActiveBtn(`${A} & ${B}`);
        }}
        active={activeBtn === `${A} & ${B}`}
      >
        {`${A} & ${B}`}
      </Button>
    );
  };
  return (
    <Row className="w-100">
      <Col xl={4} md={5} className="">
        <div className="d-flex flex-column justify-content-start align-items-center px-2 px-lg-5">
          <div className="d-flex justify-content-between align-items-center flex-wrap w-100 p-lg-3 pt-xl-5">
            <label htmlFor="angleA-input">∠ A:</label>
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
          <div className="d-flex justify-content-between align-items-center w-100  p-lg-3">
            <label htmlFor="angleB-input">∠ B:</label>
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
        <div className="d-flex flex-md-column justify-content-start align-items-center px-2 px-lg-5">
          <div className="d-flex justify-content-evenly align-items-center w-100  p-lg-3">
            <label htmlFor="angle-input">Distance :</label>
            <input
              type="range"
              name=""
              id="angle-input"
              className="form-range"
              value={d}
              onChange={(e) => setD(parseInt(e.target.value))}
              min={8}
              max={40}
            />
          </div>
        </div>
        <div className="p-2 p-lg-5">
          <h3>Highlight</h3>
          <div className="d-flex ">
            <Button
              variant="outline-primary"
              onClick={() => {
                setHighlight({
                  A: false,
                  B: false,
                  C: true,
                  D: true,
                  E: true,
                  F: true,
                  G: false,
                  H: false,
                });
                setActiveBtn("Interior");
              }}
              className="me-2"
              active={activeBtn === "Interior"}
            >
              Interior angles
            </Button>

            <Button
              variant="outline-primary"
              onClick={() => {
                setHighlight({
                  A: true,
                  B: true,
                  C: false,
                  D: false,
                  E: false,
                  F: false,
                  G: true,
                  H: true,
                });
                setActiveBtn("Exterior");
              }}
              className="me-2"
              active={activeBtn === "Exterior"}
            >
              Exterior angles
            </Button>
          </div>

          <label htmlFor="pairType" className="mt-3">
            Select pair type:
          </label>
          <Form.Select
            className="fs-4 my-2"
            id="pairType"
            onChange={(e) => {
              setPairType(e.target.value);
              clearHighlights();
            }}
          >
            <option value="Corresponding">Corresponding angles</option>
            <option value="Alternate-interior">
              Alternate interior angles
            </option>
            <option value="Alternate-exterior">
              Alternate exterior angles
            </option>
            <option value="Co-interior">Co-interior angles</option>

            <option value="Co-exterior">Co-exterior angles</option>
          </Form.Select>
          {pairType == "Corresponding" && (
            <>
              <ButtonGroup>
                {renderPairButton("A", "E")}
                {renderPairButton("B", "F")}
                {renderPairButton("C", "G")}
                {renderPairButton("D", "H")}
              </ButtonGroup>
            </>
          )}
          {pairType == "Alternate-interior" && (
            <>
              <ButtonGroup>
                {renderPairButton("C", "E")}
                {renderPairButton("D", "F")}
              </ButtonGroup>
            </>
          )}
          {pairType == "Alternate-exterior" && (
            <>
              <ButtonGroup>
                {renderPairButton("A", "G")}
                {renderPairButton("B", "H")}
              </ButtonGroup>
            </>
          )}
          {pairType == "Co-exterior" && (
            <>
              <ButtonGroup>
                {renderPairButton("A", "H")}
                {renderPairButton("B", "G")}
              </ButtonGroup>
            </>
          )}
          {pairType == "Co-interior" && (
            <>
              <ButtonGroup>
                {renderPairButton("C", "F")}
                {renderPairButton("D", "E")}
              </ButtonGroup>
            </>
          )}

          <div className="pt-4">
            <Button
              variant="outline-primary"
              onClick={() => {
                {
                  clearHighlights();
                  setActiveBtn("");
                }
              }}
            >
              Clear highlights
            </Button>
          </div>
          <div className="pt-4">
            <p>Show/hide:</p>
            <ButtonGroup
              className="me-2"
              aria-label="Button group"
              id="btn-group"
            >
              <Button
                variant="outline-primary"
                onClick={() => setShow({ ...show, letter: !show.letter })}
                active={show.letter}
                title="Angle name"
              >
                <span className={show.letter ? "none" : "strikethrough"}>&nbsp;&nbsp;A&nbsp;&nbsp;</span>
              </Button>
              <Button
                variant="outline-primary"
                onClick={() => setShow({ ...show, angle: !show.angle })}
                active={show.angle}
                title="Angle value"
              >
                <span className={show.angle ? "none" : "strikethrough"}>&nbsp;&nbsp;45°&nbsp;&nbsp;</span>
              </Button>
              <Button
                variant="outline-primary"
                onClick={() => setShow({ ...show, curve: !show.curve })}
                active={show.curve}
                title="Angle curve"
                className="py-0"
              >
                <span className={show.curve ? "none" : "strikethrough"} style={{fontSize:'2rem'}}>&nbsp;&#9693;&nbsp;</span>
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
            {/* Highlights */}

            {highlight.A && (
              <path
                id="highlightA"
                d={`M ${(50 + dX + x * r) * unit},${(50 - d - y * r) * unit} 
              L ${(50 + dX) * unit},${(50 - d) * unit}
               L ${(50 + dX + r) * unit},${(50 - d) * unit} 
               A ${r * unit} ${r * unit} 0 0 0 ${(50 + dX + x * r) * unit},${
                  (50 - d - y * r) * unit
                } Z`}
                fill="lightblue"
              />
            )}
            {highlight.B && (
              <path
                id="highlightB"
                d={`M ${(50 + dX - r) * unit},${(50 - d) * unit} 
              L ${(50 + dX) * unit},${(50 - d) * unit} 
              L ${(50 + dX + x * r) * unit},${(50 - d - y * r) * unit}
               A ${r * unit} ${r * unit} 0 0 0 ${(50 + dX - r) * unit},${
                  (50 - d) * unit
                } Z`}
                fill="lightgreen"
              />
            )}
            {highlight.C && (
              <path
                id="highlightC"
                d={`M ${(50 + dX - x * r) * unit},${
                  (50 - d + y * r) * unit
                } L ${(50 + dX) * unit},${(50 - d) * unit} L ${
                  (50 + dX - r) * unit
                },${(50 - d) * unit} A ${r * unit} ${r * unit} 0 0 0 ${
                  (50 + dX - x * r) * unit
                },${(50 - d + y * r) * unit} Z`}
                fill="lightblue"
              />
            )}
            {highlight.D && (
              <path
                id="highlightD"
                d={`M ${(50 + dX + r) * unit},${(50 - d) * unit} L ${
                  (50 + dX) * unit
                },${(50 - d) * unit} L ${(50 + dX - x * r) * unit},${
                  (50 - d + y * r) * unit
                } A ${r * unit} ${r * unit} 0 0 0 ${(50 + dX + r) * unit},${
                  (50 - d) * unit
                } Z`}
                fill="lightgreen"
              />
            )}

            {highlight.E && (
              <path
                id="highlightE"
                d={`M ${(50 - dX + x * r) * unit},${(50 + d - y * r) * unit} 
              L ${(50 - dX) * unit},${(50 + d) * unit}
               L ${(50 - dX + r) * unit},${(50 + d) * unit} 
               A ${r * unit} ${r * unit} 0 0 0 ${(50 - dX + x * r) * unit},${
                  (50 + d - y * r) * unit
                } Z`}
                fill="lightblue"
              />
            )}
            {highlight.F && (
              <path
                id="highlightF"
                d={`M ${(50 - dX - r) * unit},${(50 + d) * unit} 
              L ${(50 - dX) * unit},${(50 + d) * unit} 
              L ${(50 - dX + x * r) * unit},${(50 + d - y * r) * unit}
               A ${r * unit} ${r * unit} 0 0 0 ${(50 - dX - r) * unit},${
                  (50 + d) * unit
                } Z`}
                fill="lightgreen"
              />
            )}
            {highlight.G && (
              <path
                id="highlightG"
                d={`M ${(50 - dX - x * r) * unit},${
                  (50 + d + y * r) * unit
                } L ${(50 - dX) * unit},${(50 + d) * unit} L ${
                  (50 - dX - r) * unit
                },${(50 + d) * unit} A ${r * unit} ${r * unit} 0 0 0 ${
                  (50 - dX - x * r) * unit
                },${(50 + d + y * r) * unit} Z`}
                fill="lightblue"
              />
            )}
            {highlight.H && (
              <path
                id="highlightH"
                d={`M ${(50 - dX + r) * unit},${(50 + d) * unit} L ${
                  (50 - dX) * unit
                },${(50 + d) * unit} L ${(50 - dX - x * r) * unit},${
                  (50 + d + y * r) * unit
                } A ${r * unit} ${r * unit} 0 0 0 ${(50 - dX + r) * unit},${
                  (50 + d) * unit
                } Z`}
                fill="lightgreen"
              />
            )}
            {/* lines */}
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
            <line
              id="line3dummy"
              x1={`${(50 - x * 65) * unit}px`}
              y1={`${(50 + y * 65) * unit}px`}
              x2={`${(50 + x * 65) * unit}px`}
              y2={`${(50 - y * 65) * unit}px`}
              stroke="transparent"
              strokeWidth="50"
              cursor={dragging ? "grabbing" : "grab"}
              onMouseDown={(e) => handleSetDragging(e)}
              onTouchStart={(e) => handleSetDragging(e)}
            />
            {angle != 0 && (
              <>
                {/* curves */}
                {show.curve && (
                  <>
                    <path
                      id="angleA"
                      d={`M ${(50 + dX + 4 * x) * unit} ${
                        (50 - y * 4 - d) * unit
                      } a ${4 * unit} ${4 * unit} 0 0 1  ${
                        (1 - x) * 4 * unit
                      } ${4 * y * unit}`}
                      stroke="blue"
                      strokeWidth="2"
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
                      strokeWidth="2"
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
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      id="angleD"
                      d={`M ${(50 + dX + 5) * unit} ${(50 - d) * unit} a ${
                        -5 * unit
                      } ${-5 * unit} 0 0 1  ${-(x + 1) * 5 * unit} ${
                        5 * y * unit
                      }`}
                      stroke="green"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      id="angleE"
                      d={`M ${(50 - dX + 4 * x) * unit} ${
                        (50 - y * 4 + d) * unit
                      } a ${4 * unit} ${4 * unit} 0 0 1  ${
                        (1 - x) * 4 * unit
                      } ${4 * y * unit}`}
                      stroke="blue"
                      strokeWidth="2"
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
                      strokeWidth="2"
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
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      id="angleH"
                      d={`M ${(50 - dX + 5) * unit} ${(50 + d) * unit} a ${
                        -5 * unit
                      } ${-5 * unit} 0 0 1  ${-(x + 1) * 5 * unit} ${
                        5 * y * unit
                      }`}
                      stroke="green"
                      strokeWidth="2"
                      fill="none"
                    />
                  </>
                )}
                {/* angle */}
                {show.angle && (
                  <>
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
                      id="angleBText"
                      x={`${
                        (50 +
                          dX -
                          Math.cos(((180 - angle) * Math.PI) / 360) * 7) *
                        unit
                      }`}
                      y={`${
                        (50 -
                          d -
                          Math.sin(((180 - angle) * Math.PI) / 360) * 7) *
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
                      id="angleDText"
                      x={`${
                        (50 +
                          dX +
                          Math.cos(((180 - angle) * Math.PI) / 360) * 7) *
                        unit
                      }`}
                      y={`${
                        (50 -
                          d +
                          Math.sin(((180 - angle) * Math.PI) / 360) * 7) *
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
                      id="angleEtext"
                      x={`${
                        (50 - dX + Math.cos((angle * Math.PI) / 360) * 6) *
                        unit
                      }`}
                      y={`${
                        (50 + d - Math.sin((angle * Math.PI) / 360) * 6) * unit
                      }`}
                      alignmentBaseline="middle"
                      textAnchor="middle"
                      fontSize={Math.max(10, 3 * unit)}
                      fill="blue"
                    >
                      {180 - angle}°
                    </text>
                    <text
                      id="angleFText"
                      x={`${
                        (50 -
                          dX -
                          Math.cos(((180 - angle) * Math.PI) / 360) * 7) *
                        unit
                      }`}
                      y={`${
                        (50 +
                          d -
                          Math.sin(((180 - angle) * Math.PI) / 360) * 7) *
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
                      id="angleHText"
                      x={`${
                        (50 -
                          dX +
                          Math.cos(((180 - angle) * Math.PI) / 360) * 7) *
                        unit
                      }`}
                      y={`${
                        (50 +
                          d +
                          Math.sin(((180 - angle) * Math.PI) / 360) * 7) *
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
                {show.letter && (
                  <>
                    <text
                      id="textA"
                      x={`${
                        (50 + dX + Math.cos((angle * Math.PI) / 360) * 12) *
                        unit
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
                      id="textB"
                      x={`${
                        (50 +
                          dX -
                          Math.cos(((180 - angle) * Math.PI) / 360) * 11) *
                        unit
                      }`}
                      y={`${
                        (50 -
                          d -
                          Math.sin(((180 - angle) * Math.PI) / 360) * 11) *
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
                      id="textC"
                      x={`${
                        (50 + dX - Math.cos((angle * Math.PI) / 360) * 10) *
                        unit
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
                      id="textD"
                      x={`${
                        (50 +
                          dX +
                          Math.cos(((180 - angle) * Math.PI) / 360) * 10) *
                        unit
                      }`}
                      y={`${
                        (50 -
                          d +
                          Math.sin(((180 - angle) * Math.PI) / 360) * 10) *
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
                      id="textE"
                      x={`${
                        (50 - dX + Math.cos((angle * Math.PI) / 360) * 10) *
                        unit
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
                      id="textF"
                      x={`${
                        (50 -
                          dX -
                          Math.cos(((180 - angle) * Math.PI) / 360) * 10) *
                        unit
                      }`}
                      y={`${
                        (50 +
                          d -
                          Math.sin(((180 - angle) * Math.PI) / 360) * 10) *
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
                      id="textG"
                      x={`${
                        (50 - dX - Math.cos((angle * Math.PI) / 360) * 10) *
                        unit
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
                      id="textH"
                      x={`${
                        (50 -
                          dX +
                          Math.cos(((180 - angle) * Math.PI) / 360) * 7) *
                        unit
                      }`}
                      y={`${
                        (50 +
                          d +
                          Math.sin(((180 - angle) * Math.PI) / 360) * 10) *
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
            <text>
              
            </text>

          </svg>
        </div>
      </Col>
    </Row>
  );
}

export default Parallel;
