// Heavily inspired from work of @davidgilbertson on Github and `leaflet-geoman` project.
import MapboxDraw from "@mapbox/mapbox-gl-draw";

const { geojsonTypes } = MapboxDraw.constants;

import bboxPolygon from "@turf/bbox-polygon";
import booleanDisjoint from "@turf/boolean-disjoint";
import { getCoords } from "@turf/invariant";
import distance from "@turf/distance";
import polygonToLine from "@turf/polygon-to-line";
import nearestPointOnLine from "@turf/nearest-point-on-line";
import nearestPointInPointSet from "@turf/nearest-point";
import midpoint from "@turf/midpoint";
import {
  featureCollection,
  lineString as turfLineString,
  point as turfPoint,
} from "@turf/helpers";
import {
  GeoJSONSourceOptions,
  GeoJSONSourceRaw,
  LngLatLike,
  Map,
} from "mapbox-gl";

export const IDS = {
  VERTICAL_GUIDE: "VERTICAL_GUIDE",
  HORIZONTAL_GUIDE: "HORIZONTAL_GUIDE",
};

export const addPointTovertices = (
  map: Map,
  vertices: any,
  coordinates: LngLatLike,
  forceInclusion?: boolean
) => {
  const { width: w, height: h } = map.getCanvas();
  // Just add verteices of features currently visible in viewport
  const { x, y } = map.project(coordinates);
  const pointIsOnTheScreen = x > 0 && x < w && y > 0 && y < h;

  // But do add off-screen points if forced (e.g. for the current feature)
  // So features will always snap to their own points
  if (pointIsOnTheScreen || forceInclusion) {
    vertices.push(coordinates);
  }
};

export const createSnapList = (
  map: Map,
  draw: MapboxDraw,
  currentFeature: MapboxDraw.DrawFeature,
  sourcesIds: string[] = []
) => {
  // get all features from user's sources
  const sourcesFeatures = sourcesIds
    .map((id) => {
      const source = map.getSource(id);
      if (source.type === "geojson") {
        const sourceData: GeoJSONSourceOptions["data"] = (source as any)._data;
        if (!sourceData || typeof sourceData === "string") return [];

        if (sourceData.type === "FeatureCollection") {
          return sourceData.features;
        } else if (sourceData.type === "Feature") {
          return [sourceData];
        }

        return [];
      }
      return [];
    })
    .flat();

  // Get all drawn features and sources features
  const features = draw.getAll().features.concat(sourcesFeatures);
  const snapList: GeoJSON.Feature[] = [];

  // Get current bbox as polygon
  const bboxAsPolygon = (() => {
    const canvas = map.getCanvas(),
      w = canvas.width,
      h = canvas.height,
      cUL = map.unproject([0, 0]).toArray(),
      cUR = map.unproject([w, 0]).toArray(),
      cLR = map.unproject([w, h]).toArray(),
      cLL = map.unproject([0, h]).toArray();

    return bboxPolygon([cLL, cUR].flat() as GeoJSON.BBox);
  })();

  const vertices: any[] = [];

  // Keeps vertices for drwing guides
  const addVerticesTovertices = (
    coordinates: any,
    isCurrentFeature = false
  ) => {
    if (!Array.isArray(coordinates)) throw Error("Your array is not an array");

    if (Array.isArray(coordinates[0])) {
      // coordinates is an array of arrays, we must go deeper
      coordinates.forEach((coord) => {
        addVerticesTovertices(coord);
      });
    } else {
      // If not an array of arrays, only consider arrays with two items
      if (coordinates.length === 2) {
        addPointTovertices(map, vertices, coordinates as any, isCurrentFeature);
      }
    }
  };

  features.forEach((feature) => {
    // For currentfeature
    if (feature.id === currentFeature.id) {
      if (
        currentFeature.type === geojsonTypes.POLYGON &&
        !(
          feature.geometry.type === "GeometryCollection" ||
          feature.geometry.type === "Point"
        )
      ) {
        // For the current polygon, the last two points are the mouse position and back home
        // so we chop those off (else we get vertices showing where the user clicked, even
        // if they were just panning the map)
        addVerticesTovertices(
          feature.geometry.coordinates[0].slice(0, -2),
          true
        );
      }
      return;
    }

    // If this is re-running because a user is moving the map, the features might include
    // vertices or the last leg of a polygon
    if (
      feature.id === IDS.HORIZONTAL_GUIDE ||
      feature.id === IDS.VERTICAL_GUIDE
    )
      return;

    if (
      !(
        feature.geometry.type === "GeometryCollection" ||
        feature.geometry.type === "Point"
      )
    ) {
      addVerticesTovertices(feature.geometry.coordinates);
    }

    // If feature is currently on viewport add to snap list
    if (!booleanDisjoint(bboxAsPolygon, feature)) {
      snapList.push(feature);
    }
  });

  return [snapList, vertices];
};

const getNearbyvertices = (vertices: any, coords: any) => {
  const verticals: any[] = [];
  const horizontals: any[] = [];

  vertices.forEach((vertex: any) => {
    verticals.push(vertex[0]);
    horizontals.push(vertex[1]);
  });

  const nearbyVerticalGuide = verticals.find(
    (px) => Math.abs(px - coords.lng) < 0.009
  );

  const nearbyHorizontalGuide = horizontals.find(
    (py) => Math.abs(py - coords.lat) < 0.009
  );

  return {
    verticalPx: nearbyVerticalGuide,
    horizontalPx: nearbyHorizontalGuide,
  };
};

const calcLayerDistances = (lngLat: any, layer: any) => {
  // the point P which we want to snap (probpably the marker that is dragged)
  const P = [lngLat.lng, lngLat.lat];

  // is this a marker?
  const isMarker = layer.geometry.type === "Point";
  // is it a polygon?
  const isPolygon = layer.geometry.type === "Polygon";
  // is it a multiPolygon?
  const isMultiPolygon = layer.geometry.type === "MultiPolygon";
  // is it a multiPoint?
  const isMultiPoint = layer.geometry.type === "MultiPoint";

  let lines = undefined;

  // the coords of the layer
  const latlngs = getCoords(layer);

  if (isMarker) {
    const [lng, lat] = latlngs;
    // return the info for the marker, no more calculations needed
    return {
      latlng: { lng, lat },
      distance: distance(latlngs, P),
    };
  }

  if (isMultiPoint) {
    const np = nearestPointInPointSet(
      P,
      featureCollection(latlngs.map((x) => turfPoint(x)))
    );
    const c = np.geometry.coordinates;
    return {
      latlng: { lng: c[0], lat: c[1] },
      distance: np.properties.distanceToPoint,
    };
  }

  if (isPolygon || isMultiPolygon) {
    lines = polygonToLine(layer);
  } else {
    lines = layer;
  }

  let nearestPoint;
  if (isPolygon) {
    let lineStrings;
    if (lines.geometry.type === "LineString") {
      lineStrings = [turfLineString(lines.geometry.coordinates)];
    } else {
      lineStrings = lines.geometry.coordinates.map((coords: any) =>
        turfLineString(coords)
      );
    }

    const closestFeature = getFeatureWithNearestPoint(lineStrings, P);
    lines = closestFeature.feature;
    nearestPoint = closestFeature.point;
  } else if (isMultiPolygon) {
    const lineStrings = lines.features
      .map((feat: any) => {
        if (feat.geometry.type === "LineString") {
          return [feat.geometry.coordinates];
        } else {
          return feat.geometry.coordinates;
        }
      })
      .flatMap((coords: any) => coords)
      .map((coords: any) => turfLineString(coords));

    const closestFeature = getFeatureWithNearestPoint(lineStrings, P);
    lines = closestFeature.feature;
    nearestPoint = closestFeature.point;
  } else {
    nearestPoint = nearestPointOnLine(lines, P);
  }

  const [lng, lat] = nearestPoint.geometry.coordinates;

  let segmentIndex = nearestPoint.properties.index;
  if (segmentIndex + 1 === lines.geometry.coordinates.length) segmentIndex--;

  return {
    latlng: { lng, lat },
    segment: lines.geometry.coordinates.slice(segmentIndex, segmentIndex + 2),
    distance: nearestPoint.properties.dist,
    isMarker,
  };
};

function getFeatureWithNearestPoint(lineStrings: any, P: any) {
  const nearestPointsOfEachFeature = lineStrings.map((feat: any) => ({
    feature: feat,
    point: nearestPointOnLine(feat, P),
  }));

  nearestPointsOfEachFeature.sort(
    (a: any, b: any) => a.point.properties.dist - b.point.properties.dist
  );

  return {
    feature: nearestPointsOfEachFeature[0].feature,
    point: nearestPointsOfEachFeature[0].point,
  };
}

const calcClosestLayer = (lngLat: any, layers: any) => {
  let closestLayer: any = {};

  // loop through the layers
  layers.forEach((layer: any, index: any) => {
    // find the closest latlng, segment and the distance of this layer to the dragged marker latlng
    const results = calcLayerDistances(lngLat, layer);

    // save the info if it doesn't exist or if the distance is smaller than the previous one
    if (
      closestLayer.distance === undefined ||
      results.distance < closestLayer.distance
    ) {
      closestLayer = results;
      closestLayer.layer = layer;
    }
  });

  // return the closest layer and it's data
  // if there is no closest layer, return undefined
  return closestLayer;
};

// minimal distance before marker snaps (in pixels)
const metersPerPixel = function (latitude: any, zoomLevel: any) {
  const earthCircumference = 40075017;
  const latitudeRadians = latitude * (Math.PI / 180);
  return (
    (earthCircumference * Math.cos(latitudeRadians)) /
    Math.pow(2, zoomLevel + 8)
  );
};

// we got the point we want to snap to (C), but we need to check if a coord of the polygon
function snapToLineOrPolygon(
  closestLayer: any,
  snapOptions: any,
  snapVertexPriorityDistance: any
) {
  // A and B are the points of the closest segment to P (the marker position we want to snap)
  const A = closestLayer.segment[0];
  const B = closestLayer.segment[1];

  // C is the point we would snap to on the segment.
  // The closest point on the closest segment of the closest polygon to P. That's right.
  const C = [closestLayer.latlng.lng, closestLayer.latlng.lat];

  // distances from A to C and B to C to check which one is closer to C
  const distanceAC = distance(A, C);
  const distanceBC = distance(B, C);

  // closest latlng of A and B to C
  let closestVertexLatLng = distanceAC < distanceBC ? A : B;

  // distance between closestVertexLatLng and C
  let shortestDistance = distanceAC < distanceBC ? distanceAC : distanceBC;

  // snap to middle (M) of segment if option is enabled
  if (snapOptions && snapOptions.snapToMidPoints) {
    const M = midpoint(A, B).geometry.coordinates;
    const distanceMC = distance(M, C);

    if (distanceMC < distanceAC && distanceMC < distanceBC) {
      // M is the nearest vertex
      closestVertexLatLng = M;
      shortestDistance = distanceMC;
    }
  }

  // the distance that needs to be undercut to trigger priority
  const priorityDistance = snapVertexPriorityDistance;

  // the latlng we ultemately want to snap to
  let snapLatlng;

  // if C is closer to the closestVertexLatLng (A, B or M) than the snapDistance,
  // the closestVertexLatLng has priority over C as the snapping point.
  if (shortestDistance < priorityDistance) {
    snapLatlng = closestVertexLatLng;
  } else {
    snapLatlng = C;
  }

  // return the copy of snapping point
  const [lng, lat] = snapLatlng;
  return { lng, lat };
}

function snapToPoint(closestLayer: any) {
  return closestLayer.latlng;
}

const checkPrioritiySnapping = (
  closestLayer: any,
  snapOptions: any,
  snapVertexPriorityDistance = 1.25
) => {
  let snappingToPoint = !Array.isArray(closestLayer.segment);
  if (snappingToPoint) {
    return snapToPoint(closestLayer);
  } else {
    return snapToLineOrPolygon(
      closestLayer,
      snapOptions,
      snapVertexPriorityDistance
    );
  }
};

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
export const snap = (state: any, e: any) => {
  let lng = e.lngLat.lng;
  let lat = e.lngLat.lat;

  // Holding alt bypasses all snapping
  if (e.originalEvent.altKey) {
    state.showVerticalSnapLine = false;
    state.showHorizontalSnapLine = false;

    return { lng, lat };
  }

  if (state.snapList.length <= 0) {
    return { lng, lat };
  }

  // snapping is on
  let closestLayer, minDistance, snapLatLng;
  if (state.options.snap) {
    closestLayer = calcClosestLayer({ lng, lat }, state.snapList);

    // if no layers found. Can happen when circle is the only visible layer on the map and the hidden snapping-border circle layer is also on the map
    if (Object.keys(closestLayer).length === 0) {
      return false;
    }

    const isMarker = closestLayer.isMarker;
    const snapVertexPriorityDistance = state.options.snapOptions
      ? state.options.snapOptions.snapVertexPriorityDistance
      : undefined;

    if (!isMarker) {
      snapLatLng = checkPrioritiySnapping(
        closestLayer,
        state.options.snapOptions,
        snapVertexPriorityDistance
      );
      // snapLatLng = closestLayer.latlng;
    } else {
      snapLatLng = closestLayer.latlng;
    }

    minDistance =
      ((state.options.snapOptions && state.options.snapOptions.snapPx) || 15) *
      metersPerPixel(snapLatLng.lat, state.map.getZoom());
  }

  let verticalPx, horizontalPx;
  if (state.options.guides) {
    const nearestGuidline = getNearbyvertices(state.vertices, e.lngLat);

    verticalPx = nearestGuidline.verticalPx;
    horizontalPx = nearestGuidline.horizontalPx;

    if (verticalPx) {
      // Draw a line from top to bottom

      const lngLatTop = { lng: verticalPx, lat: e.lngLat.lat + 10 };
      const lngLatBottom = { lng: verticalPx, lat: e.lngLat.lat - 10 };

      state.verticalGuide.updateCoordinate(0, lngLatTop.lng, lngLatTop.lat);
      state.verticalGuide.updateCoordinate(
        1,
        lngLatBottom.lng,
        lngLatBottom.lat
      );
    }

    if (horizontalPx) {
      // Draw a line from left to right

      const lngLatTop = { lng: e.lngLat.lng + 10, lat: horizontalPx };
      const lngLatBottom = { lng: e.lngLat.lng - 10, lat: horizontalPx };

      state.horizontalGuide.updateCoordinate(0, lngLatTop.lng, lngLatTop.lat);
      state.horizontalGuide.updateCoordinate(
        1,
        lngLatBottom.lng,
        lngLatBottom.lat
      );
    }

    state.showVerticalSnapLine = !!verticalPx;
    state.showHorizontalSnapLine = !!horizontalPx;
  }

  if (
    minDistance &&
    closestLayer &&
    closestLayer.distance * 1000 < minDistance
  ) {
    return snapLatLng;
  } else if (verticalPx || horizontalPx) {
    if (verticalPx) {
      lng = verticalPx;
    }
    if (horizontalPx) {
      lat = horizontalPx;
    }
    return { lng, lat };
  } else {
    return { lng, lat };
  }
};

export const getGuideFeature = (id: any) => ({
  id,
  type: geojsonTypes.FEATURE,
  properties: {
    isSnapGuide: "true", // for styling
  },
  geometry: {
    type: geojsonTypes.LINE_STRING,
    coordinates: [],
  },
});

export const shouldHideGuide = (state: any, geojson: any) => {
  if (
    geojson.properties.id === IDS.VERTICAL_GUIDE &&
    (!state.options.guides || !state.showVerticalSnapLine)
  ) {
    return true;
  }

  if (
    geojson.properties.id === IDS.HORIZONTAL_GUIDE &&
    (!state.options.guides || !state.showHorizontalSnapLine)
  ) {
    return true;
  }

  return false;
};
