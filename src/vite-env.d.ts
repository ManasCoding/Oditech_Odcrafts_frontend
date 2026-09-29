import 'react';

declare module '*.mp4' {
  const src: string;
  export default src;
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      mesh: any;
      ringGeometry: any;
      meshBasicMaterial: any;
      directionalLight: any;
      pointLight: any;
      boxGeometry: any;
      meshStandardMaterial: any;
      group: any;
      [elemName: string]: any;
    }
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      mesh: any;
      ringGeometry: any;
      meshBasicMaterial: any;
      directionalLight: any;
      pointLight: any;
      boxGeometry: any;
      meshStandardMaterial: any;
      group: any;
      [elemName: string]: any;
    }
  }
}
