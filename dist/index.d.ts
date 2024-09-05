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
    interface MapboxDrawOptions extends SnapPolygonState {
    }
    interface DrawEvents {
        "draw.snap.options_changed": MapboxDraw.DrawCreateEvent;
    }
}
export { default as SnapPolygonMode } from "./modes/snap_polygon";
export { default as SnapDirectSelect } from "./modes/snap_direct_select";
export { default as SnapModeDrawStyles } from "./utils/customDrawStyles";
export * as Utils from "./utils/index";
