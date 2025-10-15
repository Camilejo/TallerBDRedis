import "leaflet";

declare module "leaflet" {
  export function heatLayer(
    latlngs: [number, number, number?][],
    options?: {
      radius?: number;
      blur?: number;
      maxZoom?: number;
      max?: number;
      minOpacity?: number;
      gradient?: Record<number, string>;
    }
  ): L.Layer;
}
