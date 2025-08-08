declare module '@grapesjs/react' {
  import React from 'react';
  import { Editor, ProjectData } from 'grapesjs';

  // Main editor component props
  export interface EditorProps {
    grapesjs: any;
    grapesjsCss?: string;
    plugins?: any[];
    options?: any;
    onEditor?: (editor: Editor) => void;
    onReady?: (editor: Editor) => void;
    onUpdate?: (projectData: ProjectData, editor: Editor) => void;
    children?: React.ReactNode;
    className?: string;
  }

  // Main editor component
  export const GrapesJsEditor: React.FC<EditorProps>;
  export default GrapesJsEditor;

  // Canvas component
  export const Canvas: React.FC<{ className?: string }>;

  // Provider components
  export const BlocksProvider: React.FC<{ children: (props: any) => React.ReactNode }>;
  export const PagesProvider: React.FC<{ children: (props: any) => React.ReactNode }>;
  export const StylesProvider: React.FC<{ children: (props: any) => React.ReactNode }>;
  export const SelectorsProvider: React.FC<{ children: (props: any) => React.ReactNode }>;
  export const TraitsProvider: React.FC<{ children: (props: any) => React.ReactNode }>;
  export const LayersProvider: React.FC<{ children: (props: any) => React.ReactNode }>;
  export const DevicesProvider: React.FC<{ children: (props: any) => React.ReactNode }>;
  export const AssetsProvider: React.FC<{ children: (props: any) => React.ReactNode }>;
  export const ModalProvider: React.FC<{ children: (props: any) => React.ReactNode }>;

  // Utility components
  export const WithEditor: React.FC<{ children: React.ReactNode }>;
  export const useEditor: () => Editor;
}