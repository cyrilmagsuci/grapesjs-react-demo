import React from "react";

// Define our own BlocksProviderProps interface
interface BlocksProviderProps {
  blocks: any;
  dragStart: (e: React.DragEvent, block: any) => void;
  dragStop: () => void;
}

const CustomBlockManager: React.FC<BlocksProviderProps> = ({ 
  blocks, 
  dragStart, 
  dragStop 
}) => {

  return (
    <div className="custom-block-manager">
      {blocks.getAll().map((block: any, index: number) => (
        <div
          key={index}
          className="block-item"
          draggable
          onDragStart={(e) => dragStart(e, block)}
          onDragEnd={dragStop}
          style={{
            padding: "12px",
            margin: "8px 0",
            backgroundColor: "var(--background-neutral)",
            borderRadius: "8px",
            cursor: "grab",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div>{block.getLabel()}</div>
        </div>
      ))}
    </div>
  );
};

export default CustomBlockManager;