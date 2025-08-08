import React from "react";
import { TraitsProvider } from "@grapesjs/react";

// Define our own TraitsProviderProps interface
interface TraitsProviderProps {
  traits: any[];
  selected: any;
}

const CustomTraitManager: React.FC<TraitsProviderProps> = ({ traits, selected }) => {
  if (!selected) {
    return <div className="p-3 text-center">Select an element to edit traits</div>;
  }

  return (
    <div className="custom-trait-manager p-3">
      <h4 className="text-lg font-bold mb-3">Traits</h4>
      
      <div className="trait-list space-y-3">
        {traits.map((trait: any) => {
          const type = trait.getType();
          
          return (
            <div key={trait.getId()} className="trait-item">
              <label className="block text-sm mb-1">{trait.getLabel()}</label>
              
              {type === "text" && (
                <input
                  type="text"
                  value={trait.getValue()}
                  onChange={(e) => trait.setValue(e.target.value)}
                  className="w-full p-1 border border-gray-300 rounded"
                />
              )}
              
              {type === "number" && (
                <input
                  type="number"
                  value={trait.getValue()}
                  onChange={(e) => trait.setValue(e.target.value)}
                  className="w-full p-1 border border-gray-300 rounded"
                />
              )}
              
              {type === "checkbox" && (
                <input
                  type="checkbox"
                  checked={trait.getValue() === "true"}
                  onChange={(e) => trait.setValue(e.target.checked ? "true" : "false")}
                  className="p-1 border border-gray-300 rounded"
                />
              )}
              
              {type === "select" && (
                <select
                  value={trait.getValue()}
                  onChange={(e) => trait.setValue(e.target.value)}
                  className="w-full p-1 border border-gray-300 rounded"
                >
                  {trait.getOptions().map((option: { id: string, value: string, name: string }) => (
                    <option key={option.id} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </select>
              )}
              
              {type === "color" && (
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 mr-2 border border-gray-300"
                    style={{ backgroundColor: trait.getValue() || "" }}
                  ></div>
                  <input
                    type="text"
                    value={trait.getValue()}
                    onChange={(e) => trait.setValue(e.target.value)}
                    className="w-full p-1 border border-gray-300 rounded"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomTraitManager;