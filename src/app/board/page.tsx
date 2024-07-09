"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Stage,
  Layer,
  Rect,
  Circle,
  Transformer,
  Image,
  Text,
} from "react-konva";
import useImage from "use-image";

export function Rectangle({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
  onMouseEnter,
  onMouseLeave,
}) {
  const [cursor, setCursor] = useState("default");
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (shapeRef === null || trRef === null) return;
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Rect
        onClick={onSelect}
        onMouseDown={onSelect}
        onTap={onSelect}
        onPointerDown={onSelect}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={(e) => {
          onChange({ ...shapeProps, x: e.target.x(), y: e.target.y() });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          flipEnabled={false}
          rotateEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
              return oldBox;
            }
          }}
          borderStroke="black"
          anchorStroke="black"
          anchorFill="pink"
          enabledAnchors={[
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
          ]}
        />
      )}
    </>
  );
}

export function CanvasNode({
  nodeProps,
  isSelected,
  onSelect,
  onChange,
  onMouseEnter,
  onMouseLeave,
}) {
  const ImageStrategy = () => {
    const nodeRef = useRef();
    return (
      <Image
        onDragEnd={(e) =>
          onChange({ ...nodeProps, x: e.target.x(), y: e.target.y() })
        }
        draggable
        ref={nodeRef}
        {...nodeProps}
      />
    );
  };
  const GifStrategy = () => {};
  const TextStrategy = () => {};
  return <></>;
}

const initialRectangles = [
  {
    x: 10,
    y: 10,
    width: 100,
    height: 100,
    fill: "red",
    id: "rect1",
  },
  {
    x: 150,
    y: 150,
    width: 100,
    height: 100,
    fill: "green",
    id: "rect2",
  },
];

let intervalId: NodeJS.Timeout;

export default function Board() {
  const [isHovering, setIsHovering] = useState(false);
  const [cursor, setCursor] = useState("default");
  const [layer, setLayer] = useState([{}]);
  const [selectedToolbarOption, setSelectedToolbarOption] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [selectionBoxVisible, setSelectionBoxVisible] = useState(false);
  const [isFirstClick, setIsFirstClick] = useState(true);

  const [rectangles, setRectangles] = useState(initialRectangles);
  const [selectedShape, setSelectedShape] = useState("");

  const [stage, setStage] = useState();

  const stageRef = useRef();
  const shapeRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef();
  const transformerRef = useRef();
  const selectionLayerRef = useRef();
  const selectionBoxRef = useRef();

  const [image] = useImage("https://picsum.photos/200");

  const onMouseEnterCanvas = () => {
    setIsHovering(true);
    setCursor("pointer");
  };
  const onMouseLeaveCanvas = () => {
    setIsHovering(false);
    setCursor("default");
  };

  const checkDeselect = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedShape(null);
    }
  };

  const handleMouseDown = () => {
    setIsMouseDown(true);
    setIsFirstClick(true);
  };

  const repeat = (func) => {
    intervalId = setInterval(func, 1);
  };

  const stop = () => {
    clearInterval(intervalId);
    setIsMouseDown(false);
    setSelectionBoxVisible(false);
  };

  useEffect(() => {
    if (isMouseDown) {
      const currentPointerPosition = stage.currentTarget.pointerPos;

      selectionBoxRef.current.setAttr("x", currentPointerPosition.x);
      selectionBoxRef.current.setAttr("y", currentPointerPosition.y);
      setSelectionBoxVisible(true);
      repeat(drawRubberRectangle);
    }
  }, [isMouseDown]);

  const drawRubberRectangle = () => {
    // console.log(selectionBoxRef.current);
    // console.log(e.target);
    const absolutePointerPosition = stageRef.current;

    // if (isFirstClick) {
    //   console.log("stage: ", stage.currentTarget.pointerPos);

    //   setIsFirstClick(false);
    // }
    const theScaleX = selectionBoxRef.current.getAttr("scaleX");
    const relativePos = selectionBoxRef.current.getRelativePointerPosition();
    const newHeight = relativePos.y;
    const newWidth = relativePos.x;

    // selectionBoxRef.current.setAttr("scaleX", theScaleX + 1);
    selectionBoxRef.current.setAttr("height", newHeight);
    selectionBoxRef.current.setAttr("width", newWidth);
    selectionBoxRef.current.getLayer().batchDraw();
  };

  const addSquareToLayer = () => {
    const xPos = Math.floor(Math.random() * 200);
    const yPos = Math.floor(Math.random() * 200);
    const fill = "green";
    setLayer([...layer, { x: xPos, y: yPos, fill: fill }]);
    setSelectedToolbarOption(1);
  };

  //   useEffect(() => {
  //     transformerRef.current.nodes([textRef.current, imageRef.current]);
  //   }, []);
  return (
    <div
      style={{
        maxWidth: "1500px",
        height: "100vh",
        margin: "auto",
        border: "2px solid black",
        padding: 5,
      }}
    >
      <div>
        <p style={{ fontSize: "32px", fontWeight: 700 }}>ChimBoard</p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            border: "2px solid black",
            marginRight: 10,
          }}
        >
          <p>Toolbar</p>
          <ul>
            <li>
              <button
                onClick={() => {
                  setSelectedToolbarOption(0);
                }}
                style={{
                  backgroundColor: "white",
                  border: "2px solid",
                  borderColor: selectedToolbarOption === 0 ? "red" : "black",
                }}
              >
                Text
              </button>
            </li>
            <li>
              <button
                style={{
                  backgroundColor: "white",
                  border: "2px solid",
                  borderColor: selectedToolbarOption === 1 ? "red" : "black",
                }}
                onClick={addSquareToLayer}
              >
                Gifs
              </button>
            </li>
            <li>
              <button>Upload Image</button>
            </li>
          </ul>
        </div>
        <div style={{ cursor: cursor, marginRight: 5 }}>
          <Stage
            ref={stageRef}
            width={800}
            height={700}
            style={{ border: "2px solid black" }}
            ref={shapeRef}
            onMouseDown={(e) => {
              setStage(e);
              handleMouseDown();
            }}
            onMouseUp={stop}
            onClick={checkDeselect}
            onTouchStart={checkDeselect}
          >
            <Layer>
              <Rect
                ref={selectionBoxRef}
                width={10}
                height={50}
                scaleX={1}
                scaleY={1}
                x={100}
                y={100}
                fill="#4d7cc9"
                stroke="#052963"
                opacity={0.1}
                visible={selectionBoxVisible ? true : false}
              />
            </Layer>
            {/* <Layer>
              {rectangles.map((rect, index) => {
                return (
                  <Rectangle
                    key={index}
                    shapeProps={rect}
                    isSelected={rect.id === selectedShape}
                    onSelect={() => {
                      setSelectedShape(rect.id);
                    }}
                    onChange={(newAttributes) => {
                      const rects = rectangles.slice();
                      rects[index] = newAttributes;
                      setRectangles(rects);
                    }}
                    onMouseEnter={onMouseEnterCanvas}
                    onMouseLeave={onMouseLeaveCanvas}
                  />
                );
              })}
            </Layer> */}
            {/* <Layer><Rect ref={textRef} /></Layer> */}
            {/* <Layer>
              <Text ref={textRef} text="these are words" draggable />
            </Layer>
            <Layer>
              <Image ref={imageRef} image={image} opacity={0.5} draggable />
              <Transformer ref={transformerRef} />
            </Layer> */}
          </Stage>
        </div>
        <div style={{ border: "2px solid black" }}>
          <p>Layers</p>
          <div>
            {layer.map((layer, index) => (
              <div key={index}>
                <p>shape {index}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
