"use client";
import { KonvaEventObject } from "konva/lib/Node";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Stage,
  Layer,
  Rect,
  Circle,
  Transformer,
  Image,
  Text,
  Group,
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

const ImageStrategy = ({
  nodeProps,
  isSelected,
  onSelect,
  onChange,
}: CanvasNodeProps) => {
  const [image] = useImage(nodeProps.url);
  const imageReference = useRef<typeof Image>(null);
  const transformerReference = useRef<typeof Transformer>(null);

  useEffect(() => {
    if (isSelected) {
      transformerReference.current!.nodes([imageReference.current]);
      transformerReference.current!.getLayer().batchDraw();
    }
  }, [isSelected]);
  return (
    <>
      <Image
        ref={imageReference}
        image={image}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onChange({
            ...nodeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = imageReference.current;
          if (node === null) {
            return;
          }
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);

          onChange({
            ...nodeProps,
            x: node.x(),
            y: node.y(),

            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
        {...nodeProps}
      />
      {isSelected && (
        <Transformer
          ref={transformerReference}
          flipEnabled={false}
          rotateEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

type CanvasNodeProps = {
  nodeProps: nodeProps;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: nodeProps) => void;
};

export function CanvasNode({
  nodeProps,
  isSelected,
  onSelect,
  onChange,
}: CanvasNodeProps) {
  // const ImageStrategy = ({
  //   nodeProps,
  //   isSelected,
  //   onSelect,
  //   onChange,
  // }: CanvasNodeProps) => {
  //   const [image] = useImage(nodeProps.url);
  //   const imageReference = useRef<typeof Image>(null);
  //   const transformerReference = useRef<typeof Transformer>(null);

  //   useEffect(() => {
  //     if (isSelected) {
  //       transformerReference.current!.nodes([imageReference.current]);
  //       transformerReference.current!.getLayer().batchDraw();
  //     }
  //   }, [isSelected]);
  //   return (
  //     <>
  //       <Image
  //         ref={imageReference}
  //         image={image}
  //         draggable
  //         onClick={onSelect}
  //         onTap={onSelect}
  //         onDragEnd={(e) => {
  //           onChange({
  //             ...nodeProps,
  //             x: e.target.x(),
  //             y: e.target.y(),
  //           });
  //         }}
  //         onTransformEnd={(e) => {
  //           const node = imageReference.current;
  //           if (node === null) {
  //             return;
  //           }
  //           const scaleX = node.scaleX();
  //           const scaleY = node.scaleY();

  //           node.scaleX(1);
  //           node.scaleY(1);

  //           onChange({
  //             ...nodeProps,
  //             x: node.x(),
  //             y: node.y(),

  //             width: Math.max(5, node.width() * scaleX),
  //             height: Math.max(node.height() * scaleY),
  //           });
  //         }}
  //         {...nodeProps}
  //       />
  //       {isSelected && (
  //         <Transformer
  //           ref={transformerReference}
  //           flipEnabled={false}
  //           rotateEnabled={false}
  //           boundBoxFunc={(oldBox, newBox) => {
  //             if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
  //               return oldBox;
  //             }
  //             return newBox;
  //           }}
  //         />
  //       )}
  //     </>
  //   );
  // };
  const GifStrategy = () => {};
  const TextStrategy = ({
    nodeProps,
    isSelected,
    onSelect,
    onChange,
  }: CanvasNodeProps) => {
    const textReference = useRef();
    const transformerReference = useRef();

    // useEffect(() => {
    //   if (isSelected) {
    //     transformerReference.current.nodes([textReference.current]);
    //     transformerReference.current.getLayer().batchDraw();
    //   }
    // }, [isSelected]);
    return (
      <>
        <Text
          // ref={textReference}
          draggable
          // onClick={onSelect}
          // onTap={onSelect}
          // onDragEnd={(e) => {
          //   onChange({ ...nodeProps, x: e.target.x(), y: e.target.y() });
          // }}
          // onTransformEnd={(e) => {
          //   const node = textReference.current;
          //   if (node === null) {
          //     return;
          //   }
          //   const scaleX = node.scaleX();
          //   const scaleY = node.scaleY();

          //   node.scaleX(1);
          //   node.scaleY(1);

          //   onChange({
          //     ...nodeProps,
          //     x: node.x(),
          //     y: node.y(),

          //     width: Math.max(5, node.width() * scaleX),
          //     height: Math.max(node.height() * scaleY),
          //     fontSize: Math.max(node.height() * scaleY) / 2,
          //   });
          // }}
          {...nodeProps}
        />
        {/* {isSelected && (
          <Transformer
            ref={transformerReference}
            flipEnabled={false}
            rotateEnabled={false}
          />
        )} */}
      </>
    );
  };
  return (
    <>
      {nodeProps.name === "image" && (
        <ImageStrategy
          nodeProps={nodeProps}
          isSelected={isSelected}
          onSelect={onSelect}
          onChange={onChange}
        />
      )}
      {nodeProps.name === "text" && (
        <TextStrategy
          nodeProps={nodeProps}
          isSelected={isSelected}
          onSelect={onSelect}
          onChange={onChange}
        />
      )}
    </>
  );
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

type nodeProps = {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text?: string;
  stroke?: string;
  fontSize?: number;
  url?: string;
};

type SelectionBoxCoordinatesProps = {
  x1: string;
  y1: string;
  x2: string;
  y2: string;
};

const defaultNodes: nodeProps[] = [
  // {
  //   id: "1",
  //   name: "text",
  //   x: 10,
  //   y: 10,
  //   width: 150,
  //   height: 50,
  //   text: "Text that will be editable",
  //   stroke: "blue",
  //   fontSize: 25,
  // },
  {
    id: "2",
    name: "image",
    x: 459,
    y: 300,
    width: 100,
    height: 100,
    url: "https://picsum.photos/200/300",
  },
];

export default function Board() {
  const [nodes, setNodes] = useState(defaultNodes);
  const [selectId, setSelectId] = useState<null | number>(null);
  const [selecting, setSelecting] = useState<boolean>(false);
  const [selectionBoxCoordinates, setSelectionBoxCoordinates] =
    useState<SelectionBoxCoordinatesProps | null>(null);

  const layerRef = useRef();
  const selectionRef = useRef<typeof Rect>(null);
  const transformerRef = useRef<Transformer>(null);
  const tempRef = useRef(null);
  const secondRef = useRef(null);
  const tempRect = useRef(null);
  const tempRect2 = useRef(null);

  useEffect(() => {}, []);

  const haveIntersection = (node, selectionRect) => {
    const nodeRect = node.getClientRect();
    return !(
      selectionRect.x > nodeRect.x + nodeRect.width ||
      selectionRect.x + selectionRect.width < nodeRect.x ||
      selectionRect.y > nodeRect.y + nodeRect.height ||
      selectionRect.y + selectionRect.height < nodeRect.y
    );
  };

  const checkDeselect = (e) => {
    const clickedOnNode = e.target !== e.target.getStage();
    const stage = e.target.getStage();
    console.log(stage?.find("Text, Image"));
    if (clickedOnNode) {
      // setSelectId(null);
      return;
    }

    // setSelectId(null);

    // const x1 = stage.getPointerPosition().x;
    // const y1 = stage.getPointerPosition().y;
    // const x2 = stage.getPointerPosition().x;
    // const y2 = stage.getPointerPosition().y;

    // setSelectionBoxCoordinates({ x1: x1, y1: y1, x2: x2, y2: y2 });
    // selectionRef.current!.setAttr("width", 0);
    // selectionRef.current!.setAttr("height", 0);
    // setSelecting(true);
  };

  const mouseMoving = (e) => {
    const stage = e.target.getStage();
    if (!selecting) {
      return;
    }

    e.evt.preventDefault();
    const x2 = stage.getPointerPosition().x;
    const y2 = stage.getPointerPosition().y;

    setSelectionBoxCoordinates({ ...selectionBoxCoordinates, x2: x2, y2: y2 });

    selectionRef.current!.setAttrs({
      visible: true,
      x: Math.min(selectionBoxCoordinates.x1, selectionBoxCoordinates.x2),
      y: Math.min(selectionBoxCoordinates.y1, selectionBoxCoordinates.y2),
      width: Math.abs(selectionBoxCoordinates.x2 - selectionBoxCoordinates.x1),
      height: Math.abs(selectionBoxCoordinates.y2 - selectionBoxCoordinates.y1),
    });
  };

  const mouseNotMoving = (
    e: KonvaEventObject<MouseEvent> | KonvaEventObject<TouchEvent>,
  ) => {
    const stage = e.target.getStage();
    setSelecting(false);
    if (!selectionRef.current!.getAttr("visible")) {
      return;
    }

    e.evt.preventDefault();
    selectionRef.current.setAttr("visible", false);

    // adding nodes that collided with selection box to a group

    const allNodes = stage?.find("Text, Image");
    const selectionRectangle = selectionRef.current.getClientRect();
    const selected = allNodes?.filter((node) =>
      haveIntersection(node, selectionRectangle),
    );
    transformerRef.current!.nodes(selected);
    transformerRef.current!.getLayer().batchDraw();
    console.log(allNodes);
    console.log(selected);
  };

  const onStageClick = (e) => {
    const stage = e.target.getStage();
    if (selectionRef.current.getAttr("visible")) {
      return;
    }

    if (e.target === stage) {
      transformerRef.current!.nodes([]);
      return;
    }
  };
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
        <div>
          <div>
            <button>T</button>
          </div>
          <div>
            <button>Img</button>
          </div>
          <div>
            <button>Vid</button>
          </div>
        </div>
        <div>
          <Stage
            width={1000}
            height={1000}
            style={{ border: "2px solid black" }}
            // onClick={onStageClick}
            // onTap={onStageClick}
            onMouseDown={checkDeselect}
            onTouchStart={checkDeselect}
            // onMouseMove={mouseMoving}
            // onTouchMove={mouseMoving}
            // onMouseUp={mouseNotMoving}
            // onTouchEnd={mouseNotMoving}
          >
            <Layer ref={layerRef}>
              <Transformer
                // id={"groupSelect"}
                ref={transformerRef}
                flipEnabled={false}
                rotateEnabled={false}
              />
              {/* <Rect ref={selectionRef} fill="blue" opacity={0.2} />
              <Rect
                ref={tempRect}
                fill="blue"
                x={10}
                y={10}
                height={50}
                width={50}
                draggable
              />
              <Text
                ref={tempRect2}
                fill="red"
                text="OMGG"
                x={50}
                y={10}
                height={50}
                width={50}
                draggable
              />
              <Transformer ref={tempRef} rotateEnabled={false} />
              <Transformer ref={secondRef} /> */}

              {nodes.map((node, index) => {
                // return (
                //   <CanvasNode
                //     key={index}
                //     nodeProps={node}
                //     isSelected={node.id === selectId}
                //     onSelect={() => {
                //       console.log("node with id: ", node.id);
                //       setSelectId(node.id);
                //     }}
                //     onChange={(newAttrs) => {
                //       const newNodes = nodes.slice();
                //       newNodes[index] = newAttrs;
                //       setNodes(newNodes);
                //     }}
                //   />
                // );
                return <ImageStrategy nodeProps={node} />;
              })}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
}
