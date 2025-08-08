import { ComponentDefinition } from 'grapesjs';

export interface ComponentType {
  type: string;
  tagName?: string;
  components?: ComponentType[];
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

/**
 * Helper function to convert a ComponentDefinition to ComponentType
 * ensuring the type property is always a string
 */
export function toComponentType(comp: ComponentDefinition): ComponentType {
  return {
    ...comp,
    type: comp.type || '',
    components: comp.components 
      ? comp.components.map((c: ComponentDefinition) => toComponentType(c))
      : undefined
  };
}

/**
 * Helper function to convert an array of ComponentDefinition to ComponentType[]
 */
export function toComponentTypeArray(comps: ComponentDefinition[]): ComponentType[] {
  return comps.map(toComponentType);
}
