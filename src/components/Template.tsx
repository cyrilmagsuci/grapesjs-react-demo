import React, { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import "../App.scss";
import { Heading } from "blocksin-system";
import { ScrollArea } from "blocksin-system";
import { ComponentDefinition } from "grapesjs";
import { ComponentType, toComponentType, toComponentTypeArray } from "../types/componentType";

interface BoxProps {
  style?: React.CSSProperties;
  children?: React.ReactNode;
  className?: string;
}

export const Box: React.FC<BoxProps> = ({ style, children, className }) => {
  return (
    <div style={{ ...style }} className={className}>
      {children}
    </div>
  );
};

interface AvatarProps {
  style?: React.CSSProperties;
  src: string;
  className?: string;
  text?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ style, src, className, text }) => {
  return (
    <div style={{ ...style }} className={className}>
      <img src={src} alt={text} />
    </div>
  );
};

interface TextProps {
  style?: React.CSSProperties;
  children?: React.ReactNode;
  className?: string;
}

export const Text: React.FC<TextProps> = ({ style, children, className }) => {
  return (
    <p style={style} className={className}>
      {children}
    </p>
  );
};

// Using ComponentType interface from ../types/componentType.ts

import { Editor } from 'grapesjs';

interface TemplateProps {
  editor: Editor | null;
}

export const Template: React.FC<TemplateProps> = ({ editor }) => {
  const [content, setContent] = useState<ComponentType[]>([]);
  const [markup, setMarkup] = useState<string>("");

  // Load content from editor and localStorage, and set up listeners for changes
  useEffect(() => {
    console.log("Template: Component mounted, editor:", editor ? "available" : "not available");
    
    // Function to load content from localStorage (fallback)
    const loadContentFromLocalStorage = () => {
      console.log("Template: Loading content from localStorage (fallback)");
      const savedContent = localStorage.getItem("MyPage");
      if (savedContent) {
        try {
          const parsed = JSON.parse(savedContent);
          console.log("Template: Content loaded from localStorage", parsed.components.length, "components");
          // Map loaded components ensuring type is always a string
          const typedComponents = toComponentTypeArray(parsed.components);
          setContent(typedComponents);
        } catch (error) {
          console.error("Template: Error parsing content from localStorage", error);
          setContent([]);
        }
      } else {
        console.log("Template: No content found in localStorage");
        setContent([]);
      }
    };

    // Function to load content directly from editor
    const loadContentFromEditor = () => {
      if (editor) {
        try {
          console.log("Template: Loading content directly from editor");
          const components = editor.getComponents();
          const componentsJson = components.toJSON();
          console.log("Template: Content loaded from editor", componentsJson.length, "components");

          // Only update state if components actually changed to prevent unnecessary renders
          const currentComponentsStr = JSON.stringify(content);
          const newComponentsStr = JSON.stringify(componentsJson);

          if (currentComponentsStr !== newComponentsStr) {
            console.log("Template: Components changed, updating state");
            // Map ComponentDefinition to ComponentType ensuring type is always a string
            const typedComponents = toComponentTypeArray(componentsJson);
            setContent(typedComponents);
          } else {
            console.log("Template: Components unchanged, skipping update");
          }
        } catch (error) {
          console.error("Template: Error loading content from editor", error);
          // Fall back to localStorage if editor access fails
          loadContentFromLocalStorage();
        }
      } else {
        console.log("Template: Editor not available, falling back to localStorage");
        loadContentFromLocalStorage();
      }
    };

    // Load content initially
    loadContentFromEditor();

    // Set up editor event listeners for component changes
    if (editor) {
      console.log("Template: Setting up editor event listeners");
      
      const handleComponentChange = () => {
        console.log("Template: Component changed in editor");
        // Use setTimeout to ensure we get the latest state after the editor has finished its update
        setTimeout(loadContentFromEditor, 0);
      };

      // Debounced version to prevent too many updates
      let debounceTimer: NodeJS.Timeout;
      const debouncedHandleComponentChange = () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(loadContentFromEditor, 300);
      };

      // Force initial load with delay to ensure editor is fully initialized
      setTimeout(loadContentFromEditor, 500);

      // Listen for component add/remove/change events and broader canvas changes
      editor.on('component:add component:remove', handleComponentChange);
      editor.on('component:update component:style:update', debouncedHandleComponentChange);
      editor.on('canvas:drop', handleComponentChange);

      // Set up visible panels
      const viewsPanel = editor.Panels.getPanel('views-container');
      if (viewsPanel) viewsPanel.set('visible', true);

      // Clean up event listeners
      return () => {
        console.log("Template: Cleaning up editor event listeners");
        editor.off('component:add component:remove', handleComponentChange);
        editor.off('component:update component:style:update', debouncedHandleComponentChange);
        editor.off('canvas:drop', handleComponentChange);
        clearTimeout(debounceTimer);
      };
    } else {
      // If editor is not available, fall back to localStorage events
      console.log("Template: Editor not available, setting up localStorage event listener");
      
      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === "MyPage") {
          console.log("Template: Storage changed, reloading content");
          loadContentFromLocalStorage();
        }
      };
      
      window.addEventListener("storage", handleStorageChange);
      
      return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    }
  }, [editor]);

  useEffect(() => {
    const renderMarkup = (component: ComponentType, indent = 0): string => {
      const className = component.classes ? component.classes.join(" ") : "";
      const indentation = "  ".repeat(indent);
      let result = "";

      if (component.type === "Box") {
        result = indentation + "<Box";
        if (component.style) {
          result += " style={" + JSON.stringify(component.style) + "}";
        }
        if (className) {
          result += ` className="${className}"`;
        }
        result += ">\n";
        
        if (component.components && component.components.length > 0) {
          result += component.components.map(child => 
            renderMarkup(child, indent + 1)
          ).join("\n");
        } else {
          result += indentation + "  // content goes here\n";
        }
        
        result += indentation + "</Box>";
      } else if (component.type === "text") {
        result = indentation + "<Text";
        if (component.style) {
          result += " style={" + JSON.stringify(component.style) + "}";
        }
        if (className) {
          result += ` className="${className}"`;
        }
        result += ">";
        
        if (component.components && component.components.length > 0) {
          result += component.components.map(child => child.content).join("");
        } else if (component.content) {
          result += component.content;
        }
        
        result += "</Text>";
      } else if (component.type === "avatar") {
        result = indentation + "<Avatar";
        if (component.style) {
          result += " style={" + JSON.stringify(component.style) + "}";
        }
        
        const src = component.components && component.components[0] && 
                   component.components[0].attributes && 
                   component.components[0].attributes.src 
                   ? component.components[0].attributes.src : "";
        
        const alt = component.components && component.components[0] && 
                   component.components[0].attributes && 
                   component.components[0].attributes.alt 
                   ? component.components[0].attributes.alt : "";
        
        result += ` src="${src}"`;
        
        if (className) {
          result += ` className="${className}"`;
        }
        
        if (alt) {
          result += ` text="${alt}"`;
        }
        
        result += " />";
      }
      
      return result;
    };

    setMarkup(content.map(component => renderMarkup(component)).join("\n"));
  }, [content]);

  const renderComponent = (component: ComponentType): React.ReactNode => {
    const className = component.classes ? component.classes.join(" ") : "";

    if (component.type === "Box") {
      return (
        <Box style={component.style} className={className}>
          {component.components?.map((child, index) => (
            <React.Fragment key={index}>
              {renderComponent(child)}
            </React.Fragment>
          ))}
        </Box>
      );
    } else if (component.type === "text") {
      return (
        <Text style={component.style} className={className}>
          {component.components?.map((child) => child.content).join("") ||
            component.content}
        </Text>
      );
    } else if (component.type === "avatar") {
      const src = component.components?.[0]?.attributes?.src || "";
      const alt = component.components?.[0]?.attributes?.alt || "";
      
      return (
        <Avatar
          style={component.style}
          src={src}
          className={className}
          text={alt}
        />
      );
    }
    return null;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        flex: 1,
        gap: 16,
        overflow: "hidden",
      }}
    >
      <Heading level={4} weight="bold">
        React Render
      </Heading>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "white",
          border: "1px solid var(--border-neutral-subtle)",
          boxShadow: "var(--shadow-level-1)",
        }}
        className="page"
      >
        {content.map((component, index) => (
          <React.Fragment key={index}>
            {renderComponent(component)}
          </React.Fragment>
        ))}
      </div>
      <Heading level={4} weight="bold">
        React Markup
      </Heading>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          boxShadow: "var(--shadow-level-1)",
          whiteSpace: "pre-wrap",
          overflow: "hidden",
        }}
        className="markup"
      >
        <ScrollArea>
          <SyntaxHighlighter
            language="jsx"
            showLineNumbers={true}
            style={vscDarkPlus}
          >
            {markup}
          </SyntaxHighlighter>
        </ScrollArea>
      </div>
    </div>
  );
};