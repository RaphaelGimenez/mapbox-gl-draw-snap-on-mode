import * as MapboxDraw from "@mapbox/mapbox-gl-draw";

export type SnapPolygonState = {
  snap?: boolean;
  snapOptions: {
    snapPx?: number;
    snapToMidPoints?: boolean;
    snapVertexPriorityDistance?: number;
    sources?: string[];
  };
};

declare module "@mapbox/mapbox-gl-draw" {
  export interface MapboxDrawOptions
    extends MapboxDraw.MapboxDrawOptions,
      SnapPolygonState {}
}
