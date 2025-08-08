import React from "react";
import { LayersProvider } from "@grapesjs/react";

// Define our own LayersProviderProps interface
interface LayersProviderProps {
  root: any;
  selected: any[];
  select: (layer: any) => void;
  expand: (layer: any, expanded: boolean) => void;
  remove: (layer: any) => void;
}

const CustomLayerManager: React.FC<LayersProviderProps> = ({
  root,
  selected,
  select,
  expand,
  remove,
}) => {
  const renderLayer = (layer: any, level = 0) => {
    const isSelected = selected?.some((sel: any) => sel === layer);
    const isOpen = layer.getOpen();
    const hasChildren = layer.getComponents().length > 0;
    const indent = level * 10;

    return (
      <React.Fragment key={layer.getId()}>
        <div
          className={`layer-item flex items-center p-2 mb-1 rounded cursor-pointer ${
            isSelected ? "bg-blue-100" : "bg-gray-100"
          }`}
          style={{ paddingLeft: `${indent + 8}px` }}
          onClick={() => select(layer)}
        >
          {hasChildren && (
            <button
              className="mr-2 w-4 h-4 flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                expand(layer, !isOpen);
              }}
            >
              {isOpen ? "▼" : "►"}
            </button>
          )}
          <span className="flex-grow">{layer.getName()}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              remove(layer);
            }}
            className="text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
        
        {isOpen && hasChildren && (
          <div className="layer-children">
            {layer.getComponents().map((child: any) => renderLayer(child, level + 1))}
          </div>
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="custom-layer-manager p-3">
      <h4 className="text-lg font-bold mb-3">Layers</h4>
      <div className="layer-list">
        {root.getComponents().map((layer: any) => renderLayer(layer))}
      </div>
    </div>
  );
};

export default CustomLayerManager;