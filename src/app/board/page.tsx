"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { DndContext, useDroppable, useDraggable } from "@dnd-kit/core";
import useImage from "use-image";

const Items = [
  { id: 1, text: "one of" },
  { id: 2, text: "one of" },
  { id: 3, text: "one of" },
  { id: 4, text: "one of" },
  { id: 5, text: "one of" },
  { id: 6, text: "one of" },
];

export function DroppableBoard(props) {
  const { isOver, setNodeRef } = useDroppable({
    id: "droppable-board",
  });
  return (
    <div
      style={{
        color: isOver ? "green" : undefined,
        backgroundColor: "gray",
        height: "600px",
        margin: "15px 0 15px 0",
      }}
      ref={setNodeRef}
    >
      {props.children}
    </div>
  );
}

export function TextBlock(props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "draggable",
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px 0)`,
        border: "2px solid black",
      }
    : undefined;

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      // style={{ backgroundColor: "blue" }}
    >
      {props.children}
    </button>
  );
}

export default function Board() {
  const [isDropped, setIsDropped] = useState(false);
  const draggableMarkup = <TextBlock>Drag Me</TextBlock>;

  function handleDragEvent(event) {
    if (event.over && event.over.id === "droppable-board") {
      setIsDropped(true);
    }
  }
  return (
    <div style={{ maxWidth: "1500px", margin: "auto" }}>
      <div>Chimboard</div>
      <div>
        <div></div>
        <DndContext onDragEnd={handleDragEvent}>
          {!isDropped ? draggableMarkup : null}
          <DroppableBoard>
            {isDropped ? draggableMarkup : "Drop Here"}
          </DroppableBoard>
          <div className="grid-cols-4">
            {/* {Items.map((item, index) => (
              <div key={index}>{item.text}</div>
            ))} */}
          </div>
        </DndContext>
      </div>
    </div>
  );
}
