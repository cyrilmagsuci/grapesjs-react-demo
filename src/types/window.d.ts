import grapesjs from 'grapesjs';

declare global {
  interface Window {
    grapesjs: typeof grapesjs;
  }
}