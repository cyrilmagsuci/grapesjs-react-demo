// Type definitions for grapesjs 0.22.12

declare module 'grapesjs' {
  export interface ComponentDefinition {
    type?: string;
    tagName?: string;
    components?: ComponentDefinition[];
    content?: string;
    classes?: string[];
    attributes?: Record<string, any>;
    styles?: Record<string, any>;
    draggable?: boolean;
    droppable?: boolean;
    removable?: boolean;
    traits?: Array<any>;
    stylable?: boolean | string[];
    [key: string]: any;
  }

  export interface Component {
    get(property: string): any;
    set(property: string | Record<string, any>, value?: any): this;
    getAttributes(): Record<string, any>;
    addClass(className: string): this;
    removeClass(className: string): this;
    getClasses(): string[];
    append(component: Component | Component[] | ComponentDefinition | ComponentDefinition[]): this;
    toJSON(): ComponentDefinition;
    [key: string]: any;
  }

  export interface Components extends Array<Component> {
    at(index: number): Component;
    length: number;
    toJSON(): ComponentDefinition[];
    [key: string]: any;
  }

  export interface Panel {
    set(property: string, value: any): this;
    get(property: string): any;
  }

  export interface PanelsManager {
    getPanel(id: string): Panel | undefined;
    addPanel(panel: Panel): this;
    removePanel(panel: string | Panel): this;
  }

  export interface Block {
    id: string;
    label: string;
    content: ComponentDefinition | string;
    category: string;
    attributes?: Record<string, any>;
    [key: string]: any;
  }

  export interface BlockManagerConfig {
    appendTo?: HTMLElement | string;
    blocks?: Block[];
  }

  export interface BlockManager {
    getAll(): Block[];
    get(id: string): Block | undefined;
    add(id: string, block: Omit<Block, 'id'>): Block;
    remove(id: string): this;
  }

  export interface DomComponentsConfig {
    stylePrefix?: string;
    wrapperId?: string;
    wrapperName?: string;
    wrapper?: ComponentDefinition;
    components?: ComponentDefinition[];
    imageCompClass?: string;
  }

  export interface ComponentTypeDefinition {
    model: {
      defaults: ComponentDefinition;
      [key: string]: any;
    };
    view: {
      [key: string]: any;
    };
    isComponent?: (el: HTMLElement) => boolean | ComponentDefinition;
  }

  export interface DomComponents {
    getType(type: string): any;
    addType(type: string, definition: ComponentTypeDefinition): this;
    getTypes(): Record<string, any>;
    getComponents(): Components;
    clear(): this;
    addComponent(component: ComponentDefinition): Component;
  }

  export interface EditorConfig {
    canvas?: Record<string, any>;
    components?: ComponentDefinition[] | (() => ComponentDefinition[]);
    style?: string | Array<Record<string, any>>;
    height?: string | number;
    width?: string | number;
    panels?: Record<string, any>;
    blockManager?: BlockManagerConfig;
    styleManager?: Record<string, any>;
    selectorManager?: Record<string, any>;
    deviceManager?: Record<string, any>;
    assetManager?: Record<string, any>;
    storageManager?: Record<string, any> | false;
    undoManager?: Record<string, any> | boolean;
    dragMode?: string;
    [key: string]: any;
  }

  export interface EventHandler {
    (event: string, callback: Function): this;
  }

  export interface Canvas {
    getBody(): HTMLElement;
    getDocument(): Document;
    getWindow(): Window;
    getWrapper(): Component;
    refresh(): void;
  }

  export interface ProjectData {
    assets?: any[];
    components?: ComponentDefinition[];
    pages?: any[];
    styles?: any[];
    [key: string]: any;
  }

  export interface Editor {
    // Main functionality
    getConfig(): EditorConfig;
    setComponents(components: ComponentDefinition[] | string): this;
    getComponents(): Components;
    addComponents(components: ComponentDefinition[] | string): Component[];
    getSelectedAll(): Component[];
    getSelected(): Component | null;
    select(component: Component | Component[]): this;

    // Storage
    store(): Promise<ProjectData>;
    load(): Promise<ProjectData>;

    // Canvas
    Canvas: Canvas;

    // Components
    DomComponents: DomComponents;
    Components: {
      getTypes(): Record<string, any>;
      getType(type: string): any;
    };

    // Panels
    Panels: PanelsManager;

    // Block Manager
    BlockManager: BlockManager;

    // Events
    on: EventHandler;
    off(event: string, callback?: Function): this;
    trigger(event: string, ...params: any[]): this;

    // Various helpers
    refresh(): void;
    getHtml(): string;
    getCss(): string;

    // Style Manager
    StyleManager: any;

    // Asset Manager
    AssetManager: any;

    // Storage Manager
    StorageManager: any;

    // Device Manager
    DeviceManager: any;

    // Selector Manager
    SelectorManager: any;

    // Trait Manager
    TraitManager: any;

    // Commands
    Commands: any;

    // Keymaps
    Keymaps: any;

    // I18n
    I18n: any;

    // Utils
    Utils: any;

    // Rich Text Editor
    RichTextEditor: any;

    // Parser
    Parser: any;

    // Modal
    Modal: any;

    [key: string]: any;
  }

  export function init(config?: EditorConfig): Editor;

  export default init;
}
