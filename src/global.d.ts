interface Navigator {
  xr: any;
}

declare module "*.png" {
  const value: any;
  export default value;
}

declare module "*.glb";

declare module "*/alva_ar.js";
declare module "*/alva_ar_three.js";
declare module "*/view.js";
declare module "*/utils.js" {
  const Camera: any;
  const resize2cover: any;
  const createCanvas: any;
  export { Camera, resize2cover, createCanvas };
}
