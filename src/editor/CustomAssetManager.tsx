import React, { useState } from "react";

// Define our own Asset interface that matches what we need
interface Asset {
  src: string;
  type: string;
  name?: string;
}

// Props interface for our component
interface CustomAssetManagerProps {
  // The assets from GrapesJS will be converted to our Asset type
  assets: any[];
  // The select function expects GrapesJS's Asset type
  select: (asset: Asset, complete?: boolean) => void;
  close: () => void;
}

const CustomAssetManager: React.FC<CustomAssetManagerProps> = ({
  assets,
  select,
  close,
}) => {
  const [newAssetUrl, setNewAssetUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAssetUrl.trim()) {
      select({ src: newAssetUrl, type: "image" });
      setNewAssetUrl("");
      close();
    }
  };

  return (
    <div className="custom-asset-manager p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Asset Manager</h3>
        <button
          onClick={close}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <label className="block text-sm mb-1">Add image URL</label>
          <div className="flex">
            <input
              type="text"
              value={newAssetUrl}
              onChange={(e) => setNewAssetUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-grow p-2 border border-gray-300 rounded-l"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-r"
            >
              Add
            </button>
          </div>
        </div>
      </form>

      <div className="asset-grid grid grid-cols-3 gap-3">
        {assets.map((asset, index) => (
          <div
            key={index}
            className="asset-item border border-gray-200 rounded overflow-hidden cursor-pointer hover:border-blue-500"
            onClick={() => {
              select(asset);
              close();
            }}
          >
            <img
              src={asset.src}
              alt={asset.name || `Asset ${index + 1}`}
              className="w-full h-24 object-cover"
            />
            <div className="p-2 text-sm truncate">{asset.name || asset.src}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomAssetManager;