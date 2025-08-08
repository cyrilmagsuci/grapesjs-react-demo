declare module 'blocksin-system' {
  import React from 'react';

  // Define types for components used in the project
  export const Select: React.FC<any> & {
    Trigger: React.FC<any>;
    Value: React.FC<any>;
    Content: React.FC<any>;
    Item: React.FC<any>;
  };
  
  export const Button: React.FC<any>;
  export const Flex: React.FC<any>;
  export const Toolbar: React.FC<any>;
  export const Heading: React.FC<any> & {
    level?: number;
    weight?: string;
  };
  export const Toggle: React.FC<any>;
  export const ToggleGroup: React.FC<any> & {
    Item: React.FC<any>;
  };
  export const IconButton: React.FC<any>;
  export const Separator: React.FC<any>;
  export const Input: React.FC<any>;
  export const ScrollArea: React.FC<any>;
}