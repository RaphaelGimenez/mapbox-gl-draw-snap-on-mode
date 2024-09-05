import MapboxDraw from "@mapbox/mapbox-gl-draw";
interface DirectSelectMode extends MapboxDraw.DrawCustomMode {
    pathsToCoordinates: (featureId: string, paths: any) => any;
    dragVertex: (state: any, e: any, delta: any) => void;
}
declare const SnapDirectSelect: {
    pathsToCoordinates: (featureId: string, paths: any) => any;
    dragVertex: (state: any, e: any, delta: any) => void;
    onSetup?(this: MapboxDraw.DrawCustomModeThis & DirectSelectMode, options: any): any;
    onDrag?(this: MapboxDraw.DrawCustomModeThis & DirectSelectMode, state: any, e: MapboxDraw.MapMouseEvent): void;
    onClick?(this: MapboxDraw.DrawCustomModeThis & DirectSelectMode, state: any, e: MapboxDraw.MapMouseEvent): void;
    onMouseMove?(this: MapboxDraw.DrawCustomModeThis & DirectSelectMode, state: any, e: MapboxDraw.MapMouseEvent): void;
    onMouseDown?(this: MapboxDraw.DrawCustomModeThis & DirectSelectMode, state: any, e: MapboxDraw.MapMouseEvent): void;
    onMouseUp?(this: MapboxDraw.DrawCustomModeThis & DirectSelectMode, state: any, e: MapboxDraw.MapMouseEvent): void;
    onMouseOut?(this: MapboxDraw.DrawCustomModeThis & DirectSelectMode, state: any, e: MapboxDraw.MapMouseEvent): void;
    onKeyUp?(this: MapboxDraw.DrawCustomModeThis & DirectSelectMode, state: any, e: KeyboardEvent): void;
    onKeyDown?(this: MapboxDraw.DrawCustomModeThis & DirectSelectMode, state: any, e: KeyboardEvent): void;
    onTouchStart?(this: MapboxDraw.DrawCustomModeThis & DirectSelectMode, state: any, e: MapboxDraw.MapTouchEvent): void;
    onTouchMove?(this: MapboxDraw.DrawCustomModeThis & DirectSelectMode, state: any, e: MapboxDraw.MapTouchEvent): void;
    onTouchEnd?(this: MapboxDraw.DrawCustomModeThis & DirectSelectMode, state: any, e: MapboxDraw.MapTouchEvent): void;
    onTap?(this: MapboxDraw.DrawCustomModeThis & DirectSelectMode, state: any, e: MapboxDraw.MapTouchEvent): void;
    onStop?(this: MapboxDraw.DrawCustomModeThis & DirectSelectMode, state: any): void;
    onTrash?(this: MapboxDraw.DrawCustomModeThis & DirectSelectMode, state: any): void;
    onCombineFeature?(this: MapboxDraw.DrawCustomModeThis & DirectSelectMode, state: any): void;
    onUncombineFeature?(this: MapboxDraw.DrawCustomModeThis & DirectSelectMode, state: any): void;
    toDisplayFeatures(this: MapboxDraw.DrawCustomModeThis & DirectSelectMode, state: any, geojson: import("geojson").GeoJSON, display: (geojson: import("geojson").GeoJSON) => void): void;
};
export default SnapDirectSelect;
