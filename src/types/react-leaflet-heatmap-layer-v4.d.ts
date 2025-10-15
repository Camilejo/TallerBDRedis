declare module "react-leaflet-heatmap-layer-v4" {
  import { LayerGroupProps } from "react-leaflet";
  import { LatLngExpression } from "leaflet";
  import { Component } from "react";

  export interface HeatmapLayerProps extends LayerGroupProps {
    points: [number, number, number][];
    longitudeExtractor: (point: [number, number, number]) => number;
    latitudeExtractor: (point: [number, number, number]) => number;
    intensityExtractor: (point: [number, number, number]) => number;
    fitBoundsOnLoad?: boolean;
    fitBoundsOnUpdate?: boolean;
  }

  export default class HeatmapLayer extends Component<HeatmapLayerProps> {}
}
