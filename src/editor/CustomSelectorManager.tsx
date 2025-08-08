import React from "react";
import { SelectorsProvider } from "@grapesjs/react";

// Define our own SelectorsProviderProps interface
interface SelectorsProviderProps {
  selectors: any[];
  selected: any;
  add: (selector: string) => void;
  select: (selector: any) => void;
  remove: (selector: any) => void;
}

const CustomSelectorManager: React.FC<SelectorsProviderProps> = ({
  selectors,
  selected,
  add,
  select,
  remove,
}) => {
  const [newSelector, setNewSelector] = React.useState("");

  const handleAddSelector = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSelector.trim()) {
      add(newSelector.trim());
      setNewSelector("");
    }
  };

  if (!selected) {
    return <div className="p-3 text-center">Select an element to manage selectors</div>;
  }

  return (
    <div className="custom-selector-manager p-3">
      <h4 className="text-lg font-bold mb-3">Selectors</h4>
      
      <form onSubmit={handleAddSelector} className="mb-3 flex">
        <input
          type="text"
          value={newSelector}
          onChange={(e) => setNewSelector(e.target.value)}
          placeholder="Add new selector"
          className="flex-grow p-1 border border-gray-300 rounded-l"
        />
        <button
          type="submit"
          className="px-2 py-1 bg-blue-500 text-white rounded-r"
        >
          Add
        </button>
      </form>
      
      <div className="selector-list">
        {selectors.map((selector: any) => (
          <div
            key={selector.getId()}
            className={`selector-item flex items-center justify-between p-2 mb-1 rounded ${
              selector.getActive() ? "bg-blue-100" : "bg-gray-100"
            }`}
            onClick={() => select(selector)}
          >
            <span>{selector.getLabel()}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                remove(selector);
              }}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomSelectorManager;