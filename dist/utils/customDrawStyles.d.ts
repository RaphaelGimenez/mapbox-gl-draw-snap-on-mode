declare const customDrawStyles: ((import("mapbox-gl").FillLayerSpecification & {
    id: import("@mapbox/mapbox-gl-draw").ThemeLayerId;
}) | (import("mapbox-gl").LineLayerSpecification & {
    id: import("@mapbox/mapbox-gl-draw").ThemeLayerId;
}) | (import("mapbox-gl").CircleLayerSpecification & {
    id: import("@mapbox/mapbox-gl-draw").ThemeLayerId;
}) | {
    filter: any[];
    id: "gl-draw-polygon-fill-static" | "gl-draw-polygon-fill-active" | "gl-draw-polygon-fill-inactive" | "gl-draw-polygon-stroke-static" | "gl-draw-polygon-stroke-active" | "gl-draw-polygon-stroke-inactive" | "gl-draw-polygon-midpoint" | "gl-draw-polygon-and-line-vertex-inactive" | "gl-draw-polygon-and-line-vertex-stroke-inactive" | "gl-draw-line-static" | "gl-draw-line-active" | "gl-draw-line-inactive" | "gl-draw-point-static" | "gl-draw-point-active" | "gl-draw-point-inactive" | "gl-draw-point-stroke-active" | "gl-draw-point-point-stroke-inactive";
    type: "fill";
    metadata?: unknown;
    source: string;
    "source-layer"?: string;
    slot?: string;
    minzoom?: number;
    maxzoom?: number;
    layout?: {
        "fill-sort-key"?: import("mapbox-gl").DataDrivenPropertyValueSpecification<number>;
        "visibility"?: "visible" | "none" | import("mapbox-gl").ExpressionSpecification;
    };
    paint?: {
        "fill-antialias"?: import("mapbox-gl").PropertyValueSpecification<boolean>;
        "fill-opacity"?: import("mapbox-gl").DataDrivenPropertyValueSpecification<number>;
        "fill-opacity-transition"?: import("mapbox-gl").TransitionSpecification;
        "fill-color"?: import("mapbox-gl").DataDrivenPropertyValueSpecification<import("mapbox-gl").ColorSpecification>;
        "fill-color-transition"?: import("mapbox-gl").TransitionSpecification;
        "fill-outline-color"?: import("mapbox-gl").DataDrivenPropertyValueSpecification<import("mapbox-gl").ColorSpecification>;
        "fill-outline-color-transition"?: import("mapbox-gl").TransitionSpecification;
        "fill-translate"?: import("mapbox-gl").PropertyValueSpecification<[number, number]>;
        "fill-translate-transition"?: import("mapbox-gl").TransitionSpecification;
        "fill-translate-anchor"?: import("mapbox-gl").PropertyValueSpecification<"map" | "viewport">;
        "fill-pattern"?: import("mapbox-gl").DataDrivenPropertyValueSpecification<import("mapbox-gl").ResolvedImageSpecification>;
        "fill-emissive-strength"?: import("mapbox-gl").PropertyValueSpecification<number>;
        "fill-emissive-strength-transition"?: import("mapbox-gl").TransitionSpecification;
    };
} | {
    filter: any[];
    id: "gl-draw-polygon-fill-static" | "gl-draw-polygon-fill-active" | "gl-draw-polygon-fill-inactive" | "gl-draw-polygon-stroke-static" | "gl-draw-polygon-stroke-active" | "gl-draw-polygon-stroke-inactive" | "gl-draw-polygon-midpoint" | "gl-draw-polygon-and-line-vertex-inactive" | "gl-draw-polygon-and-line-vertex-stroke-inactive" | "gl-draw-line-static" | "gl-draw-line-active" | "gl-draw-line-inactive" | "gl-draw-point-static" | "gl-draw-point-active" | "gl-draw-point-inactive" | "gl-draw-point-stroke-active" | "gl-draw-point-point-stroke-inactive";
    type: "line";
    metadata?: unknown;
    source: string;
    "source-layer"?: string;
    slot?: string;
    minzoom?: number;
    maxzoom?: number;
    layout?: {
        "line-cap"?: import("mapbox-gl").DataDrivenPropertyValueSpecification<"butt" | "round" | "square">;
        "line-join"?: import("mapbox-gl").DataDrivenPropertyValueSpecification<"bevel" | "round" | "miter" | "none">;
        "line-miter-limit"?: import("mapbox-gl").PropertyValueSpecification<number>;
        "line-round-limit"?: import("mapbox-gl").PropertyValueSpecification<number>;
        "line-sort-key"?: import("mapbox-gl").DataDrivenPropertyValueSpecification<number>;
        "line-z-offset"?: import("mapbox-gl").DataDrivenPropertyValueSpecification<number>;
        "visibility"?: "visible" | "none" | import("mapbox-gl").ExpressionSpecification;
    };
    paint?: {
        "line-opacity"?: import("mapbox-gl").DataDrivenPropertyValueSpecification<number>;
        "line-opacity-transition"?: import("mapbox-gl").TransitionSpecification;
        "line-color"?: import("mapbox-gl").DataDrivenPropertyValueSpecification<import("mapbox-gl").ColorSpecification>;
        "line-color-transition"?: import("mapbox-gl").TransitionSpecification;
        "line-translate"?: import("mapbox-gl").PropertyValueSpecification<[number, number]>;
        "line-translate-transition"?: import("mapbox-gl").TransitionSpecification;
        "line-translate-anchor"?: import("mapbox-gl").PropertyValueSpecification<"map" | "viewport">;
        "line-width"?: import("mapbox-gl").DataDrivenPropertyValueSpecification<number>;
        "line-width-transition"?: import("mapbox-gl").TransitionSpecification;
        "line-gap-width"?: import("mapbox-gl").DataDrivenPropertyValueSpecification<number>;
        "line-gap-width-transition"?: import("mapbox-gl").TransitionSpecification;
        "line-offset"?: import("mapbox-gl").DataDrivenPropertyValueSpecification<number>;
        "line-offset-transition"?: import("mapbox-gl").TransitionSpecification;
        "line-blur"?: import("mapbox-gl").DataDrivenPropertyValueSpecification<number>;
        "line-blur-transition"?: import("mapbox-gl").TransitionSpecification;
        "line-dasharray"?: import("mapbox-gl").DataDrivenPropertyValueSpecification<Array<number>>;
        "line-pattern"?: import("mapbox-gl").DataDrivenPropertyValueSpecification<import("mapbox-gl").ResolvedImageSpecification>;
        "line-gradient"?: import("mapbox-gl").ExpressionSpecification;
        "line-trim-offset"?: [number, number];
        "line-trim-fade-range"?: import("mapbox-gl").PropertyValueSpecification<[number, number]>;
        "line-trim-color"?: import("mapbox-gl").PropertyValueSpecification<import("mapbox-gl").ColorSpecification>;
        "line-trim-color-transition"?: import("mapbox-gl").TransitionSpecification;
        "line-emissive-strength"?: import("mapbox-gl").PropertyValueSpecification<number>;
        "line-emissive-strength-transition"?: import("mapbox-gl").TransitionSpecification;
        "line-border-width"?: import("mapbox-gl").DataDrivenPropertyValueSpecification<number>;
        "line-border-width-transition"?: import("mapbox-gl").TransitionSpecification;
        "line-border-color"?: import("mapbox-gl").DataDrivenPropertyValueSpecification<import("mapbox-gl").ColorSpecification>;
        "line-border-color-transition"?: import("mapbox-gl").TransitionSpecification;
        "line-occlusion-opacity"?: import("mapbox-gl").PropertyValueSpecification<number>;
        "line-occlusion-opacity-transition"?: import("mapbox-gl").TransitionSpecification;
    };
} | {
    filter: any[];
    id: "gl-draw-polygon-fill-static" | "gl-draw-polygon-fill-active" | "gl-draw-polygon-fill-inactive" | "gl-draw-polygon-stroke-static" | "gl-draw-polygon-stroke-active" | "gl-draw-polygon-stroke-inactive" | "gl-draw-polygon-midpoint" | "gl-draw-polygon-and-line-vertex-inactive" | "gl-draw-polygon-and-line-vertex-stroke-inactive" | "gl-draw-line-static" | "gl-draw-line-active" | "gl-draw-line-inactive" | "gl-draw-point-static" | "gl-draw-point-active" | "gl-draw-point-inactive" | "gl-draw-point-stroke-active" | "gl-draw-point-point-stroke-inactive";
    type: "circle";
    metadata?: unknown;
    source: string;
    "source-layer"?: string;
    slot?: string;
    minzoom?: number;
    maxzoom?: number;
    layout?: {
        "circle-sort-key"?: import("mapbox-gl").DataDrivenPropertyValueSpecification<number>;
        "visibility"?: "visible" | "none" | import("mapbox-gl").ExpressionSpecification;
    };
    paint?: {
        "circle-radius"?: import("mapbox-gl").DataDrivenPropertyValueSpecification<number>;
        "circle-radius-transition"?: import("mapbox-gl").TransitionSpecification;
        "circle-color"?: import("mapbox-gl").DataDrivenPropertyValueSpecification<import("mapbox-gl").ColorSpecification>;
        "circle-color-transition"?: import("mapbox-gl").TransitionSpecification;
        "circle-blur"?: import("mapbox-gl").DataDrivenPropertyValueSpecification<number>;
        "circle-blur-transition"?: import("mapbox-gl").TransitionSpecification;
        "circle-opacity"?: import("mapbox-gl").DataDrivenPropertyValueSpecification<number>;
        "circle-opacity-transition"?: import("mapbox-gl").TransitionSpecification;
        "circle-translate"?: import("mapbox-gl").PropertyValueSpecification<[number, number]>;
        "circle-translate-transition"?: import("mapbox-gl").TransitionSpecification;
        "circle-translate-anchor"?: import("mapbox-gl").PropertyValueSpecification<"map" | "viewport">;
        "circle-pitch-scale"?: import("mapbox-gl").PropertyValueSpecification<"map" | "viewport">;
        "circle-pitch-alignment"?: import("mapbox-gl").PropertyValueSpecification<"map" | "viewport">;
        "circle-stroke-width"?: import("mapbox-gl").DataDrivenPropertyValueSpecification<number>;
        "circle-stroke-width-transition"?: import("mapbox-gl").TransitionSpecification;
        "circle-stroke-color"?: import("mapbox-gl").DataDrivenPropertyValueSpecification<import("mapbox-gl").ColorSpecification>;
        "circle-stroke-color-transition"?: import("mapbox-gl").TransitionSpecification;
        "circle-stroke-opacity"?: import("mapbox-gl").DataDrivenPropertyValueSpecification<number>;
        "circle-stroke-opacity-transition"?: import("mapbox-gl").TransitionSpecification;
        "circle-emissive-strength"?: import("mapbox-gl").PropertyValueSpecification<number>;
        "circle-emissive-strength-transition"?: import("mapbox-gl").TransitionSpecification;
    };
} | {
    id: string;
    type: string;
    filter: (string | string[])[];
    layout: {
        "line-cap": string;
        "line-join": string;
    };
    paint: {
        "line-color": string;
        "line-width": number;
        "line-dasharray": number[];
    };
})[];
export default customDrawStyles;
