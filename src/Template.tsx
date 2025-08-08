import React, { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./App.scss";
import { Heading } from "blocksin-system";
import { ScrollArea } from "blocksin-system";

interface BoxProps {
  style?: React.CSSProperties;
  children?: React.ReactNode;
  className?: string;
}

const Box: React.FC<BoxProps> = ({ style, children, className }) => {
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

const Avatar: React.FC<AvatarProps> = ({ style, src, className, text }) => {
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

const Text: React.FC<TextProps> = ({ style, children, className }) => {
  return (
    <p style={style} className={className}>
      {children}
    </p>
  );
};

interface ComponentType {
  type: string;
  style?: React.CSSProperties;
  classes?: string[];
  components?: ComponentType[];
  content?: string;
  attributes?: {
    src?: string;
    alt?: string;
    class?: string;
  };
}

const Template: React.FC = () => {
  const [content, setContent] = useState<ComponentType[]>([]);
  const [markup, setMarkup] = useState<string>("");

  useEffect(() => {
    const savedContent = localStorage.getItem("MyPage");
    if (savedContent) {
      setContent(JSON.parse(savedContent).components);
    }
  }, []);

  useEffect(() => {
    const renderMarkup = (component: ComponentType, indent = 0): string => {
      const className = component.classes ? component.classes.join(" ") : "";
      const indentation = "  ".repeat(indent);
      const styleStr = JSON.stringify(component.style, null, 2) || "";

      if (component.type === "Box") {
        const childrenMarkup = component.components?.map((child) => renderMarkup(child, indent + 1)).join("\n") || "// content goes here";
        return `${indentation}<Box style={{${styleStr}}} className="${className}">
${childrenMarkup}
${indentation}</Box>`;
      } else if (component.type === "text") {
        const content = component.components?.map((child) => child.content).join("") || component.content || "";
        return `${indentation}<Text style={{${styleStr}}} className="${className}">${content}</Text>`;
      } else if (component.type === "avatar") {
        const src = component.components?.[0]?.attributes?.src || "";
        const alt = component.components?.[0]?.attributes?.alt || "";
        return `${indentation}<Avatar style={{${styleStr}}} src="${src}" className="${className}" text="${alt}" />`;
      }
      return "";
    };

    setMarkup(content.map((component) => renderMarkup(component)).join("\n"));
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
      return (
        <Avatar
          style={component.style}
          src={component.components?.[0].attributes?.src || ""}
          className={className}
          text={component.components?.[0].attributes?.alt || ""}
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

export { Template, Box, Text, Avatar };