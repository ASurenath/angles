import React, { useEffect, useRef, useState } from "react";
import { Col, Form, FormGroup, InputGroup, Row } from "react-bootstrap";

function Triangle() {
  const svgBox = useRef(null);
  const outerBox = useRef(null);
  const [boxWidth, setBoxWidth] = useState(1);
  const [boxHeight, setBoxHeight] = useState(1);
  const [unit, setUnit] = useState(1);
  const [angleA, setAngleA] = useState(60);
  const [angleB, setAngleB] = useState(60);
  const [angleC, setAngleC] = useState(60);
  const [Xa, setXa] = useState(50);
  const [Ya, setYa] = useState(10);
  const [Xb, setXb] = useState(20);
  const [Yb, setYb] = useState(80);
  const [Xc, setXc] = useState(80);
  const [Yc, setYc] = useState(90);
  const [abCap, setAbCap] = useState([]);
  const [bcCap, setBcCap] = useState([]);
  const [caCap, setCaCap] = useState([]);
  const [sign, setSign] = useState(1);
  const [draggingA, setDraggingA] = useState(false);
  const [draggingB, setDraggingB] = useState(false);
  const [draggingC, setDraggingC] = useState(false);
  const [triangleType, setTriangleType] = useState("Acute");

  useEffect(() => {
    setAbCap([
      (Xb - Xa) / Math.sqrt(Math.pow(Xb - Xa, 2) + Math.pow(Yb - Ya, 2)),
      (Yb - Ya) / Math.sqrt(Math.pow(Xb - Xa, 2) + Math.pow(Yb - Ya, 2)),
    ]);
    setBcCap([
      (Xc - Xb) / Math.sqrt(Math.pow(Xc - Xb, 2) + Math.pow(Yc - Yb, 2)),
      (Yc - Yb) / Math.sqrt(Math.pow(Xc - Xb, 2) + Math.pow(Yc - Yb, 2)),
    ]);
    setCaCap([
      (Xa - Xc) / Math.sqrt(Math.pow(Xa - Xc, 2) + Math.pow(Ya - Yc, 2)),
      (Ya - Yc) / Math.sqrt(Math.pow(Xa - Xc, 2) + Math.pow(Ya - Yc, 2)),
    ]);
  }, [Xa, Ya, Xb, Yb, Xc, Yc]);
  useEffect(() => {
    setSign(Math.sign(abCap[1] * bcCap[0] - abCap[0] * bcCap[1]));
  }, [abCap, bcCap]);

  useEffect(() => {
    setAngleA(Math.round(Math.acos(-abCap[0]*caCap[0] - abCap[1]*caCap[1]) * 180 / Math.PI));
    setAngleB(Math.round(Math.acos(-abCap[0]*bcCap[0] - abCap[1]*bcCap[1]) * 180 / Math.PI));
    setAngleC(180-Math.round(Math.acos(-abCap[0]*caCap[0] - abCap[1]*caCap[1]) * 180 / Math.PI)-Math.round(Math.acos(-abCap[0]*bcCap[0] - abCap[1]*bcCap[1]) * 180 / Math.PI));
  }, [abCap, bcCap, caCap]);
  useEffect(() => {
    if(angleA==90 || angleB==90 || angleC==90){
      setTriangleType("Right");
    }
    else if(angleA>90 || angleB>90 || angleC>90){
      setTriangleType("Obtuse"); 
    }
    else if(angleA<90 && angleB<90 && angleC<90){
      setTriangleType("Acute");
    }
  }, [angleA, angleB, angleC]);

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
    // e.preventDefault()
    if (draggingA || draggingB || draggingC) {
      let cursorX, cursorY, dy;
      const svgRect = svgBox.current.getBoundingClientRect();
      if (e.type === "mousemove") {
        e.preventDefault();
        cursorX = e.clientX - svgRect.left;
        cursorY = e.clientY - svgRect.top;
      } else if (e.type === "touchmove") {
        cursorX = e.changedTouches[0].clientX - svgRect.left;
        cursorY = e.changedTouches[0].clientY - svgRect.top;
      }

      if (draggingA) {
        setXa(cursorX / unit);
        setYa(cursorY / unit);
      } else if (draggingB) {
        setXb(cursorX / unit);
        setYb(cursorY / unit);
      } else if (draggingC) {
        setXc(cursorX / unit);
        setYc(cursorY / unit);
      }
    }
  };
  return (
    <div className="angle-main" ref={outerBox}>
      <svg
        width={boxWidth}
        xmlns="http://www.w3.org/2000/svg"
        ref={svgBox}
        className="angle-svg border"
        cursor={draggingA || draggingB || draggingC ? "grabbing" : "default"}
        onMouseUp={() => {
          setDraggingA(false);
          setDraggingB(false);
          setDraggingC(false);
        }}
        onTouchEnd={() => {
          setDraggingA(false);
          setDraggingB(false);
          setDraggingC(false);
        }}
        onMouseMove={(e) => handleDrag(e)}
        onTouchMove={(e) => handleDrag(e)}
      >
        <line
          id="lineAB"
          x1={`${Xa * unit}px`}
          y1={`${Ya * unit}px`}
          x2={`${Xb * unit}px`}
          y2={`${Yb * unit}px`}
          stroke="black"
          strokeWidth="5"
        />
        <line
          id="lineBC"
          x1={`${Xb * unit}px`}
          y1={`${Yb * unit}px`}
          x2={`${Xc * unit}px`}
          y2={`${Yc * unit}px`}
          stroke="black"
          strokeWidth="5"
        />
        <line
          id="lineCA"
          x1={`${Xc * unit}px`}
          y1={`${Yc * unit}px`}
          x2={`${Xa * unit}px`}
          y2={`${Ya * unit}px`}
          stroke="black"
          strokeWidth="5"
        />
        <circle
          id="pointA"
          cx={`${Xa * unit}`}
          cy={`${Ya * unit}`}
          r={`${1 * unit}`}
          cursor={draggingA ? "grabbing" : "grab"}
          onMouseDown={() => setDraggingA(true)}
          onTouchStart={() => setDraggingA(true)}
        ></circle>
<circle
          id="pointA"
          cx={`${Xa * unit}`}
          cy={`${Ya * unit}`}
          r={`${10 * unit}`}
          cursor={draggingA ? "grabbing" : "grab"}
          onMouseDown={() => setDraggingA(true)}
          onTouchStart={() => setDraggingA(true)}
          fill="transparent"
        ></circle>
        <circle
          id="pointB"
          cx={`${Xb * unit}`}
          cy={`${Yb * unit}`}
          r={`${1 * unit}`}
          cursor={draggingB ? "grabbing" : "grab"}
          onMouseDown={() => setDraggingB(true)}
          onTouchStart={() => setDraggingB(true)}
        ></circle>
         <circle
          id="pointBdummy"
          cx={`${Xb * unit}`}
          cy={`${Yb * unit}`}
          r={`${1 * unit}`}
          cursor={draggingB ? "grabbing" : "grab"}
          onMouseDown={() => setDraggingB(true)}
          onTouchStart={() => setDraggingB(true)}
          fill="transparent"
        ></circle>

        <circle
          id="pointC"
          cx={`${Xc * unit}`}
          cy={`${Yc * unit}`}
          r={`${1 * unit}`}
          cursor={draggingC ? "grabbing" : "grab"}
          onMouseDown={() => setDraggingC(true)}
          onTouchStart={() => setDraggingC(true)}
        ></circle>
        <circle
          id="pointCdummy"
          cx={`${Xc * unit}`}
          cy={`${Yc * unit}`}
          r={`${1 * unit}`}
          cursor={draggingC ? "grabbing" : "grab"}
          onMouseDown={() => setDraggingC(true)}
          onTouchStart={() => setDraggingC(true)}
          fill="transparent"
        ></circle>
        <text
          id="textA"
          x={`${(Xa - (abCap[0] - caCap[0]) * 2) * unit}`}
          y={`${(Ya - (abCap[1] - caCap[1]) * 2) * unit}`}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={`${3 * unit}`}
          cursor={draggingA ? "grabbing" : "grab"}
          onMouseDown={() => setDraggingA(true)}
          onTouchStart={() => setDraggingA(true)}
        >
          A
        </text>
        <text
          id="textB"
          x={`${(Xb - (bcCap[0] - abCap[0]) * 2) * unit}`}
          y={`${(Yb - (bcCap[1] - abCap[1]) * 2) * unit}`}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={`${3 * unit}`}
          cursor={draggingB ? "grabbing" : "grab"}
          onMouseDown={() => setDraggingB(true)}
          onTouchStart={() => setDraggingB(true)}
        >
          B
        </text>
        <text
          id="textC"
          x={`${(Xc - (caCap[0] - bcCap[0]) * 2) * unit}`}
          y={`${(Yc - (caCap[1] - bcCap[1]) * 2) * unit}`}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={`${3 * unit}`}
          cursor={draggingC ? "grabbing" : "grab"}
          onMouseDown={() => setDraggingC(true)}
          onTouchStart={() => setDraggingC(true)}

        >
          C
        </text>
        <path
          id="arcA"
          d={`M ${(Xa - caCap[0] * 5) * unit} ${
            (Ya - caCap[1] * 5) * unit
          }  A ${5 * unit} ${5 * unit} 0 0 ${sign>0?1:0} ${(abCap[0] * 5 + Xa) * unit} ${
            (abCap[1] * 5 + Ya) * unit
          } `}
          stroke="blue"
          strokeWidth="4"
          fill="none"
        />
        <path
          id="arcB"
          d={`M  ${(Xb - abCap[0] * 5) * unit} ${
            (Yb - abCap[1] * 5) * unit
          } A ${5 * unit} ${5 * unit} 0 0 ${sign>0?1:0} ${(bcCap[0] * 5 + Xb) * unit} ${
            (bcCap[1] * 5 + Yb) * unit
          }`}
          stroke="blue"
          strokeWidth="4"
          fill="none"
        />
        <path
          id="arcC"
          d={`M ${(Xc - bcCap[0] * 5) * unit} ${
            (Yc - bcCap[1] * 5) * unit
          } A ${5 * unit} ${5 * unit} 0 0 ${sign>0?1:0} ${(caCap[0] * 5 + Xc) * unit} ${
            (caCap[1] * 5 + Yc) * unit
          }`}
          stroke="blue"
          strokeWidth="4"
          fill="none"
        />
        <text
          id="angleAText"
          x={`${(Xa + (abCap[0] - caCap[0]) * 5) * unit}`}
          y={`${(Ya + (abCap[1] - caCap[1]) * 5) * unit}`}
          alignmentBaseline="middle"
          textAnchor="middle"
          fontSize={Math.max(10, 3 * unit)}
          fill="blue"
        >
          {angleA}°
        </text>
        <text
          id="angleBText"
          x={`${(Xb + (bcCap[0] - abCap[0]) * 5) * unit}`}
          y={`${(Yb + (bcCap[1] - abCap[1]) * 5) * unit}`}
          alignmentBaseline="middle"
          textAnchor="middle"
          fontSize={Math.max(10, 3 * unit)}
          fill="blue"
        >
          {angleB}°
        </text>
        <text
          id="angleCText"
          x={`${(Xc + (caCap[0] - bcCap[0]) * 5) * unit}`}
          y={`${(Yc + (caCap[1] - bcCap[1]) * 5) * unit}`}
          alignmentBaseline="middle"
          textAnchor="middle"
          fontSize={Math.max(10, 3 * unit)}
          fill="blue"
        >
          {angleC}°
        </text>

        <text
          id="triangleType"
          x={`${50 * unit}`}
          y={`${90 * unit}`}
          alignmentBaseline="middle"
          textAnchor="middle"
          fontSize={Math.max(15, 5 * unit)}
          fill="blue"
        >
          {triangleType} triangle
        </text>
        <text
          id="triangleTypeDescription"
          x={`${50 * unit}`}
          y={`${95 * unit}`}
          alignmentBaseline="middle"
          textAnchor="middle"
          fontSize={Math.max(10, 3 * unit)}
          fill="blue"
        >
          {triangleType=="Acute"&&"All angles less that 90°"}
          {triangleType=="Obtuse"&&"One angle greater that 90°"}
          {triangleType=="Right"&&"One angle equals to 90°"}
        </text>
        {/* instruction */}
        <text
              x={70 * unit}
              y={10 * unit}
              alignmentBaseline="middle"
              textAnchor="middle"
              fontSize={Math.max(15, 3 * unit)}
              fill="blue"
              className="animated1"
            >← Drag vertices
            </text>
      </svg>
    </div>
  );
}

export default Triangle;
