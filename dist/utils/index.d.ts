import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { LngLatLike, Map } from "mapbox-gl";
export declare const IDS: {
    VERTICAL_GUIDE: string;
    HORIZONTAL_GUIDE: string;
};
export declare const addPointTovertices: (map: Map, vertices: any, coordinates: LngLatLike, forceInclusion?: boolean) => void;
export declare const createSnapList: (map: Map, draw: MapboxDraw, currentFeature: MapboxDraw.DrawFeature, sourcesIds?: string[]) => any[][];
/**
 * Returns snap points if there are any, otherwise the original lng/lat of the event
 * Also, defines if vertices should show on the state object
 *
 * Mutates the state object
 *
 * @param state
 * @param e
 * @returns {{lng: number, lat: number}}
 */
export declare const snap: (state: any, e: any) => any;
export declare const getGuideFeature: (id: any) => {
    id: any;
    type: "Feature";
    properties: {
        isSnapGuide: string;
    };
    geometry: {
        type: "LineString";
        coordinates: never[];
    };
};
export declare const shouldHideGuide: (state: any, geojson: any) => boolean;
