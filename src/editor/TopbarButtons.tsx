import React, { useEffect, useState } from "react";
import { useEditor } from "@grapesjs/react";
import {
  Button,
  IconButton,
  Flex,
} from "blocksin-system";
import {
  ChevronDownIcon,
  DirectionColumnIcon,
  DirectionRowIcon,
  FontBoldIcon,
  TrashIcon,
} from "sebikostudio-icons";

interface TopbarButtonsProps {
  className?: string;
}

const TopbarButtons: React.FC<TopbarButtonsProps> = ({ className }) => {
  const editor = useEditor();
  const [, setUpdateCounter] = useState(0);
  
  // Define commands to use
  const commands = [
    {
      id: "core:undo",
      label: "Undo",
      disabled: () => !editor.UndoManager.hasUndo(),
    },
    {
      id: "core:redo",
      label: "Redo",
      disabled: () => !editor.UndoManager.hasRedo(),
    },
    {
      id: "core:component-outline",
      label: "Toggle Outline",
    },
    {
      id: "core:preview",
      label: "Preview",
    },
  ];

  useEffect(() => {
    if (!editor) return;

    const cmdEvent = "run stop";
    const updateEvent = "update";
    const updateCounter = () => setUpdateCounter((value) => value + 1);
    const onCommand = (id: string) => {
      commands.find((btn) => btn.id === id) && updateCounter();
    };

    editor.on(cmdEvent, onCommand);
    editor.on(updateEvent, updateCounter);

    return () => {
      editor.off(cmdEvent, onCommand);
      editor.off(updateEvent, updateCounter);
    };
  }, [editor, commands]);

  if (!editor) return null;

  return (
    <Flex className={className} gap={8}>
      {commands.map(({ id, label, disabled }) => (
        <Button
          key={id}
          onClick={() =>
            editor.Commands.isActive(id)
              ? editor.Commands.stop(id)
              : editor.Commands.run(id)
          }
          disabled={disabled ? disabled() : false}
          variant={editor.Commands.isActive(id) ? "primary" : "secondary"}
        >
          {label}
        </Button>
      ))}
    </Flex>
  );
};

export default TopbarButtons;