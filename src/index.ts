import * as MapboxDraw from "@mapbox/mapbox-gl-draw";

export type SnapPolygonState = {
  snap?: boolean;
  snapOptions: {
    snapPx?: number;
    snapToMidPoints?: boolean;
    snapVertexPriorityDistance?: number;
    sources?: string[];
  };
  guides?: boolean;
};

declare module "@mapbox/mapbox-gl-draw" {
  export interface MapboxDrawOptions extends SnapPolygonState {}

  export interface DrawEvents {
    "draw.snap.options_changed": MapboxDraw.DrawCreateEvent;
  }
}

// export { default as SnapPointMode } from "./modes/snap_point";
// export { default as SnapLineMode } from "./modes/snap_line";
export { default as SnapPolygonMode } from "./modes/snap_polygon";
export { default as SnapDirectSelect } from "./modes/snap_direct_select";

export { default as SnapModeDrawStyles } from "./utils/customDrawStyles";
export * as Utils from "./utils/index";
