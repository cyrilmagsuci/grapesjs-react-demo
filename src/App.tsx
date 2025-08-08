/**
 * GrapesJS React Demo App
 * 
 * This file contains the main application component for the GrapesJS React demo.
 * 
 * Key changes to fix rendering issues:
 * 1. Moved GrapesJS and plugin scripts to the head section in index.html to ensure they're loaded before React
 * 2. Added a link to the GrapesJS CSS file in the head section to ensure styles are properly applied
 * 3. Updated the editor initialization to ensure components are properly registered
 * 4. Added extensive logging to help with debugging
 * 5. Ensured proper event handling for editor updates
 * 
 * The app uses the following components:
 * - GrapesJsEditor: The main editor component from @grapesjs/react
 * - Canvas: The canvas component where the editor content is rendered
 * - RightSidebar: A custom component that contains the design panels
 * - Template: A custom component that renders the editor content in React
 */

import React, { useState, useCallback, useEffect } from "react";
import GjsEditor, {
  Canvas,
  AssetsProvider,
  ModalProvider,
  EditorProps
} from "@grapesjs/react";
import { Template } from "./components";
import "./App.scss";
import {
  Button,
  Toolbar,
  Heading,
  IconButton,
} from "blocksin-system";
import {
  TrashIcon,
} from "sebikostudio-icons";
// Import type definitions from our local types file
import type { Editor, ProjectData } from "grapesjs";

// Custom components for the editor
import CustomAssetManager from "./editor/CustomAssetManager";
import CustomModal from "./editor/CustomModal";
import Topbar from "./editor/Topbar";
import RightSidebar from "./editor/RightSidebar";

// Default editor options
const defaultEditorOptions = {
  height: "100%",
  width: "auto",
  storageManager: false,
  undoManager: {
    trackSelection: true
  },
  selectorManager: {
    componentFirst: true
  },
  // Add canvas styles to load our custom CSS
  canvas: {
    styles: ['/grapes.css']
  },
  // Mount built-in Style Manager into our sidebar container when available
  styleManager: {
    ...({} as any),
    appendTo: '#gjs-style-manager',
    sectors: [
      {
        name: 'Dimension',
        open: false,
        properties: ['width', 'height', 'min-width', 'min-height', 'max-width', 'max-height', 'padding', 'margin']
      },
      {
        name: 'Typography',
        open: false,
        properties: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'text-decoration', 'text-shadow']
      },
      {
        name: 'Decorations',
        open: false,
        properties: ['background-color', 'border', 'border-radius', 'box-shadow']
      },
      {
        name: 'Extra',
        open: false,
        properties: ['opacity', 'transition', 'transform']
      }
    ]
  },
  deviceManager: {
    devices: [
      {
        name: 'Desktop',
        width: '',
      },
      {
        name: 'Tablet',
        width: '768px',
        widthMedia: '992px',
      },
      {
        name: 'Mobile',
        width: '320px',
        widthMedia: '480px',
      }
    ]
  },
  assetManager: {
    assets: [
      "https://via.placeholder.com/350x250/78c5d6/fff",
      "https://via.placeholder.com/350x250/459ba8/fff",
      "https://via.placeholder.com/350x250/79c267/fff",
      "https://via.placeholder.com/350x250/c5d647/fff",
      "https://via.placeholder.com/350x250/f28c33/fff",
      "https://via.placeholder.com/350x250/e868a2/fff",
      "https://via.placeholder.com/350x250/cc4360/fff"
    ]
  },
  // Load components from localStorage if available
  components: () => {
    const savedContent = localStorage.getItem("MyPage");
    return savedContent ? JSON.parse(savedContent).components : [];
  }
};

// Default editor props
const defaultEditorProps: Partial<EditorProps> = {
  grapesjs: window.grapesjs,
  // We're loading the CSS in index.html, so we don't need to specify it here
  // grapesjsCss: "https://unpkg.com/grapesjs@0.22.12/dist/css/grapes.min.css",
  // We're loading the plugins in index.html, so we don't need to specify them here
  // plugins: [
  //   {
  //     id: "gjs-blocks-basic",
  //     src: "https://unpkg.com/grapesjs-blocks-basic"
  //   },
  //   "grapesjs-plugin-forms",
  //   "grapesjs-component-countdown"
  // ],
  options: defaultEditorOptions
};

function App() {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [reloadTemplate, setReloadTemplate] = useState(false);
  const [projectData, setProjectData] = useState<ProjectData>();
  const [selectedComponent, setSelectedComponent] = useState<any>(null);
  
  // Effect to initialize editor with saved content and ensure CSS is loaded
  useEffect(() => {
    if (editor) {
      console.log('Editor initialized');
      
      // Ensure the built-in Style Manager is rendered into our custom container
      setTimeout(() => {
        try {
          const styleManagerContainer = document.querySelector('#gjs-style-manager');
          if (styleManagerContainer) {
            editor.StyleManager.render();
            console.log('Built-in Style Manager rendered');
          } else {
            console.log('Style Manager container not yet available');
          }
        } catch (error) {
          console.error('Error rendering Style Manager:', error);
        }
      }, 0);

      // Force a refresh of the editor to ensure all panels are properly rendered
      setTimeout(() => {
        try {
          // Explicitly show panels that might be hidden
          const viewsPanel = editor.Panels.getPanel('views-container');
          const devicesPanel = editor.Panels.getPanel('panel-devices');
          const switcherPanel = editor.Panels.getPanel('panel-switcher');

          // Only set visibility if panels exist
          if (viewsPanel) viewsPanel.set('visible', true);
          if (devicesPanel) devicesPanel.set('visible', true);
          if (switcherPanel) switcherPanel.set('visible', true);

          // Force redraw of the editor
          editor.refresh();
          console.log('Initial editor refresh completed');
          
          // Select the first component if available to trigger panel updates
          const components = editor.getComponents();
          if (components.length > 0) {
            const firstComponent = components.at(0);
            editor.select(firstComponent);
            console.log('Selected first component to trigger panel updates:', firstComponent.get('type'));
          } else {
            console.log('No components available to select');
          }
        } catch (error) {
          console.error('Error during initial editor refresh:', error);
        }
      }, 1000);
      
      // We're now loading the CSS in index.html, so we don't need to do it here
      // But we'll keep the check just in case
      const linkId = 'grapesjs-css';
      if (!document.getElementById(linkId)) {
        console.log('GrapesJS CSS not found, adding it dynamically');
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/grapesjs@0.22.12/dist/css/grapes.min.css';
        document.head.appendChild(link);
        console.log('GrapesJS CSS loaded dynamically');
      } else {
        console.log('GrapesJS CSS already loaded');
      }

      // Register custom components directly in the editor
      try {
        console.log('Registering custom components directly in the editor');
        
        // Log the available component types to help with debugging
        console.log('Available component types:', Object.keys(editor.Components.getTypes()));
        
        // Register Box component
        if (!editor.Components.getType('Box')) {
          console.log('Registering Box component...');
          editor.DomComponents.addType('Box', {
            model: {
              defaults: {
                tagName: 'div',
                draggable: true,
                droppable: true,
                attributes: { class: 'box-block' },
                traits: [
                  {
                    type: 'select',
                    label: 'Direction',
                    name: 'direction',
                    options: [
                      { id: 'direction-row', value: 'direction-row', name: 'Row' },
                      { id: 'direction-column', value: 'direction-column', name: 'Column' },
                    ],
                    changeProp: true,
                  },
                ],
              },
              init() {
                // @ts-ignore - this is a valid GrapesJS method but not typed correctly
                this.listenTo(this, 'change:direction', this.updateDirection);
              },
              updateDirection() {
                // @ts-ignore - this is a valid GrapesJS method but not typed correctly
                const direction = this.get('direction');
                if (direction) {
                  // @ts-ignore - these are valid GrapesJS methods but not typed correctly
                  this.removeClass('direction-row direction-column');
                  this.addClass(direction);
                }
              },
            },
            view: {
              onRender() {
                // @ts-ignore - model is available in GrapesJS view
                const model = this.model;
                const direction = model.get('direction');
                if (!direction) {
                  model.set('direction', 'direction-column');
                }
              }
            }
          });
          console.log('Box component registered successfully');
        } else {
          console.log('Box component already registered');
        }

        // Register Text component
        if (!editor.Components.getType('text')) {
          console.log('Registering Text component...');
          editor.DomComponents.addType('text', {
            model: {
              defaults: {
                tagName: 'p',
                draggable: true,
                droppable: false,
                traits: [
                  {
                    type: 'select',
                    label: 'Size',
                    name: 'size',
                    options: [
                      { id: 'text-small', value: 'text-small', name: 'Small' },
                      { id: 'text-medium', value: 'text-medium', name: 'Medium' },
                      { id: 'text-large', value: 'text-large', name: 'Large' },
                    ],
                    changeProp: true,
                  },
                  {
                    type: 'checkbox',
                    label: 'Bold',
                    name: 'bold',
                    changeProp: true,
                  },
                ],
              },
              init() {
                // @ts-ignore - these are valid GrapesJS methods but not typed correctly
                this.listenTo(this, 'change:size', this.updateSize);
                this.listenTo(this, 'change:bold', this.updateBold);
              },
              updateSize() {
                // @ts-ignore - this is a valid GrapesJS method but not typed correctly
                const size = this.get('size');
                if (size) {
                  // @ts-ignore - these are valid GrapesJS methods but not typed correctly
                  this.removeClass('text-small text-medium text-large');
                  this.addClass(size);
                }
              },
              updateBold() {
                // @ts-ignore - this is a valid GrapesJS method but not typed correctly
                const isBold = this.get('bold');
                if (isBold) {
                  // @ts-ignore - these are valid GrapesJS methods but not typed correctly
                  this.addClass('bold');
                } else {
                  this.removeClass('bold');
                }
              },
            },
            view: {
              onRender() {
                // @ts-ignore - model is available in GrapesJS view
                const model = this.model;
                const size = model.get('size');
                if (!size) {
                  model.set('size', 'text-medium');
                }
              }
            }
          });
          console.log('Text component registered successfully');
        } else {
          console.log('Text component already registered');
        }

        // Register Avatar component
        if (!editor.Components.getType('avatar')) {
          console.log('Registering Avatar component...');
          editor.DomComponents.addType('avatar', {
            model: {
              defaults: {
                tagName: 'div',
                draggable: true,
                droppable: false,
                attributes: { class: 'avatar-block' },
                traits: [
                  {
                    type: 'text',
                    label: 'Image URL',
                    name: 'src',
                    changeProp: true,
                  },
                  {
                    type: 'text',
                    label: 'Alt Text',
                    name: 'alt',
                    changeProp: true,
                  },
                ],
              },
              init() {
                // @ts-ignore - these are valid GrapesJS methods but not typed correctly
                this.listenTo(this, 'change:src', this.updateSrc);
                this.listenTo(this, 'change:alt', this.updateAlt);
              },
              updateSrc() {
                // @ts-ignore - these are valid GrapesJS methods but not typed correctly
                const src = this.get('src');
                const components = this.get('components');
                if (components && components.length > 0) {
                  components.at(0)?.set({ src });
                }
              },
              updateAlt() {
                // @ts-ignore - these are valid GrapesJS methods but not typed correctly
                const alt = this.get('alt');
                const components = this.get('components');
                if (components && components.length > 0) {
                  components.at(0)?.set({ alt });
                }
              },
            },
            view: {
              onRender() {
                // @ts-ignore - model is available in GrapesJS view
                const model = this.model;
                const components = model.get('components');
                let src = '';
                let alt = '';
                
                if (components && components.length > 0) {
                  const firstComponent = components.at(0);
                  const attributes = firstComponent?.get('attributes');
                  if (attributes) {
                    src = attributes.src;
                    alt = attributes.alt;
                  }
                }
                
                if (!src) {
                  model.set('src', 'https://via.placeholder.com/150');
                }
                
                if (!alt) {
                  model.set('alt', 'Avatar');
                }
              }
            }
          });
          console.log('Avatar component registered successfully');
        } else {
          console.log('Avatar component already registered');
        }

        // Log available blocks to help with debugging
        console.log('Available blocks:', editor.BlockManager.getAll().map((block: { id: string }) => block.id));
        
        // Set up event listeners for component selection to update panels
        editor.on('component:selected', (component: any) => {
          console.log('Component selected:', component ? component.get('type') : 'none');
          setSelectedComponent(component);

          // Ensure panels are visible when a component is selected
          const viewsPanel = editor.Panels.getPanel('views-container');
          if (viewsPanel) viewsPanel.set('visible', true);

          // Force re-render of panels
          editor.trigger('change:selectedComponent');
        });

        editor.on('component:deselected', () => {
          console.log('Component deselected');
          setSelectedComponent(null);
        });

        // Register custom blocks
        if (!editor.BlockManager.get('box-block')) {
          console.log('Registering Box block');
          editor.BlockManager.add('box-block', {
            label: 'Box',
            content: {
              type: 'Box',
              components: [],
              attributes: { class: 'box-block' },
            },
            category: 'Components',
          });
          console.log('Box block registered successfully');
        } else {
          console.log('Box block already registered');
        }

        if (!editor.BlockManager.get('text-block')) {
          console.log('Registering Text block');
          editor.BlockManager.add('text-block', {
            label: 'Text',
            content: {
              type: 'text',
              content: 'Text',
              traits: [
                {
                  type: 'select',
                  label: 'Size',
                  name: 'size',
                  options: [
                    { id: 'text-small', value: 'text-small', name: 'Small' },
                    { id: 'text-medium', value: 'text-medium', name: 'Medium' },
                    { id: 'text-large', value: 'text-large', name: 'Large' },
                  ],
                  changeProp: true,
                },
              ],
            },
            category: 'Components',
          });
          console.log('Text block registered successfully');
        } else {
          console.log('Text block already registered');
        }

        if (!editor.BlockManager.get('avatar-block')) {
          console.log('Registering Avatar block');
          editor.BlockManager.add('avatar-block', {
            label: 'Avatar',
            content: {
              type: 'avatar',
              components: [
                {
                  type: 'image',
                  tagName: 'img',
                  attributes: {
                    src: 'https://via.placeholder.com/150',
                    alt: 'Avatar',
                  },
                },
              ],
              attributes: { class: 'avatar-block' },
            },
            category: 'Components',
          });
          console.log('Avatar block registered successfully');
        } else {
          console.log('Avatar block already registered');
        }
        
        // Log available blocks after registration to confirm they were added
        console.log('Available blocks after registration:', editor.BlockManager.getAll().map((block: { id: string }) => block.id));
        
        // Final confirmation log
        console.log('Component and block registration completed successfully');
        console.log('Available component types:', Object.keys(editor.Components.getTypes()));
        console.log('Available blocks:', editor.BlockManager.getAll().map(block => block.id));
      } catch (error) {
        console.error('Error registering components:', error);
      }

      // Load saved content if available
      const savedContent = localStorage.getItem("MyPage");
      if (savedContent) {
        try {
          const content = JSON.parse(savedContent);
          console.log('Loading saved content', content.components.length, 'components');
          editor.setComponents(content.components);
          console.log('Saved content loaded successfully');
          
          // Log the loaded components to help with debugging
          console.log('Loaded components:', editor.getComponents().length);
          console.log('First component type:', editor.getComponents().length > 0 ? editor.getComponents().at(0).get('type') : 'none');
        } catch (error) {
          console.error('Error loading saved content', error);
        }
      } else {
        console.log('No saved content found in localStorage');
      }
      
      // Force a redraw of the editor
      setTimeout(() => {
        try {
          editor.refresh();
          console.log('Editor refreshed successfully');
          
          // Log the editor state after refresh to help with debugging
          console.log('Editor components after refresh:', editor.getComponents().length);
          console.log('Editor canvas:', editor.Canvas ? 'available' : 'not available');
          console.log('Editor panels:', editor.Panels ? 'available' : 'not available');
          console.log('Editor styles:', editor.StyleManager ? 'available' : 'not available');
        } catch (error) {
          console.error('Error refreshing editor:', error);
        }
      }, 500);
    }
  }, [editor]);

  // Handle editor update
  const onProjectUpdate = useCallback<Required<EditorProps>["onUpdate"]>(
    (pd, editor) => {
      console.log('Project updated', pd);
      setProjectData(pd);
      
      // This ensures the Template component gets updated when editor content changes
      const components = editor.getComponents();
      const savedContent = {
        components: components.toJSON(),
      };
      
      // Log detailed information about the components
      console.log('Components to save:', components.length);
      if (components.length > 0) {
        console.log('First component type:', components.at(0).get('type'));
        console.log('First component attributes:', components.at(0).get('attributes'));
      }
      
      // Save to localStorage
      localStorage.setItem("MyPage", JSON.stringify(savedContent));
      console.log('Content saved to localStorage successfully');
      
      // Force a re-render of the Template component
      setReloadTemplate((prev) => !prev);
      console.log('Template reload triggered');
      
      // Log the current state to help with debugging
      console.log('Components saved:', components.length);
      
      // Force a refresh of the editor to ensure all panels are properly rendered
      setTimeout(() => {
        try {
          editor.refresh();
          console.log('Editor refreshed after update');
          
          // Log the editor state after refresh
          console.log('Editor components after update refresh:', editor.getComponents().length);
          console.log('Editor canvas after update:', editor.Canvas ? 'available' : 'not available');
          console.log('Editor panels after update:', editor.Panels ? 'available' : 'not available');
        } catch (error) {
          console.error('Error refreshing editor after update:', error);
        }
      }, 100);
    },
    []
  );

  // Handle save
  const handleSave = () => {
    console.log('Save button clicked');
    if (editor) {
      try {
        const components = editor.getComponents();
        console.log('Components to save:', components.length);
        
        const savedContent = {
          components: components.toJSON(),
        };
        localStorage.setItem("MyPage", JSON.stringify(savedContent));
        console.log('Content saved to localStorage successfully');
        
        setReloadTemplate((prev) => !prev);
        console.log('Template reload triggered');
      } catch (error) {
        console.error('Error saving content:', error);
      }
    } else {
      console.error('Editor not available for saving');
    }
  };

  // Handle clear editor
  const handleClearEditor = () => {
    console.log('Clear button clicked');
    if (editor) {
      try {
        editor.DomComponents.clear();
        console.log('Editor components cleared');
        
        localStorage.removeItem("MyPage");
        console.log('Content removed from localStorage');
        
        setReloadTemplate((prev) => !prev);
        console.log('Template reload triggered after clear');
      } catch (error) {
        console.error('Error clearing editor:', error);
      }
    } else {
      console.error('Editor not available for clearing');
    }
  };

  return (
    <div className="GrapesJsApp">
      <Toolbar
        style={{
          position: "fixed",
          top: "16px",
          right: "16px",
          zIndex: "99",
          gap: "8px",
        }}
      >
        <IconButton variant="danger" onClick={handleClearEditor}>
          <TrashIcon />
        </IconButton>
        <Button onClick={handleSave}>Save</Button>
      </Toolbar>

      <GjsEditor
        className="gjs-custom-editor"
        {...defaultEditorProps}
        grapesjs={window.grapesjs} // Explicitly set grapesjs to ensure it's available
        onEditor={setEditor}
        onUpdate={onProjectUpdate}
      >
        <div className="flex h-full">
          <div className="flex flex-col flex-grow">
            <Topbar className="min-h-[48px]" />
            <div className="flex" style={{ padding: "0 16px", gap: "16px" }}>
              <div className="Editor">
                <Heading level={4} weight="bold">
                  Editor
                </Heading>
                {/* Make sure Canvas has the correct className and is properly rendered */}
                <Canvas className="flex-grow gjs-custom-editor-canvas" />
              </div>
              {/* Make sure Template receives the editor prop and has a unique key */}
              <Template key={reloadTemplate.toString()} editor={editor} />
            </div>
          </div>
          {/* Make sure RightSidebar has the correct className and is properly rendered */}
          <RightSidebar className="gjs-column-r w-[300px] border-l" editor={editor} />
        </div>
        <ModalProvider>
          {({ open, title, content, close }) => (
            <CustomModal
              open={open}
              title={<>{title}</>}
              children={<>{content}</>}
              close={close}
            />
          )}
        </ModalProvider>
        <AssetsProvider>
          {({ assets, select, close, Container }) => (
            <Container>
              <CustomAssetManager
                assets={assets}
                select={select}
                close={close}
              />
            </Container>
          )}
        </AssetsProvider>
      </GjsEditor>
    </div>
  );
}

export default App;