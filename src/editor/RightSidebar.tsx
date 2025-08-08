import React, { useState, useEffect } from "react";
import {
  BlocksProvider,
  LayersProvider,
  PagesProvider,
  SelectorsProvider,
  StylesProvider,
  TraitsProvider
} from "@grapesjs/react";
import CustomBlockManager from "./CustomBlockManager";
import CustomLayerManager from "./CustomLayerManager";
import CustomSelectorManager from "./CustomSelectorManager";
import CustomStyleManager from "./CustomStyleManager";
import CustomTraitManager from "./CustomTraitManager";

import { Editor } from 'grapesjs';

interface RightSidebarProps {
  className?: string;
  editor: Editor | null;
}

  const RightSidebar: React.FC<RightSidebarProps> = ({ className, editor }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [hasSelectedComponent, setHasSelectedComponent] = useState(false);

  // Listen for component selection events from the editor
  useEffect(() => {
    if (editor) {
      const handleComponentSelected = () => {
        console.log('RightSidebar: Component selected event');
        setHasSelectedComponent(true);

        // Switch to styles tab when a component is selected
        if (selectedTab !== 0) {
          setSelectedTab(0);
        }
      };

      const handleComponentDeselected = () => {
        console.log('RightSidebar: Component deselected event');
        setHasSelectedComponent(false);
      };

      // Register event listeners
      editor.on('component:selected', handleComponentSelected);
      editor.on('component:deselected', handleComponentDeselected);

      // Check if there's already a selected component
      const selected = editor.getSelected();
      if (selected) {
        setHasSelectedComponent(true);
      }

      return () => {
        // Clean up listeners when component unmounts
        editor.off('component:selected', handleComponentSelected);
        editor.off('component:deselected', handleComponentDeselected);
      };
    }
  }, [editor, selectedTab]);

  const tabs = [
    { name: "Styles", icon: "🎨" },
    { name: "Traits", icon: "⚙️" },
    { name: "Layers", icon: "📚" },
    { name: "Blocks", icon: "🧩" },
    { name: "Pages", icon: "📄" }
  ];

  return (
    <div className={`gjs-right-sidebar flex flex-col ${className || ""}`}>
      <div className="tabs flex border-b">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`tab-button flex-1 p-2 text-center ${
              selectedTab === index ? "bg-blue-100 border-b-2 border-blue-500" : "bg-gray-50"
            }`}
            onClick={() => setSelectedTab(index)}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="block text-xs">{tab.name}</span>
          </button>
        ))}
      </div>
      <div className="overflow-y-auto flex-grow">
        {selectedTab === 0 && (
          <>
            <div className="p-2 bg-gray-100 text-xs">Selectors & Styles</div>
            {/* Built-in GrapesJS Style Manager (visible only when a component is selected) */}
            {hasSelectedComponent && (
              <div className="p-2">
                <div
                  id="gjs-style-manager"
                  className="gjs-style-manager-built-in"
                  style={{ border: '1px solid var(--border-neutral-subtle)', borderRadius: 4, padding: 8, marginBottom: 8 }}
                />
              </div>
            )}
            <SelectorsProvider>{props => <CustomSelectorManager {...props} editor={editor} />}</SelectorsProvider>
            <StylesProvider>{props => <CustomStyleManager {...props} editor={editor} />}</StylesProvider>
          </>
        )}
        {selectedTab === 1 && (
          <>
            <div className="p-2 bg-gray-100 text-xs">Traits</div>
            <TraitsProvider>{props => <CustomTraitManager {...props} editor={editor} />}</TraitsProvider>
          </>
        )}
        {selectedTab === 2 && (
          <>
            <div className="p-2 bg-gray-100 text-xs">Layers</div>
            <LayersProvider>{props => <CustomLayerManager {...props} editor={editor} />}</LayersProvider>
          </>
        )}
        {selectedTab === 3 && (
          <>
            <div className="p-2 bg-gray-100 text-xs">Blocks</div>
            <BlocksProvider>{props => <CustomBlockManager {...props} editor={editor} />}</BlocksProvider>
          </>
        )}
        {selectedTab === 4 && (
          <>
            <div className="p-2 bg-gray-100 text-xs">Pages</div>
            <PagesProvider>{props => <div className="p-3">Pages Manager</div>}</PagesProvider>
          </>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;