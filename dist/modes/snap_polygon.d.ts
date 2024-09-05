import MapboxDraw from "@mapbox/mapbox-gl-draw";
declare const SnapPolygonMode: {
    onSetup?(this: MapboxDraw.DrawCustomModeThis & MapboxDraw.DrawCustomMode<any, any>, options: any): any;
    onDrag?(this: MapboxDraw.DrawCustomModeThis & MapboxDraw.DrawCustomMode<any, any>, state: any, e: MapboxDraw.MapMouseEvent): void;
    onClick?(this: MapboxDraw.DrawCustomModeThis & MapboxDraw.DrawCustomMode<any, any>, state: any, e: MapboxDraw.MapMouseEvent): void;
    onMouseMove?(this: MapboxDraw.DrawCustomModeThis & MapboxDraw.DrawCustomMode<any, any>, state: any, e: MapboxDraw.MapMouseEvent): void;
    onMouseDown?(this: MapboxDraw.DrawCustomModeThis & MapboxDraw.DrawCustomMode<any, any>, state: any, e: MapboxDraw.MapMouseEvent): void;
    onMouseUp?(this: MapboxDraw.DrawCustomModeThis & MapboxDraw.DrawCustomMode<any, any>, state: any, e: MapboxDraw.MapMouseEvent): void;
    onMouseOut?(this: MapboxDraw.DrawCustomModeThis & MapboxDraw.DrawCustomMode<any, any>, state: any, e: MapboxDraw.MapMouseEvent): void;
    onKeyUp?(this: MapboxDraw.DrawCustomModeThis & MapboxDraw.DrawCustomMode<any, any>, state: any, e: KeyboardEvent): void;
    onKeyDown?(this: MapboxDraw.DrawCustomModeThis & MapboxDraw.DrawCustomMode<any, any>, state: any, e: KeyboardEvent): void;
    onTouchStart?(this: MapboxDraw.DrawCustomModeThis & MapboxDraw.DrawCustomMode<any, any>, state: any, e: MapboxDraw.MapTouchEvent): void;
    onTouchMove?(this: MapboxDraw.DrawCustomModeThis & MapboxDraw.DrawCustomMode<any, any>, state: any, e: MapboxDraw.MapTouchEvent): void;
    onTouchEnd?(this: MapboxDraw.DrawCustomModeThis & MapboxDraw.DrawCustomMode<any, any>, state: any, e: MapboxDraw.MapTouchEvent): void;
    onTap?(this: MapboxDraw.DrawCustomModeThis & MapboxDraw.DrawCustomMode<any, any>, state: any, e: MapboxDraw.MapTouchEvent): void;
    onStop?(this: MapboxDraw.DrawCustomModeThis & MapboxDraw.DrawCustomMode<any, any>, state: any): void;
    onTrash?(this: MapboxDraw.DrawCustomModeThis & MapboxDraw.DrawCustomMode<any, any>, state: any): void;
    onCombineFeature?(this: MapboxDraw.DrawCustomModeThis & MapboxDraw.DrawCustomMode<any, any>, state: any): void;
    onUncombineFeature?(this: MapboxDraw.DrawCustomModeThis & MapboxDraw.DrawCustomMode<any, any>, state: any): void;
    toDisplayFeatures(this: MapboxDraw.DrawCustomModeThis & MapboxDraw.DrawCustomMode<any, any>, state: any, geojson: import("geojson").GeoJSON, display: (geojson: import("geojson").GeoJSON) => void): void;
};
export type SnapPolygonState = {
    snap?: boolean;
    snapOptions: {
        snapPx?: number;
        snapToMidPoints?: boolean;
        snapVertexPriorityDistance?: number;
        sources?: string[];
    };
};
export default SnapPolygonMode;
