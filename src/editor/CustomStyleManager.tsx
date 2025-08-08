import React from "react";
import { StylesProvider } from "@grapesjs/react";

// Define our own StylesProviderProps interface
interface StylesProviderProps {
  sectors: any[];
  properties: any[];
  selected: any;
}

const CustomStyleManager: React.FC<StylesProviderProps> = ({ sectors, properties, selected }) => {
  if (!selected) {
    return <div className="p-3 text-center">Select an element to style</div>;
  }

  return (
    <div className="custom-style-manager p-3">
      <h4 className="text-lg font-bold mb-3">Styles</h4>
      {sectors.map((sector: any) => (
        <div key={sector.id} className="mb-4">
          <h5 className="text-md font-semibold mb-2">{sector.name}</h5>
          <div className="space-y-2">
            {properties
              .filter((prop: any) => prop.getSector() === sector.id)
              .map((prop: any) => (
                <div key={prop.getId()} className="property-item">
                  <label className="block text-sm mb-1">{prop.getLabel()}</label>
                  <div className="property-field">
                    {prop.getType() === "color" ? (
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 mr-2 border border-gray-300"
                          style={{ backgroundColor: prop.getValue() || "" }}
                        ></div>
                        <input
                          type="text"
                          value={prop.getValue() || ""}
                          onChange={(e) => prop.setValue(e.target.value)}
                          className="w-full p-1 border border-gray-300 rounded"
                        />
                      </div>
                    ) : prop.getType() === "select" ? (
                      <select
                        value={prop.getValue() || ""}
                        onChange={(e) => prop.setValue(e.target.value)}
                        className="w-full p-1 border border-gray-300 rounded"
                      >
                        {prop.getOptions().map((option: { id: string, value: string, name: string }) => (
                          <option key={option.id} value={option.value}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    ) : prop.getType() === "slider" ? (
                      <div className="flex items-center">
                        <input
                          type="range"
                          min={prop.getMin()}
                          max={prop.getMax()}
                          step={prop.getStep()}
                          value={prop.getValue() || 0}
                          onChange={(e) => prop.setValue(e.target.value)}
                          className="w-3/4 mr-2"
                        />
                        <input
                          type="text"
                          value={prop.getValue() || ""}
                          onChange={(e) => prop.setValue(e.target.value)}
                          className="w-1/4 p-1 border border-gray-300 rounded"
                        />
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={prop.getValue() || ""}
                        onChange={(e) => prop.setValue(e.target.value)}
                        className="w-full p-1 border border-gray-300 rounded"
                      />
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomStyleManager;