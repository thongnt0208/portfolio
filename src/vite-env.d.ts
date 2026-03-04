/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

// Support for importing markdown files as raw strings
declare module '*.md?raw' {
  const content: string;
  export default content;
}
