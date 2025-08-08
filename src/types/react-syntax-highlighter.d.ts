declare module 'react-syntax-highlighter' {
  import React from 'react';
  
  export const Prism: React.ComponentType<any>;
  export const Light: React.ComponentType<any>;
}

declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
  export const vscDarkPlus: any;
}