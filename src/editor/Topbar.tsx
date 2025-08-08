import React from "react";
import { DevicesProvider, WithEditor } from "@grapesjs/react";
import {
  Select,
  Button,
  Flex,
  Toolbar,
  Heading,
  Toggle,
  ToggleGroup,
  IconButton,
  Separator,
  Input,
} from "blocksin-system";
import TopbarButtons from "./TopbarButtons";

interface TopbarProps {
  className?: string;
}

const Topbar: React.FC<TopbarProps> = ({ className }) => {
  return (
    <div className={`gjs-top-sidebar flex items-center p-1 ${className || ""}`}>
      <DevicesProvider>
        {({ selected, select, devices }) => (
          <Select value={selected} onValueChange={(value: string) => select(value)}>
            <Select.Trigger aria-label="Device">
              <Select.Value placeholder="Select device" />
            </Select.Trigger>
            <Select.Content
              position="popper"
              side="bottom"
              sideOffset={8}
              align="start"
            >
              {devices.map((device: any) => (
                <Select.Item key={device.id} value={device.id}>
                  {device.getName()}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        )}
      </DevicesProvider>
      <WithEditor>
        <TopbarButtons className="ml-auto px-2" />
      </WithEditor>
    </div>
  );
};

export default Topbar;